import React, { useState } from 'react';

const SettingRow = ({ label, type = 'range', value, onChange, min, max, step }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 50px', alignItems: 'center', gap: '20px', padding: '8px 0', borderBottom: '1px solid var(--border-panel)' }}>
    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
    {type === 'range' ? (
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
    ) : type === 'checkbox' ? (
      <input type="checkbox" checked={value} onChange={onChange} style={{ accentColor: 'var(--accent-cyan)' }} />
    ) : type === 'text' ? (
      <input type="text" value={value} onChange={onChange} style={{ width: '100%', background: '#111', border: '1px solid #333', color: 'var(--text-main)', padding: '4px', fontFamily: 'Share Tech Mono' }} />
    ) : type === 'select' ? (
      <select value={value} onChange={onChange} style={{ width: '100%', background: '#111', border: '1px solid #333', color: 'var(--text-main)', padding: '4px', fontFamily: 'Share Tech Mono' }}>
        <option value="gemini-1-flash">gemini-1-flash</option>
        <option value="gemini-1-pro">gemini-1-pro</option>
      </select>
    ) : null}
    <span style={{ fontSize: '12px', textAlign: 'right' }}>{type !== 'text' && type !== 'select' && type !== 'checkbox' ? value : ''}</span>
  </div>
);

const SettingsPage = () => {
  const [s, setS] = useState({
    fps: 30, dt: 0.033,
    fovH: 4, fovV: 3,
    useYolo: true, modelPath: 'models/beacon_yolo.pt', conf: 0.5,
    q: 2, r: 5,
    kp: 6, ki: 0.15, kd: 0.6, maxVel: 3,
    aiModel: 'gemini-1-flash',
    histBuffer: 600
  });

  const h = (k, v) => setS({ ...s, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>SIMULATION</h3>
        <SettingRow label="Target FPS" value={s.fps} min={1} max={120} onChange={e => h('fps', e.target.value)} />
        <SettingRow label="Simulation dt (s)" value={s.dt} min={0.001} max={0.1} step={0.001} onChange={e => h('dt', e.target.value)} />
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>CAMERA (FSOC OPTICAL FOV)</h3>
        <SettingRow label="FOV Horizontal (°)" value={s.fovH} min={1} max={10} step={0.1} onChange={e => h('fovH', e.target.value)} />
        <SettingRow label="FOV Vertical (°)" value={s.fovV} min={1} max={10} step={0.1} onChange={e => h('fovV', e.target.value)} />
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>DETECTION</h3>
        <SettingRow label="Use YOLO Model" type="checkbox" value={s.useYolo} onChange={e => h('useYolo', e.target.checked)} />
        <SettingRow label="Model Path" type="text" value={s.modelPath} onChange={e => h('modelPath', e.target.value)} />
        <SettingRow label="Confidence Threshold" value={s.conf} min={0.1} max={1} step={0.05} onChange={e => h('conf', e.target.value)} />
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>KALMAN FILTER</h3>
        <SettingRow label="Process Noise Q" value={s.q} min={0.1} max={10} step={0.1} onChange={e => h('q', e.target.value)} />
        <SettingRow label="Measurement Noise R" value={s.r} min={0.1} max={10} step={0.1} onChange={e => h('r', e.target.value)} />
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>PID CONTROLLER</h3>
        <SettingRow label="Kp" value={s.kp} min={0} max={20} step={0.1} onChange={e => h('kp', e.target.value)} />
        <SettingRow label="Ki" value={s.ki} min={0} max={2} step={0.01} onChange={e => h('ki', e.target.value)} />
        <SettingRow label="Kd" value={s.kd} min={0} max={5} step={0.1} onChange={e => h('kd', e.target.value)} />
        <SettingRow label="Max Angular Velocity (°/s)" value={s.maxVel} min={1} max={10} step={0.5} onChange={e => h('maxVel', e.target.value)} />
      </div>
      
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>AI / GEMINI COPILOT</h3>
        <SettingRow label="Gemini Model" type="select" value={s.aiModel} onChange={e => h('aiModel', e.target.value)} />
      </div>
      
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>PERFORMANCE</h3>
        <SettingRow label="History Buffer (frames)" value={s.histBuffer} min={100} max={2000} step={100} onChange={e => h('histBuffer', e.target.value)} />
      </div>

    </div>
  );
};

export default SettingsPage;
