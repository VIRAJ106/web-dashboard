import React, { useState } from 'react';

const NoiseSlider = ({ label, value, onChange, min, max, step = 0.1, color = 'var(--accent-cyan)' }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 50px', alignItems: 'center', gap: '20px', padding: '12px 0', borderBottom: '1px solid var(--border-panel)' }}>
    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Inter' }}>{label}</span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} style={{ width: '100%', accentColor: color }} />
    <span style={{ fontSize: '12px', textAlign: 'right', fontFamily: 'Orbitron', color: 'var(--text-main)' }}>{value}</span>
  </div>
);

const Noise = () => {
  const [atm, setAtm] = useState({ scintillation: 0.5, beamWander: 2.0, attenuation: 0.1 });
  const [plat, setPlat] = useState({ jitterFreq: 50, jitterAmp: 1.5, drift: 0.05 });
  const [sens, setSens] = useState({ darkCurrent: 10, readNoise: 5, shotNoise: 1 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="pixel-font" style={{ fontSize: '36px', color: 'var(--accent-cyan)', margin: 0, textShadow: 'var(--accent-cyan-glow)' }}>DISTURBANCE LAB</h1>
          <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px', fontFamily: 'Inter' }}>Simulate real-world environmental and hardware noise</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Atmospheric Noise */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', color: 'var(--accent-purple)' }}>ATMOSPHERIC NOISE</h3>
          <NoiseSlider label="Scintillation Variance" value={atm.scintillation} min={0} max={2} onChange={e => setAtm({...atm, scintillation: Number(e.target.value)})} color="var(--accent-purple)" />
          <NoiseSlider label="Beam Wander (urad)" value={atm.beamWander} min={0} max={10} onChange={e => setAtm({...atm, beamWander: Number(e.target.value)})} color="var(--accent-purple)" />
          <NoiseSlider label="Attenuation (dB/km)" value={atm.attenuation} min={0} max={5} onChange={e => setAtm({...atm, attenuation: Number(e.target.value)})} color="var(--accent-purple)" />
        </div>

        {/* Platform Noise */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', color: 'var(--accent-cyan)' }}>PLATFORM VIBRATION</h3>
          <NoiseSlider label="Jitter Frequency (Hz)" value={plat.jitterFreq} min={10} max={200} step={5} onChange={e => setPlat({...plat, jitterFreq: Number(e.target.value)})} />
          <NoiseSlider label="Jitter Amplitude (urad)" value={plat.jitterAmp} min={0} max={10} onChange={e => setPlat({...plat, jitterAmp: Number(e.target.value)})} />
          <NoiseSlider label="Thermal Drift (°/hr)" value={plat.drift} min={0} max={1} step={0.01} onChange={e => setPlat({...plat, drift: Number(e.target.value)})} />
        </div>

        {/* Sensor Noise */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', color: 'var(--accent-green)' }}>SENSOR NOISE</h3>
          <NoiseSlider label="Dark Current (e-/s)" value={sens.darkCurrent} min={0} max={50} step={1} onChange={e => setSens({...sens, darkCurrent: Number(e.target.value)})} color="var(--accent-green)" />
          <NoiseSlider label="Read Noise (e- rms)" value={sens.readNoise} min={0} max={20} step={1} onChange={e => setSens({...sens, readNoise: Number(e.target.value)})} color="var(--accent-green)" />
          <NoiseSlider label="Shot Noise Factor" value={sens.shotNoise} min={0} max={5} onChange={e => setSens({...sens, shotNoise: Number(e.target.value)})} color="var(--accent-green)" />
        </div>

      </div>
    </div>
  );
};

export default Noise;
