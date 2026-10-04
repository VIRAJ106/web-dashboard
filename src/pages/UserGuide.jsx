import React from 'react';
import { Book, Download, Play, Settings, Target, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

const UserGuide = () => {
  const sections = [
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      icon: <Play size={20} color="#10b981" />,
      content: [
        {
          step: '1. Download',
          desc: 'Get LaserPAT.exe from GitHub Releases (309 MB)',
          link: 'https://github.com/VIRAJ106/LaserPAT/releases/latest'
        },
        {
          step: '2. Extract',
          desc: 'Unzip to any folder (e.g., C:\\LaserPAT\\)'
        },
        {
          step: '3. Run',
          desc: 'Double-click LaserPAT.exe'
        },
        {
          step: '4. Done!',
          desc: 'Application launches in 3-5 seconds'
        }
      ]
    },
    {
      id: 'interface',
      title: 'Interface Overview',
      icon: <Target size={20} color="#38bdf8" />,
      sections: [
        { name: 'Camera View', desc: 'Real-time sensor feed with AI detection overlays (640×480px)' },
        { name: 'World Views', desc: '2D top-down + 3D sideways perspective for spatial awareness' },
        { name: 'Error Plot', desc: 'Real-time tracking accuracy graph (updates 30 FPS)' },
        { name: 'Control Panel', desc: 'Motion, platform, weather, and parameter configuration' },
        { name: 'State Indicator', desc: 'Color-coded tracking status (IDLE/SEARCH/ACQUIRE/LOCKED/LOST)' },
        { name: 'Statistics Panel', desc: 'Live metrics (RMS error, lock %, FPS, AI score)' }
      ]
    },
    {
      id: 'first-demo',
      title: 'Running Your First Demo',
      icon: <CheckCircle2 size={20} color="#10b981" />,
      steps: [
        {
          title: 'Step 1: Select Configuration',
          items: ['Motion → "Straight"', 'Platform → "Static"', 'Weather → "Clear"']
        },
        {
          title: 'Step 2: Start Tracking',
          items: ['Click "Start Tracking" button', 'Watch state: IDLE → SEARCH → ACQUIRE → LOCKED']
        },
        {
          title: 'Step 3: Monitor Performance',
          items: ['Camera view: Green AI detection box', 'Error plot: Line stays near zero', 'Stats panel: RMS ~3-5 px, Lock 99%+']
        },
        {
          title: 'Step 4: Results',
          items: ['Expected RMS: 3.1 px ✅', 'Expected Lock: 99.2% ✅', 'Expected Max Error: ~8 px ✅']
        }
      ]
    },
    {
      id: 'scenarios',
      title: 'Built-in Scenarios',
      icon: <Settings size={20} color="#f59e0b" />,
      scenarios: [
        {
          name: 'LEO-500 (ISS-Class)',
          physics: { orbit: '500 km', rate: '7.5°/s', turb: 'Cn²=10⁻¹⁴', vib: '2 Hz' },
          expected: 'RMS: 5-7 px, Lock: 93-95%',
          color: '#38bdf8'
        },
        {
          name: 'GEO-36K (Deep Space)',
          physics: { orbit: '36,000 km', rate: '<0.004°/s', turb: 'Cn²=10⁻¹⁶', vib: 'None' },
          expected: 'RMS: 3-4 px, Lock: 99%+',
          color: '#f59e0b'
        },
        {
          name: 'UAV-2km (Tactical)',
          physics: { orbit: '2 km', rate: '15°/s', turb: 'Cn²=10⁻¹³', vib: '15 Hz' },
          expected: 'RMS: 9-11 px, Lock: 85-90%',
          color: '#10b981'
        },
        {
          name: 'ISRO-LEO-SIH (Official)',
          physics: { orbit: 'Dynamic', rate: 'Variable', turb: 'Moderate', vib: 'Variable' },
          expected: 'RMS: 3-5 px, Lock: 95-97%',
          color: '#a855f7'
        }
      ]
    }
  ];

  const troubleshooting = [
    {
      issue: 'Application Won\'t Launch',
      solutions: ['Right-click LaserPAT.exe → Properties → Check "Unblock"', 'Install Visual C++ Redistributables', 'Add to antivirus whitelist']
    },
    {
      issue: 'Low Frame Rate (<20 FPS)',
      solutions: ['Close background applications', 'Reduce world size to 1500×1500', 'Switch to 2D view (disable 3D)', 'Use standalone executable (not Python)']
    },
    {
      issue: 'Tracking Immediately Loses Lock',
      solutions: ['Check beacon visibility in world bounds', 'Reduce disturbances (Weather→Clear, σ=0)', 'Verify FOV is 4°×3° (default)', 'Reset to defaults']
    },
    {
      issue: 'No AI Detection (Green Boxes Missing)',
      solutions: ['Verify models/yolov8n.onnx exists (12.8 MB)', 'Install onnxruntime: pip install onnxruntime', 'Note: Classical CV fallback still works!']
    }
  ];

  const performanceMetrics = [
    { metric: 'RMS Error', target: '≤10 px', achieved: '3.9 px', status: 'pass' },
    { metric: 'Lock Retention', target: '≥95%', achieved: '96.1%', status: 'pass' },
    { metric: 'Acquisition Time', target: '≤2 s', achieved: '0.31 s', status: 'pass' },
    { metric: 'Frame Rate', target: '≥30 FPS', achieved: '45 FPS', status: 'pass' },
    { metric: 'Processing Latency', target: '≤33 ms', achieved: '16 ms', status: 'pass' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#10b981', margin: 0, fontFamily: 'Orbitron', textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>
            USER GUIDE
          </h1>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
            Complete guide to using LaserPAT Desktop Application for FSOC tracking simulation
          </p>
        </div>
        <a 
          href="https://github.com/VIRAJ106/LaserPAT/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981',
            color: '#10b981', padding: '8px 16px', borderRadius: '6px',
            textDecoration: 'none', fontSize: '12px', fontFamily: 'Share Tech Mono',
            boxShadow: '0 0 15px rgba(16,185,129,0.3)', cursor: 'pointer'
          }}
        >
          <Download size={16} /> DOWNLOAD APP (309 MB)
        </a>
      </div>

      {/* System Requirements */}
      <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div style={{ fontSize: '10px', color: '#10b981', letterSpacing: '2px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={14} /> SYSTEM REQUIREMENTS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', fontSize: '11px' }}>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>OS</div>
            <div style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>Windows 10/11 x64</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>CPU</div>
            <div style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>Quad-core 2.5+ GHz</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>RAM</div>
            <div style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>8 GB+</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Storage</div>
            <div style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>1 GB+ free</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Display</div>
            <div style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>1920×1080</div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#10b981', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '8px' }}>
          <Play size={18} /> QUICK START GUIDE (No Python Required)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {sections[0].content.map((item, i) => (
            <div key={i} style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginBottom: '6px', fontFamily: 'Share Tech Mono' }}>
                {item.step}
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4 }}>
                {item.desc}
              </div>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '10px', color: '#38bdf8', textDecoration: 'none' }}>
                  Download <ExternalLink size={10} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interface Overview */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#38bdf8', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '8px' }}>
          <Target size={18} /> INTERFACE OVERVIEW (6 Key Sections)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {sections[1].sections.map((sec, i) => (
            <div key={i} style={{ padding: '10px', borderLeft: '3px solid #38bdf8', background: 'rgba(56,189,248,0.03)' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>{sec.name}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.5 }}>{sec.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* First Demo */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#10b981', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '8px' }}>
            <CheckCircle2 size={18} /> YOUR FIRST DEMO (Clean Tracking)
          </div>
          {sections[2].steps.map((step, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px' }}>{step.title}</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10px', color: '#cbd5e1', lineHeight: 1.6 }}>
                {step.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Performance Targets */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#10b981', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '8px' }}>
            <CheckCircle2 size={18} /> PERFORMANCE TARGETS
          </div>
          <table style={{ width: '100%', fontSize: '11px', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '8px 4px', fontWeight: 'normal' }}>Metric</th>
                <th style={{ padding: '8px 4px', fontWeight: 'normal' }}>Target</th>
                <th style={{ padding: '8px 4px', fontWeight: 'normal' }}>Achieved</th>
                <th style={{ padding: '8px 4px', fontWeight: 'normal' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {performanceMetrics.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 4px', color: '#e2e8f0' }}>{row.metric}</td>
                  <td style={{ padding: '10px 4px', color: '#94a3b8', fontFamily: 'Share Tech Mono' }}>{row.target}</td>
                  <td style={{ padding: '10px 4px', color: '#10b981', fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}>{row.achieved}</td>
                  <td style={{ padding: '10px 4px' }}>
                    <span style={{
                      background: 'rgba(16,185,129,0.15)',
                      color: '#10b981',
                      padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontFamily: 'Share Tech Mono'
                    }}>✓ PASS</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenarios */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#f59e0b', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(245,158,11,0.2)', paddingBottom: '8px' }}>
          <Settings size={18} /> ISRO-RELEVANT SCENARIOS (Physics-Graded)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {sections[3].scenarios.map((scenario, i) => (
            <div key={i} style={{ background: `rgba(${scenario.color === '#38bdf8' ? '56,189,248' : scenario.color === '#f59e0b' ? '245,158,11' : scenario.color === '#10b981' ? '16,185,129' : '168,85,247'},0.05)`, border: `1px solid ${scenario.color}33`, borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: scenario.color, marginBottom: '8px', fontFamily: 'Orbitron' }}>
                {scenario.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '10px', fontSize: '10px' }}>
                {Object.entries(scenario.physics).map(([key, val], j) => (
                  <div key={j}>
                    <span style={{ color: '#64748b' }}>{key}:</span>{' '}
                    <span style={{ color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '10px', color: '#cbd5e1', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                {scenario.expected}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#ef4444', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(239,68,68,0.2)', paddingBottom: '8px' }}>
          <AlertCircle size={18} /> TROUBLESHOOTING
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {troubleshooting.map((issue, i) => (
            <div key={i} style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px' }}>
                {issue.issue}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '10px', color: '#94a3b8', lineHeight: 1.6 }}>
                {issue.solutions.map((sol, j) => (
                  <li key={j}>{sol}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <a
          href="https://github.com/VIRAJ106/LaserPAT"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel"
          style={{ padding: '16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(56,189,248,0.2)' }}
        >
          <Book size={24} color="#38bdf8" />
          <div style={{ fontSize: '12px', color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>GitHub Repository</div>
          <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center' }}>Source code, issues, and documentation</div>
        </a>

        <a
          href="https://github.com/VIRAJ106/LaserPAT/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel"
          style={{ padding: '16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <Download size={24} color="#10b981" />
          <div style={{ fontSize: '12px', color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>Download Center</div>
          <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center' }}>Latest releases and installers</div>
        </a>

        <a
          href="mailto:support@laserpat.dev"
          className="glass-panel"
          style={{ padding: '16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <AlertCircle size={24} color="#f59e0b" />
          <div style={{ fontSize: '12px', color: '#f8fafc', fontFamily: 'Share Tech Mono' }}>Need Help?</div>
          <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center' }}>Email support for evaluators</div>
        </a>
      </div>

    </div>
  );
};

export default UserGuide;
