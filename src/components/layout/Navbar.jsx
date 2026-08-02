import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuConfig } from '../../config/menuConfig';
import { User, Settings, Menu } from 'lucide-react';
import './Navbar.css';

export const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  // Find active menu config based on current path
  const activeMenu = menuConfig.find((menu) => {
    if (location.pathname === menu.path) return true;
    if (menu.submenu && menu.submenu.some(sub => location.pathname === sub.path)) return true;
    if (menu.path !== '/dashboard' && location.pathname.startsWith(menu.path)) return true;
    return false;
  }) || menuConfig[0];

  const submenus = activeMenu?.submenu || [{ label: activeMenu?.label || 'Dashboard', path: activeMenu?.path || '/dashboard' }];

  return (
    <header className="app-header">
      {/* Top Navbar Header */}
      <div className="top-navbar">
        <div className="top-navbar-container">
          <div className="navbar-left">
            <button className="mobile-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
              <Menu size={20} />
            </button>
          </div>

          <div className="navbar-right">
            <div className="user-profile">
              <span className="user-name">John Doe</span>
              <div className="user-avatar">
                <User size={18} />
              </div>
            </div>

            <button className="settings-btn" aria-label="Settings">
              <Settings size={18} />
              <span className="settings-text">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Secondary Submenu Card matching the image */}
      <div className="sub-navbar-wrapper">
        <div className="sub-navbar-card">
          <div className="submenu-container">
            {submenus.map((sub) => {
              const isSubActive = location.pathname === sub.path || 
                (sub.path !== '/dashboard' && location.pathname === sub.path);
              
              return (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  className={({ isActive }) => 
                    `submenu-tab ${isActive || isSubActive ? 'active' : ''}`
                  }
                  end
                >
                  <span className="submenu-tab-text">{sub.label}</span>
                  <span className="submenu-indicator" />
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
