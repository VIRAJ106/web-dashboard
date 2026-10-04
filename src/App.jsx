import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Radar, Camera, Activity, Zap, Settings, Orbit, Download as DownloadIcon, Signal, Cpu, FlaskConical, Book } from 'lucide-react';
import LinkBudget from './pages/LinkBudget';
import DeployBridge from './pages/DeployBridge';
import EvidenceBoard from './pages/EvidenceBoard';
import ScenarioLab from './pages/ScenarioLab';
import Landing from './pages/Landing';
import MissionControl from './pages/MissionControl';
import Analytics from './pages/Analytics';
import Download from './pages/Download';
import UserGuide from './pages/UserGuide';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>{children}</div>;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand" onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>
          <Orbit className="logo-icon" size={24} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>LaserPAT</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FSOC MISSION CONTROL</span>
          </div>
        </div>
        
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-panel)', marginBottom: '16px' }}>
           <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
             <span>■ TELEMETRY LIVE</span>
             <span>■ IDLE</span>
           </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/environment" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>01</span>
            <Radar size={16} style={{ marginRight: '8px' }} />
            RESULTS THEATER
          </NavLink>
          <NavLink to="/linkbudget" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>02</span>
            <Signal size={16} style={{ marginRight: '8px', color: '#10b981' }} />
            <span style={{ color: '#10b981' }}>LINK BUDGET ENGINE</span>
          </NavLink>
          <NavLink to="/scenarios" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>03</span>
            <Orbit size={16} style={{ marginRight: '8px', color: '#38bdf8' }} />
            <span style={{ color: '#38bdf8' }}>SCENARIO LAB</span>
          </NavLink>
          <NavLink to="/deploy" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>04</span>
            <Cpu size={16} style={{ marginRight: '8px', color: '#f59e0b' }} />
            <span style={{ color: '#f59e0b' }}>DEPLOYMENT READINESS</span>
          </NavLink>
          <NavLink to="/evidence" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>05</span>
            <FlaskConical size={16} style={{ marginRight: '8px', color: '#a855f7' }} />
            <span style={{ color: '#a855f7' }}>EVIDENCE BOARD</span>
          </NavLink>
          <NavLink to="/analytics" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '12px' }}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>06</span>
            <Activity size={16} style={{ marginRight: '8px', color: '#94a3b8' }} />
            <span style={{ color: '#94a3b8' }}>EVIDENCE LOG</span>
          </NavLink>
          <NavLink to="/download" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>07</span>
            <DownloadIcon size={16} style={{ marginRight: '8px', color: '#10b981' }} />
            <span style={{ color: '#10b981' }}>STANDALONE EXPORT</span>
          </NavLink>
          <NavLink to="/user-guide" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '12px' }}>
            <span style={{ opacity: 0.5, fontSize: '10px', marginRight: '6px' }}>📖</span>
            <Book size={16} style={{ marginRight: '8px', color: '#10b981' }} />
            <span style={{ color: '#10b981' }}>USER GUIDE</span>
          </NavLink>
        </nav>

        <div className="glass-panel" style={{ marginTop: 'auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '12px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--accent-cyan)' }}></div>
            Demo Operator
          </div>
        </div>
      </aside>

      <main className="main-content" style={{ overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/environment" element={<MissionControl />} />
          <Route path="/linkbudget" element={<LinkBudget />} />
          <Route path="/scenarios" element={<ScenarioLab />} />
          <Route path="/deploy" element={<DeployBridge />} />
          <Route path="/evidence" element={<EvidenceBoard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/download" element={<Download />} />
          <Route path="/user-guide" element={<UserGuide />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
