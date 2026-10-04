import React from 'react';
import { Download as DownloadIcon, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

const DownloadPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      <div>
        <h1 className="pixel-font" style={{ fontSize: '36px', color: 'var(--accent-green)', margin: 0, textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
          STANDALONE APPLICATION
        </h1>
        <p className="text-muted" style={{ fontSize: '14px', marginTop: '8px', fontFamily: 'Inter' }}>
          Download the native desktop environment for mission-critical operations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
        
        <div className="glass-panel" style={{ padding: '32px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <ShieldCheck size={32} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)', fontFamily: 'Inter' }}>
              "In high-stakes scientific operations like those at ISRO, desktop applications offer deterministic execution, optimized computational performance, and uncompromised offline security—critical factors unattainable in browser-dependent platforms."
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Cpu size={32} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)', fontFamily: 'Inter' }}>
              "For precision-driven research and satellite data processing, desktop environments ensure low-latency integration with specialized hardware and real-time simulation tools, providing reliability that web interfaces cannot consistently guarantee."
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px', borderLeft: '4px solid var(--accent-magenta)' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <AlertTriangle size={32} color="var(--accent-magenta)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)', fontFamily: 'Inter' }}>
              "Mission-critical scientific workflows require the robustness and resource control of desktop applications, where local caching, dedicated memory management, and uninterruptible execution underpin experiment fidelity far beyond the reach of standard web-based solutions."
            </p>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <a 
          href="https://github.com/VIRAJ106/LaserPAT/releases/latest/download/LaserPAT.exe"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid var(--accent-green)',
            color: 'var(--accent-green)',
            padding: '16px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'Orbitron',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onPointerEnter={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.6)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <DownloadIcon size={24} />
          DOWNLOAD DESKTOP APP (LaserPAT v1.0)
        </a>
      </div>

    </div>
  );
};

export default DownloadPage;
