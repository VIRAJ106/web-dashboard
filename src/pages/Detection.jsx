import React, { useState, useEffect } from 'react';

const Detection = () => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setFrame(f => f + 1), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', height: '100%' }}>
      {/* Left Panel - Input Frame */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)' }}>
          <h3 style={{ fontSize: '12px', margin: 0, color: 'var(--accent-cyan)' }}>INPUT / DETECTION FRAME</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>■ READY</span>
        </div>
        
        <div style={{ flex: 1, position: 'relative', background: '#020408', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Mock FOV */}
          <div style={{ 
            width: '300px', height: '200px', border: '1px solid var(--accent-cyan)', 
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 20px rgba(0, 229, 255, 0.1)'
          }}>
            <div style={{ position: 'absolute', top: '-20px', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: 'bold' }}>FSOC FOV</div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', width: '20px', height: '1px', background: 'var(--accent-cyan)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
              <div style={{ position: 'absolute', height: '20px', width: '1px', background: 'var(--accent-cyan)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
            </div>
            <div style={{ position: 'absolute', bottom: '40px', color: 'var(--text-muted)', fontSize: '10px' }}>OPTICAL CENTER</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '4px' }}>
        
        {/* Detection Pipeline */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>DETECTION PIPELINE</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
            <li style={{ color: 'var(--accent-cyan)' }}>■ INPUT FRAME</li>
            <li>■ NOISE REDUCTION</li>
            <li>■ CONTRAST ENHANCE</li>
            <li>■ YOLO / MOCK DETECTOR</li>
            <li>■ CONFIDENCE FILTER</li>
            <li>■ POSITION ESTIMATION</li>
            <li>■ KALMAN UPDATE</li>
          </ul>
        </div>

        {/* Detection Result */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>DETECTION RESULT</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">STATUS</span>
              <span style={{ color: 'var(--accent-cyan)' }}>NOT DETECTED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">TARGET ID</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">CLASS</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">CONFIDENCE</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">INFERENCE</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">DETECTOR</span>
              <span>--</span>
            </div>
          </div>
        </div>

        {/* Kalman Estimate */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>KALMAN ESTIMATE</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">EST POSITION</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">EST VELOCITY</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">PRED POSITION</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span className="text-muted">UNCERTAINTY</span>
              <span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">COVARIANCE</span>
              <span>--</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Detection;
