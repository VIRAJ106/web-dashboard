import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Satellite, Plane, Crosshair, Play, Info } from 'lucide-react';

const ScenarioLab = () => {
  const [activeScenario, setActiveScenario] = useState('ISRO-LEO-SIH');
  const navigate = useNavigate();

  const scenarios = [
    {
      id: 'LEO-500',
      icon: <Satellite size={24} color="#38bdf8" />,
      title: 'LEO-500 (ISS-Class Pass)',
      physics: {
        orbit: '500 km',
        angularRate: '7.5 °/s',
        turbulence: 'Cn² = 10⁻¹⁴',
        vibration: '2 Hz (Reaction Wheels)'
      },
      description: 'Simulates a fast low-earth orbit pass tracking from a ground station. The high angular rate stresses the feed-forward velocity estimator, while atmospheric turbulence introduces amplitude scintillation.',
      color: '#38bdf8'
    },
    {
      id: 'GEO-36K',
      icon: <Orbit size={24} color="#f59e0b" />,
      title: 'GEO-36K (Deep Space)',
      physics: {
        orbit: '36,000 km',
        angularRate: '< 0.004 °/s',
        turbulence: 'Cn² = 10⁻¹⁶ (High Alt)',
        vibration: 'None'
      },
      description: 'Geostationary orbit scenario where the target appears nearly static, but extreme distance imposes a sub-5µrad pointing error budget. Tests the system\'s precision deadband logic and zero-steady-state-error PID integration.',
      color: '#f59e0b'
    },
    {
      id: 'UAV-2km',
      icon: <Plane size={24} color="#10b981" />,
      title: 'UAV-2km (Tactical Link)',
      physics: {
        orbit: '2 km (Alt: 500m)',
        angularRate: '15 °/s (Erratic)',
        turbulence: 'Cn² = 10⁻¹³ (Coastal)',
        vibration: '15 Hz (Rotors)'
      },
      description: 'Drone-to-ground data link simulation. Extremely high turbulence and severe platform vibration (rotor harmonics) test the limits of the Kalman Filter\'s rapid disturbance rejection capabilities.',
      color: '#10b981'
    },
    {
      id: 'ISRO-LEO-SIH',
      icon: <Rocket size={24} color="#a855f7" />,
      title: 'ISRO-LEO-SIH (PS-26169)',
      physics: {
        orbit: 'Dynamic LEO',
        angularRate: 'Variable',
        turbulence: 'Moderate',
        vibration: 'Variable'
      },
      description: 'Direct compliance with SIH Problem Statement 26169. Tests AI-based target acquisition and coarse alignment mechanisms before handing off to the fine tracking FSM (Fast Steering Mirror).',
      color: '#a855f7'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '28px', color: '#38bdf8', margin: 0, fontFamily: 'Orbitron', textShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
          SCENARIO LAB
        </h1>
        <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
          Physics-graded ISRO reference environments for objective PAT evaluation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        
        {/* Scenario List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scenarios.map(scenario => (
            <div 
              key={scenario.id} 
              className="glass-panel" 
              onClick={() => setActiveScenario(scenario.id)}
              style={{ 
                padding: '20px', 
                cursor: 'pointer',
                border: activeScenario === scenario.id ? `1px solid ${scenario.color}` : '1px solid rgba(255,255,255,0.05)',
                background: activeScenario === scenario.id ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.6)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                    {scenario.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px', fontFamily: 'Orbitron' }}>{scenario.title}</h3>
                    <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '12px', lineHeight: 1.5, maxWidth: '500px' }}>
                      {scenario.description}
                    </p>
                  </div>
                </div>
                {activeScenario === scenario.id && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/environment', { state: { scenario: scenario.id } });
                    }}
                    style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    background: scenario.color, color: '#000', 
                    border: 'none', padding: '8px 16px', borderRadius: '4px', 
                    fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Share Tech Mono',
                    boxShadow: `0 0 10px ${scenario.color}80`
                  }}>
                    <Play size={14} /> LAUNCH
                  </button>
                )}
              </div>
              
              {/* Physics Parameters Preview */}
              {activeScenario === scenario.id && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px' }}>ORBIT / RANGE</div>
                    <div style={{ fontSize: '13px', color: scenario.color, fontFamily: 'Share Tech Mono', marginTop: '4px' }}>{scenario.physics.orbit}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px' }}>ANGULAR RATE</div>
                    <div style={{ fontSize: '13px', color: scenario.color, fontFamily: 'Share Tech Mono', marginTop: '4px' }}>{scenario.physics.angularRate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px' }}>TURBULENCE</div>
                    <div style={{ fontSize: '13px', color: scenario.color, fontFamily: 'Share Tech Mono', marginTop: '4px' }}>{scenario.physics.turbulence}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px' }}>VIBRATION</div>
                    <div style={{ fontSize: '13px', color: scenario.color, fontFamily: 'Share Tech Mono', marginTop: '4px' }}>{scenario.physics.vibration}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#38bdf8', letterSpacing: '2px', marginBottom: '16px', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '8px' }}>
              <Info size={14} /> SCENARIO METHODOLOGY
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 10px 0' }}>
                Standard demo scenarios (e.g., "slow target", "fast target") do not reflect operational reality for aerospace communications.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                These <strong>Physics-Graded Presets</strong> inject statistically accurate disturbances directly into the 6-DoF environmental engine.
              </p>
              <p style={{ margin: 0 }}>
                This allows evaluators to verify algorithm robustness against real-world phenomenon (e.g., atmospheric scintillation and rotor harmonics) rather than arbitrary noise.
              </p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#10b981', letterSpacing: '2px', marginBottom: '12px' }}>
              <Crosshair size={14} /> CURRENT FOCUS
            </div>
            <div style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>SIH PS-26169 Evaluator Focus</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
              Ensure the selected scenario aligns with the coarse alignment objectives specified in the ISRO problem statement.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Need to define Orbit icon since it wasn't imported from lucide-react initially
const Orbit = ({ size, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export default ScenarioLab;
