import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const CameraPage = () => {
  const [pan, setPan] = useState(0);
  const [tilt, setTilt] = useState(0);
  
  const [graphData, setGraphData] = useState([]);
  
  useEffect(() => {
    let data = [];
    for(let i=0; i<50; i++) {
      data.push({ time: i, pan: pan + Math.sin(i/5)*2, tilt: tilt + Math.cos(i/5)*2, errP: Math.random(), errT: Math.random() });
    }
    setGraphData(data);
    
    const interval = setInterval(() => {
      setGraphData(prev => {
        const newD = [...prev.slice(1)];
        const i = prev.length > 0 ? prev[prev.length-1].time + 1 : 0;
        newD.push({ time: i, pan: pan + Math.sin(i/5)*2, tilt: tilt + Math.cos(i/5)*2, errP: Math.random(), errT: Math.random() });
        return newD;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pan, tilt]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 250px', gap: '20px', height: '100%' }}>
      
      {/* Left Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          
          {/* PAN Slider */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              <span>PAN</span><span>{pan}°</span>
            </div>
            <input type="range" min="-180" max="180" value={pan} onChange={e => setPan(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
          </div>

          {/* TILT Slider */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              <span>TILT</span><span>{tilt}°</span>
            </div>
            <input type="range" min="-90" max="90" value={tilt} onChange={e => setTilt(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
          </div>

          <button style={{ width: '100%', padding: '10px', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontWeight: 'bold', fontFamily: 'Share Tech Mono', fontSize: '12px' }}>
            APPLY ANGLES
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '16px', color: 'var(--text-muted)' }}>
            <span>SIM: IDLE</span>
            <span>WS: CONNECTED</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', marginBottom: '20px' }}>CAMERA POSITION</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-panel)', borderRadius: '50%', width: '150px', height: '150px', margin: '0 auto', position: 'relative' }}>
             <div style={{ position: 'absolute', width: '10px', height: '10px', background: 'var(--accent-cyan)', borderRadius: '50%', top: '50%', left: '50%', transform: `translate(calc(-50% + ${pan*0.5}px), calc(-50% + ${tilt*0.5}px))` }}></div>
             <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'var(--border-panel)' }}></div>
             <div style={{ position: 'absolute', width: '1px', height: '100%', background: 'var(--border-panel)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '20px' }}>
            <span className="text-muted">CMD: 0° / 0.0°</span>
            <span className="text-muted">PAN: {pan.toFixed(1)}°</span>
            <span className="text-muted">TILT: {tilt.toFixed(1)}°</span>
          </div>
        </div>
      </div>

      {/* Center Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>TARGET ANGLE VS CAMERA ANGLE</h3>
          <div style={{ flex: 1, minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#444" fontSize={10} />
                <Line type="monotone" dataKey="pan" stroke="var(--accent-cyan)" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="tilt" stroke="var(--text-muted)" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '10px' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>■ Pan</span>
            <span style={{ color: 'var(--text-muted)' }}>■ Tilt</span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>CONTROL ERROR VS TIME</h3>
          <div style={{ flex: 1, minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#444" fontSize={10} />
                <Line type="monotone" dataKey="errP" stroke="var(--accent-cyan)" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="errT" stroke="var(--text-muted)" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '10px' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>■ Pan Error</span>
            <span style={{ color: 'var(--text-muted)' }}>■ Tilt Error</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>PID CONFIGURATION</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '10px' }}>
            {[
              { lbl: 'Kp (proportional)', val: 1.52 },
              { lbl: 'Ki (integral)', val: 0.05 },
              { lbl: 'Kd (derivative)', val: 0.10 },
              { lbl: 'Max Velocity (°/s)', val: 180 },
              { lbl: 'Settling Threshold', val: 0.01 }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ flex: 1, color: 'var(--text-muted)' }}>{item.lbl}</span>
                <input type="range" style={{ flex: 1, accentColor: 'var(--accent-cyan)' }} />
                <span style={{ width: '30px', textAlign: 'right' }}>{item.val}</span>
              </div>
            ))}
            <button style={{ width: '100%', padding: '10px', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontWeight: 'bold', fontFamily: 'Share Tech Mono', fontSize: '12px', marginTop: '10px' }}>
              APPLY PID
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>PID OUTPUT</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}>
              <span className="text-muted">PAN CORRECTION</span><span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}>
              <span className="text-muted">TILT CORRECTION</span><span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}>
              <span className="text-muted">SETTLING</span><span>NO</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}>
              <span className="text-muted">PAN INTEGRAL</span><span>--</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">TILT INTEGRAL</span><span>--</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CameraPage;
