import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Crosshair, Navigation, AlertTriangle, ShieldCheck, Box as BoxIcon } from 'lucide-react';
import SatelliteView3D from '../components/SatelliteView3D';

const scenarioData = {
  'LEO-500': { orbit: '500 km', angularRate: '7.5 °/s', turbulence: 'Cn² = 10⁻¹⁴', vibration: '2 Hz' },
  'GEO-36K': { orbit: '36,000 km', angularRate: '< 0.004 °/s', turbulence: 'Cn² = 10⁻¹⁶', vibration: 'None' },
  'UAV-2km': { orbit: '2 km', angularRate: '15 °/s', turbulence: 'Cn² = 10⁻¹³', vibration: '15 Hz' },
  'ISRO-LEO-SIH': { orbit: 'Dynamic LEO', angularRate: 'Variable', turbulence: 'Moderate', vibration: 'Variable' }
};

const MissionControl = () => {
  const location = useLocation();
  const activeScenarioId = location.state?.scenario || 'ISRO-LEO-SIH';
  const activeScenario = scenarioData[activeScenarioId];
  const [trackingState, setTrackingState] = useState('LOCKED');
  
  // State for UI rendering
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [reticlePos, setReticlePos] = useState({ x: 50, y: 50 });
  const [currentFps, setCurrentFps] = useState(21.6);
  const [currentLatency, setCurrentLatency] = useState(16.0);
  
  // Refs for high-performance animation loop
  const targetPosRef = useRef({ x: 50, y: 50 });
  const reticlePosRef = useRef({ x: 50, y: 50 });
  const reqRef = useRef();
  
  // Map 3D coordinate to 2D screen percentage
  // 3D X range roughly -5 to 5. Screen X 0 to 100%
  const map3Dto2D = (val, isY = false) => {
    return 50 + (isY ? -val : val) * 10;
  };

  const handleBeaconMove = (x, y) => {
    const screenX = map3Dto2D(x, false);
    const screenY = map3Dto2D(y, true);
    
    // Clamp to 0-100%
    const clampedX = Math.max(0, Math.min(100, screenX));
    const clampedY = Math.max(0, Math.min(100, screenY));
    
    targetPosRef.current = { x: clampedX, y: clampedY };
    setTargetPos({ x: clampedX, y: clampedY });
  };

  useEffect(() => {
    // Periodically change state just for demo
    const interval = setInterval(() => {
      setTrackingState(prev => prev === 'LOCKED' ? 'SEARCHING' : 'LOCKED');
      setCurrentFps((Math.random() * 3 + 20).toFixed(1));
      setCurrentLatency((Math.random() * 2 + 15).toFixed(1));
    }, 2000);

    const animate = () => {
      const t = Date.now() / 1000;
      let tx = targetPosRef.current.x;
      let ty = targetPosRef.current.y;

      // Physics-driven target motion based on scenario
      if (activeScenarioId === 'LEO-500') {
        // Fast, smooth orbital pass
        tx = 50 + Math.sin(t) * 35;
        ty = 50 + Math.cos(t * 0.5) * 15;
      } else if (activeScenarioId === 'GEO-36K') {
        // Extremely slow drift
        tx = 50 + Math.sin(t * 0.05) * 5;
        ty = 50 + Math.cos(t * 0.03) * 3;
      } else if (activeScenarioId === 'UAV-2km') {
        // Erratic, high-frequency motion
        tx = 50 + Math.sin(t * 2) * 25 + (Math.random() - 0.5) * 4;
        ty = 50 + Math.cos(t * 1.5) * 20 + (Math.random() - 0.5) * 4;
      } else {
        // ISRO-LEO-SIH (Very smooth, slow orbital mechanics)
        tx = 50 + Math.sin(t * 0.2) * 25;
        ty = 50 + Math.cos(t * 0.3) * 15;
      }

      targetPosRef.current = { x: tx, y: ty };
      
      const rx = reticlePosRef.current.x;
      const ry = reticlePosRef.current.y;

      // The reticle tracks the target with PID-like lag
      const lag = trackingState === 'LOCKED' ? 0.15 : 0.05;
      const newX = rx + (tx - rx) * lag;
      const newY = ry + (ty - ry) * lag;
      
      // Jitter magnitude depends on scenario vibration/turbulence
      let jitterMag = 1.0;
      if (activeScenarioId === 'GEO-36K') jitterMag = 0.1;
      if (activeScenarioId === 'UAV-2km') jitterMag = 3.5;
      
      const jitterX = trackingState === 'LOCKED' ? (Math.random() - 0.5) * jitterMag : 0;
      const jitterY = trackingState === 'LOCKED' ? (Math.random() - 0.5) * jitterMag : 0;

      reticlePosRef.current = { x: newX, y: newY };
      
      // Only trigger React state updates occasionally to avoid react-three-fiber re-renders
      if (Math.random() > 0.8) {
        setTargetPos({ x: tx, y: ty });
        setReticlePos({ x: newX + jitterX, y: newY + jitterY });
      }

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(reqRef.current);
    };
  }, [trackingState]);

  // Map 2D target/reticle back to 3D space for the laser
  const target3D_x = (targetPos.x - 50) / 10;
  const target3D_y = -(targetPos.y - 50) / 10;
  
  const reticle3D_x = (reticlePos.x - 50) / 10;
  const reticle3D_y = -(reticlePos.y - 50) / 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="pixel-font" style={{ fontSize: '36px', color: 'var(--accent-cyan)', margin: 0, textShadow: 'var(--accent-cyan-glow)' }}>RESULTS THEATER</h1>
          <p className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
            Live FSOC Simulation 
            <span style={{ color: '#f59e0b', marginLeft: '12px', padding: '2px 6px', background: 'rgba(245,158,11,0.15)', borderRadius: '4px', border: '1px solid #f59e0b' }}>
              SCENARIO LOADED: {activeScenarioId}
            </span>
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '6px 16px', fontFamily: 'Share Tech Mono', fontSize: '12px', cursor: 'pointer' }}>II PAUSE</button>
          <button style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', padding: '6px 16px', fontFamily: 'Share Tech Mono', fontSize: '12px', cursor: 'pointer' }}>■ END DEMO</button>
        </div>
      </div>

      {/* Main Tactical Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1, overflow: 'hidden' }}>
        
        {/* Main 3D View */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
            <div className={`status-badge ${trackingState.toLowerCase()}`}>
              ■ {trackingState}
            </div>
          </div>
          
          <div style={{ flex: 1, position: 'relative', background: 'var(--bg-deep)' }}>
            <SatelliteView3D 
              reticlePos3D={[reticle3D_x, reticle3D_y, 0]} 
              targetPos3D={[target3D_x, target3D_y, 0]}
              scenario={activeScenarioId}
            />
          </div>
          
          {/* Overlay Grid lines for tactical feel */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(255, 183, 3, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 183, 3, 0.05) 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.5, zIndex: 5 }}></div>
        </div>

        {/* Right Sidebar - Data Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
          
          {/* Mission Panel */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>
              MISSION
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Scenario</span>
                <span style={{ color: 'var(--text-main)', fontFamily: 'Share Tech Mono' }}>{activeScenarioId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Orbit/Range</span>
                <span style={{ color: 'var(--text-main)', fontFamily: 'Share Tech Mono' }}>{activeScenario.orbit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Ang. Rate</span>
                <span style={{ color: 'var(--text-main)', fontFamily: 'Share Tech Mono' }}>{activeScenario.angularRate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Turbulence</span>
                <span style={{ color: 'var(--text-main)', fontFamily: 'Share Tech Mono' }}>{activeScenario.turbulence}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Vibration</span>
                <span style={{ color: 'var(--text-main)', fontFamily: 'Share Tech Mono' }}>{activeScenario.vibration}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Status</span>
                <span className={trackingState === 'LOCKED' ? 'text-green' : 'text-amber'}>■ {trackingState}</span>
              </div>
            </div>
          </div>

          {/* Tracking Panel */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>
              TRACKING
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Confidence</span>
                <span style={{ color: 'var(--text-main)' }}>98.0 %</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-panel)', paddingTop: '10px' }}>
                <span className="text-muted">PAN</span>
                <span style={{ color: 'var(--text-main)' }}>{(targetPos.x - 50).toFixed(2)} °</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">TILT</span>
                <span style={{ color: 'var(--text-main)' }}>{-(targetPos.y - 50).toFixed(2)} °</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-panel)', paddingTop: '10px' }}>
                <span className="text-muted">Error</span>
                <span style={{ color: 'var(--text-main)' }}>
                  {Math.sqrt(Math.pow(targetPos.x - reticlePos.x, 2) + Math.pow(targetPos.y - reticlePos.y, 2)).toFixed(1)} px
                </span>
              </div>
            </div>
          </div>

          {/* Performance Panel */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>
              PERFORMANCE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">FPS</span>
                <span style={{ color: 'var(--text-main)' }}>{currentFps}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Latency</span>
                <span style={{ color: 'var(--text-main)' }}>{currentLatency} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Avg Error</span>
                <span style={{ color: 'var(--text-main)' }}>3.9 px</span>
              </div>
            </div>
          </div>

          {/* Monte Carlo Validation Panel */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-panel)', paddingBottom: '8px' }}>
              MONTE CARLO (N=300)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Target Config</span>
                <span style={{ color: 'var(--accent-purple)' }}>stress_gate.yaml</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Acquisition Rate</span>
                <span style={{ color: 'var(--accent-green)' }}>98.6%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Avg Lock Time</span>
                <span style={{ color: 'var(--text-main)' }}>1.24 s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Mean RMS Error</span>
                <span style={{ color: 'var(--text-main)' }}>3.42 px</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-panel)', paddingTop: '10px' }}>
                <span className="text-muted">Status</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>PASSED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MissionControl;
