import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './MainLayout.css';

export const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeMobileSidebar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Wrapper - responds dynamically to sidebar collapse state */}
      <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Navbar Component */}
        <Navbar onToggleSidebar={toggleMobileSidebar} />

        {/* Dynamic Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
