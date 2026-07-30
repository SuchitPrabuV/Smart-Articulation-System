import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sidebar-content">
        <TopBar onMenuOpen={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, background: 'var(--paper)', minHeight: 'calc(100vh - var(--topbar-height))' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 28px 48px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
