import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ─── Physics Constants ────────────────────────────────────────────────────────
const C = 3e8;
const PI = Math.PI;

// ─── Core Link Budget Math ────────────────────────────────────────────────────
function computeLinkBudget({ distKm, txPowerDbm, txApertureM, rxApertureM,
  wavelengthNm, pointingErrorDeg, atmosphericLossDpkm }) {
  const lambda = wavelengthNm * 1e-9;
  const d = distKm * 1e3;
  const thetaPoint = (pointingErrorDeg * PI) / 180;
  const thetaDiv = (2.44 * lambda) / txApertureM;
  const Lfs = 20 * Math.log10((4 * PI * d) / lambda);
  const Gt = 10 * Math.log10(Math.pow((PI * txApertureM / lambda), 2));
  const Gr = 10 * Math.log10(Math.pow((PI * rxApertureM / lambda), 2));
  const pointingLossDb = 4.343 * Math.pow(thetaPoint / thetaDiv, 2);
  const atmosphericLossDb = atmosphericLossDpkm * distKm;
  const Prx_dBm = txPowerDbm + Gt + Gr - Lfs - pointingLossDb - atmosphericLossDb;
  const sensitivity_dBm = -50;
  const linkMargin_dB = Prx_dBm - sensitivity_dBm;
  const h = 6.626e-34;
  const f = C / lambda;
  const B = 1e9;
  const Prx_W = Math.pow(10, (Prx_dBm - 30) / 10);
  const SNR_linear = Prx_W / (h * f * B);
  const SNR_dB = SNR_linear > 0 ? 10 * Math.log10(SNR_linear) : -999;
  const qArg = Math.sqrt(Math.max(SNR_linear / 2, 0));
  const BER = qArg > 0 ? 0.5 * erfc(qArg) : 0.5;
  const linkViable = linkMargin_dB >= 0 && BER < 1e-6;
  return {
    thetaDiv_urad: thetaDiv * 1e6,
    pointingError_urad: thetaPoint * 1e6,
    pointingLossDb,
    atmosphericLossDb,
    freeSpaceLossDb: Lfs,
    txGain_dB: Gt,
    rxGain_dB: Gr,
    rxPower_dBm: Prx_dBm,
    linkMargin_dB,
    SNR_dB,
    BER,
    linkViable,
    sensitivity_dBm,
  };
}

function erfc(x) {
  if (x < 0) return 2 - erfc(-x);
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return poly * Math.exp(-x * x);
}

// ─── ISRO Scenario Presets ────────────────────────────────────────────────────
const ISRO_PRESETS = [
  {
    id: 'leo500',
    label: 'LEO — 500 km',
    desc: 'ISS-class orbit. 7.5 deg/s angular rate.',
    color: '#38bdf8',
    params: { distKm: 500, txPowerDbm: 33, txApertureM: 0.15, rxApertureM: 0.20, wavelengthNm: 1550, atmosphericLossDpkm: 0.001 },
  },
  {
    id: 'geo36k',
    label: 'GEO — 36,000 km',
    desc: 'Geostationary. Near-zero angular rate.',
    color: '#a855f7',
    params: { distKm: 36000, txPowerDbm: 40, txApertureM: 0.30, rxApertureM: 0.40, wavelengthNm: 1064, atmosphericLossDpkm: 0.0001 },
  },
  {
    id: 'uav2k',
    label: 'UAV — 2 km',
    desc: 'Coastal turbulence Cn2=1e-14. 15 Hz vibration.',
    color: '#f59e0b',
    params: { distKm: 2, txPowerDbm: 27, txApertureM: 0.05, rxApertureM: 0.08, wavelengthNm: 1550, atmosphericLossDpkm: 0.5 },
  },
  {
    id: 'aircraft10k',
    label: 'Aircraft — 10 km',
    desc: 'Air-to-ground. Heavy turbulence + vibration.',
    color: '#ec4899',
    params: { distKm: 10, txPowerDbm: 30, txApertureM: 0.10, rxApertureM: 0.15, wavelengthNm: 1550, atmosphericLossDpkm: 0.1 },
  },
];

function pxRmsToDeg(pxRms, fov_deg, res_px) {
  return (pxRms / res_px) * fov_deg;
}

function generateSweepData(params, fov_deg, res_px) {
  const points = [];
  for (let pxRms = 0; pxRms <= 30; pxRms += 0.5) {
    const deg = pxRmsToDeg(pxRms, fov_deg, res_px);
    const result = computeLinkBudget({ ...params, pointingErrorDeg: deg });
    points.push({
      pxRms: parseFloat(pxRms.toFixed(1)),
      margin: parseFloat(result.linkMargin_dB.toFixed(2)),
      BER_exp: result.BER > 0 ? parseFloat(Math.log10(result.BER).toFixed(2)) : -20,
    });
  }
  return points;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r + ', ' + g + ', ' + b;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatBox = ({ label, value, unit, sub, color, warn }) => {
  const boxColor = color || 'var(--accent-cyan)';
  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      border: '1px solid ' + (warn ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.2)'),
      borderRadius: '8px', padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: '4px'
    }}>
      <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '22px', fontFamily: 'Share Tech Mono', color: warn ? '#ef4444' : boxColor, lineHeight: 1 }}>
        {value}<span style={{ fontSize: '12px', marginLeft: '4px', color: '#94a3b8' }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: '10px', color: '#64748b' }}>{sub}</div>}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'rgba(3,7,18,0.95)', border: '1px solid rgba(56,189,248,0.4)',
      borderRadius: '6px', padding: '10px 14px', fontSize: '11px', fontFamily: 'Share Tech Mono'
    }}>
      <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Error: {label} px RMS</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: '2px' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const LinkBudget = () => {
  const [selectedPresetId, setSelectedPresetId] = useState('leo500');
  const [laserPatRms, setLaserPatRms] = useState(3.9);
  const [params, setParams] = useState(ISRO_PRESETS[0].params);
  const [activeChart, setActiveChart] = useState('margin');
  const FOV_DEG = 10;
  const RES_PX = 640;

  const pointingErrorDeg = pxRmsToDeg(laserPatRms, FOV_DEG, RES_PX);
  const result = useMemo(() => computeLinkBudget({ ...params, pointingErrorDeg }), [params, pointingErrorDeg]);
  const sweepData = useMemo(() => generateSweepData(params, FOV_DEG, RES_PX), [params]);

  const loadPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setParams(preset.params);
  };

  const formatBER = (ber) => {
    if (ber <= 0) return '< 10^-20';
    const exp = Math.floor(Math.log10(ber));
    const man = (ber / Math.pow(10, exp)).toFixed(1);
    return man + ' x 10^' + exp;
  };

  const marginColor = result.linkMargin_dB >= 10 ? '#10b981' : result.linkMargin_dB >= 0 ? '#f59e0b' : '#ef4444';
  const currentPreset = ISRO_PRESETS.find(p => p.id === selectedPresetId);

  const waterfallItems = [
    { label: 'Tx Power', value: params.txPowerDbm, color: '#10b981' },
    { label: 'Tx Aperture Gain', value: result.txGain_dB, color: '#38bdf8' },
    { label: 'Rx Aperture Gain', value: result.rxGain_dB, color: '#38bdf8' },
    { label: 'Free-Space Loss', value: -result.freeSpaceLossDb, color: '#ef4444' },
    { label: 'Pointing Loss', value: -result.pointingLossDb, color: '#f59e0b' },
    { label: 'Atmospheric Loss', value: -result.atmosphericLossDb, color: '#a855f7' },
    { label: 'Received Power', value: result.rxPower_dBm, color: result.rxPower_dBm > -50 ? '#10b981' : '#ef4444', isTotal: true },
  ];

  const paramSliders = [
    { key: 'distKm', label: 'Range', unit: 'km', min: 1, max: 40000, step: 1 },
    { key: 'txPowerDbm', label: 'Tx Power', unit: 'dBm', min: 10, max: 50, step: 0.5 },
    { key: 'txApertureM', label: 'Tx Aperture', unit: 'm', min: 0.01, max: 1, step: 0.01 },
    { key: 'rxApertureM', label: 'Rx Aperture', unit: 'm', min: 0.01, max: 1, step: 0.01 },
    { key: 'wavelengthNm', label: 'Wavelength', unit: 'nm', min: 850, max: 1600, step: 5 },
    { key: 'atmosphericLossDpkm', label: 'Atm. Loss', unit: 'dB/km', min: 0, max: 5, step: 0.01 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--accent-cyan)', margin: 0, fontFamily: 'Orbitron', textShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
            LINK BUDGET ENGINE
          </h1>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
            LaserPAT RMS Error &rarr; Pointing Loss &rarr; Received Power &rarr; BER &rarr; Link Viability
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px',
          background: result.linkViable ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: '1px solid ' + (result.linkViable ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)')
        }}>
          {result.linkViable
            ? <CheckCircle size={16} color="#10b981" />
            : <AlertTriangle size={16} color="#ef4444" />}
          <span style={{ fontSize: '13px', fontFamily: 'Share Tech Mono', color: result.linkViable ? '#10b981' : '#ef4444' }}>
            LINK {result.linkViable ? 'VIABLE' : 'FAILED'}
          </span>
        </div>
      </div>

      {/* ── Scenario Presets ── */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '2px', marginBottom: '12px' }}>
          ISRO-RELEVANT DEPLOYMENT SCENARIOS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {ISRO_PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => loadPreset(p)}
              style={{
                padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                background: selectedPresetId === p.id ? 'rgba(' + hexToRgb(p.color) + ', 0.15)' : 'rgba(15,23,42,0.6)',
                border: '1px solid ' + (selectedPresetId === p.id ? p.color : 'rgba(56,189,248,0.15)'),
                color: '#f8fafc', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '11px', fontFamily: 'Share Tech Mono', color: p.color, marginBottom: '4px' }}>{p.label}</div>
              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.4 }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>

        {/* Left — Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* LaserPAT RMS Input */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '16px', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '8px' }}>
              LASERPAT TRACKING RESULT
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Tracking Error (RMS)</span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono' }}>{laserPatRms.toFixed(1)} px</span>
              </div>
              <input type="range" min="0.1" max="30" step="0.1" value={laserPatRms}
                onChange={e => setLaserPatRms(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', marginTop: '4px' }}>
                <span>0.1 px (ideal)</span><span>30 px (failed)</span>
              </div>
            </div>
            <div style={{ background: 'rgba(56,189,248,0.05)', borderRadius: '6px', padding: '10px', border: '1px solid rgba(56,189,248,0.15)', fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { lbl: 'Angular Error', val: (pointingErrorDeg * 1000).toFixed(3) + ' mrad' },
                { lbl: 'In Degrees', val: pointingErrorDeg.toFixed(4) + ' deg' },
                { lbl: 'Beam Divergence', val: result.thetaDiv_urad.toFixed(2) + ' urad' },
              ].map(({ lbl, val }) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>{lbl}</span>
                  <span style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '10px', color: '#64748b', fontStyle: 'italic', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              LaserPAT default: <strong style={{ color: '#94a3b8' }}>3.9 px RMS</strong> (moderate noise).
              Stress test: <strong style={{ color: '#94a3b8' }}>16.7 px RMS</strong>.
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '16px', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '8px' }}>
              LINK PARAMETERS
            </div>
            {paramSliders.map(({ key, label, unit, min, max, step }) => (
              <div key={key} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '5px' }}>
                  <span style={{ color: '#94a3b8' }}>{label}</span>
                  <span style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>{params[key]} {unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={params[key]}
                  onChange={e => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right — Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <StatBox label="Pointing Loss" value={result.pointingLossDb.toFixed(2)} unit="dB"
              sub={'Divergence: ' + result.thetaDiv_urad.toFixed(1) + ' urad'}
              warn={result.pointingLossDb > 3} />
            <StatBox label="Free-Space Loss" value={(result.freeSpaceLossDb / 1000).toFixed(2)} unit="x10^3 dB"
              sub={params.distKm.toLocaleString() + ' km range'} />
            <StatBox label="Rx Power" value={result.rxPower_dBm.toFixed(1)} unit="dBm"
              sub={'Sensitivity: ' + result.sensitivity_dBm + ' dBm'}
              warn={result.rxPower_dBm < result.sensitivity_dBm} />
            <StatBox label="Link Margin" value={result.linkMargin_dB.toFixed(1)} unit="dB"
              sub={result.linkMargin_dB >= 10 ? 'Robust margin' : result.linkMargin_dB >= 0 ? 'Marginal — monitor' : 'Link failed'}
              color={marginColor} warn={result.linkMargin_dB < 0} />
            <StatBox label="SNR" value={isFinite(result.SNR_dB) ? result.SNR_dB.toFixed(1) : 'N/A'} unit="dB"
              sub="Shot-noise limited @ 1 Gbps" warn={result.SNR_dB < 10} />
            <StatBox label="Bit Error Rate" value={formatBER(result.BER)} unit=""
              sub={result.BER < 1e-9 ? 'Error-free (<10^-9)' : result.BER < 1e-6 ? 'Acceptable with FEC' : 'High BER — link unusable'}
              warn={result.BER >= 1e-6} />
          </div>

          {/* Power Waterfall */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '2px', marginBottom: '14px' }}>POWER BUDGET WATERFALL</div>
            {waterfallItems.map((item, i) => {
              const maxVal = Math.max(Math.abs(params.txPowerDbm) + Math.abs(result.txGain_dB) + Math.abs(result.rxGain_dB), 1);
              const barWidth = Math.min(Math.abs(item.value) / maxVal * 100, 100);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px',
                  borderTop: item.isTotal ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  paddingTop: item.isTotal ? '7px' : '0',
                }}>
                  <div style={{ width: '130px', fontSize: '10px', color: item.isTotal ? '#f8fafc' : '#94a3b8', fontWeight: item.isTotal ? 600 : 400 }}>{item.label}</div>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: barWidth + '%', height: '100%', background: item.color, borderRadius: '3px', boxShadow: '0 0 8px ' + item.color + '66' }} />
                  </div>
                  <div style={{ width: '72px', textAlign: 'right', fontSize: '10px', color: item.color, fontFamily: 'Share Tech Mono' }}>
                    {item.value >= 0 ? '+' : ''}{item.value.toFixed(1)} dB
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '2px' }}>
                TRACKING ERROR vs. {activeChart === 'margin' ? 'LINK MARGIN' : 'BIT ERROR RATE (log scale)'}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[{ id: 'margin', lbl: 'MARGIN' }, { id: 'ber', lbl: 'BER' }].map(t => (
                  <button key={t.id} onClick={() => setActiveChart(t.id)} style={{
                    padding: '4px 12px', fontSize: '10px', fontFamily: 'Share Tech Mono', cursor: 'pointer', borderRadius: '4px',
                    border: '1px solid ' + (activeChart === t.id ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)'),
                    background: activeChart === t.id ? 'rgba(56,189,248,0.15)' : 'transparent',
                    color: activeChart === t.id ? 'var(--accent-cyan)' : '#94a3b8',
                  }}>{t.lbl}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              {activeChart === 'margin' ? (
                <AreaChart data={sweepData} margin={{ top: 5, right: 10, left: 0, bottom: 12 }}>
                  <defs>
                    <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="pxRms" stroke="#334155" fontSize={9} label={{ value: 'Tracking Error (px RMS)', position: 'insideBottom', offset: -8, fill: '#475569', fontSize: 9 }} />
                  <YAxis stroke="#334155" fontSize={9} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={laserPatRms} stroke="#38bdf8" strokeWidth={2} strokeDasharray="6 3"
                    label={{ value: 'LaserPAT ' + laserPatRms + 'px', position: 'top', fill: '#38bdf8', fontSize: 9 }} />
                  <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1}
                    label={{ value: 'Link Fails', position: 'right', fill: '#ef4444', fontSize: 9 }} />
                  <Area type="monotone" dataKey="margin" name="Link Margin (dB)" stroke="#10b981" fill="url(#marginGrad)" dot={false} strokeWidth={2} />
                </AreaChart>
              ) : (
                <LineChart data={sweepData} margin={{ top: 5, right: 10, left: 0, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="pxRms" stroke="#334155" fontSize={9} label={{ value: 'Tracking Error (px RMS)', position: 'insideBottom', offset: -8, fill: '#475569', fontSize: 9 }} />
                  <YAxis stroke="#334155" fontSize={9} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={laserPatRms} stroke="#38bdf8" strokeWidth={2} strokeDasharray="6 3"
                    label={{ value: 'LaserPAT ' + laserPatRms + 'px', position: 'top', fill: '#38bdf8', fontSize: 9 }} />
                  <ReferenceLine y={-6} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1}
                    label={{ value: '10^-6 threshold', position: 'right', fill: '#f59e0b', fontSize: 9 }} />
                  <Line type="monotone" dataKey="BER_exp" name="log10(BER)" stroke="#ec4899" dot={false} strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
            <div style={{ fontSize: '10px', color: '#475569', textAlign: 'center', marginTop: '6px', fontStyle: 'italic' }}>
              Gaussian beam model — OOK modulation, shot-noise limited, 1 Gbps data rate
            </div>
          </div>
        </div>
      </div>

      {/* ── Engineering Insight ── */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '2px', marginBottom: '12px' }}>
          ENGINEERING INSIGHT — DEPLOYMENT TRANSLATION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '11px' }}>
          <div style={{ borderLeft: '2px solid #38bdf8', paddingLeft: '12px' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '4px' }}>Pointing Loss at {laserPatRms}px RMS</div>
            <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              LaserPAT tracking error of {laserPatRms}px RMS maps to{' '}
              <strong style={{ color: '#38bdf8' }}>{result.pointingLossDb.toFixed(2)} dB</strong> of pointing loss
              against a beam divergence of {result.thetaDiv_urad.toFixed(1)} urad.
              {result.pointingLossDb < 1 ? ' Well within FSOC budget.' : result.pointingLossDb < 3 ? ' At operational boundary.' : ' Exceeds FSOC pointing budget.'}
            </div>
          </div>
          <div style={{ borderLeft: '2px solid #a855f7', paddingLeft: '12px' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '4px' }}>Link Margin — {currentPreset ? currentPreset.label : ''}</div>
            <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              {result.linkMargin_dB >= 10
                ? 'Margin of ' + result.linkMargin_dB.toFixed(1) + ' dB is robust. Deployment viable without aperture changes.'
                : result.linkMargin_dB >= 0
                ? 'Margin of ' + result.linkMargin_dB.toFixed(1) + ' dB is marginal. Reduce tracking error or increase aperture.'
                : 'Negative margin (' + result.linkMargin_dB.toFixed(1) + ' dB). Link fails — tracking error must be reduced.'}
            </div>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '12px' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '4px' }}>Data Integrity</div>
            <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              BER = {formatBER(result.BER)} at current tracking accuracy.
              {result.BER < 1e-9
                ? ' Error-free — suitable for Gbps FSOC data links.'
                : result.BER < 1e-6
                ? ' Acceptable — FEC coding recommended.'
                : ' Unacceptable for data links. Improve pointing accuracy first.'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LinkBudget;
