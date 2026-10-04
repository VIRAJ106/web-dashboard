import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let d = [];
    for(let i=0; i<100; i++) {
      d.push({ 
        time: i, 
        errP: Math.random()*2, 
        errT: Math.random()*2, 
        fps: 20 + Math.random()*10,
        lat: 10 + Math.random()*5,
        conf: 80 + Math.random()*20,
        errDist: Math.random()*5
      });
    }
    setData(d);

    const interval = setInterval(() => {
      setData(prev => {
        const newD = [...prev.slice(1)];
        const i = prev.length > 0 ? prev[prev.length-1].time + 1 : 0;
        newD.push({ 
          time: i, 
          errP: Math.random()*2, 
          errT: Math.random()*2, 
          fps: 20 + Math.random()*10,
          lat: 10 + Math.random()*5,
          conf: 80 + Math.random()*20,
          errDist: Math.random()*5
        });
        return newD;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* RUN SUMMARY */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>RUN SUMMARY</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}><span className="text-muted">DURATION</span><span>--</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}><span className="text-muted">MAX ERROR</span><span>-- px</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}><span className="text-muted">MAX ERR PX</span><span>-- px</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">CONFIDENCE</span><span>-- %</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}><span className="text-muted">AVG FPS</span><span>--</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}><span className="text-muted">AVG ERROR</span><span>-- px</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-panel)', paddingBottom: '4px' }}><span className="text-muted">AVG ERR PX</span><span>-- px</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">PROC LATENCY</span><span>-- ms</span></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: '600px' }}>
        
        {/* GRAPHS */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>ANGULAR ERROR VS TIME (°)</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#444" fontSize={10} /><Line type="monotone" dataKey="errP" stroke="var(--accent-cyan)" dot={false} isAnimationActive={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>FPS + PROCESSING LATENCY</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#444" fontSize={10} /><Line type="monotone" dataKey="fps" stroke="var(--accent-cyan)" dot={false} isAnimationActive={false} /><Line type="monotone" dataKey="lat" stroke="var(--text-muted)" dot={false} isAnimationActive={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>DETECTION CONFIDENCE (%)</h3>
          <div style={{ flex: 1 }}>
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#444" fontSize={10} /><Line type="monotone" dataKey="conf" stroke="var(--accent-cyan)" dot={false} isAnimationActive={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 16px 0', color: 'var(--accent-cyan)' }}>ERROR DISTRIBUTION [LAST 200 FRAMES]</h3>
          <div style={{ flex: 1 }}>
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#444" fontSize={10} /><Bar dataKey="errDist" fill="var(--accent-cyan)" isAnimationActive={false} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
