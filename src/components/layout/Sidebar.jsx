import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuConfig } from '../../config/menuConfig';
import { X, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({
  isOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse
}) => {
  const location = useLocation();

  // Helper to check if menu or any of its submenus are active
  const isMenuActive = (menu) => {
    if (location.pathname === menu.path) return true;
    if (menu.submenu && menu.submenu.some(sub => location.pathname === sub.path)) return true;
    if (menu.path !== '/dashboard' && location.pathname.startsWith(menu.path)) return true;
    return false;
  };

  return (
    <>
      {/* Overlay for mobile view */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        {/* Brand Logo Header */}
        <div className="sidebar-header">
          <div className="brand-logo" title="ExoBook">
            <div className="brand-icon-box">
              <Package size={20} color="#1b1e3d" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span className="brand-title">
                Exo<span className="brand-title-accent">Book</span>
              </span>
            )}
          </div>

          {/* Desktop Toggle Button */}
          {onToggleCollapse && (
            <button
              className="toggle-collapse-btn"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}

          {/* Mobile Close Button */}
          <button className="mobile-close-btn" onClick={onClose} aria-label="Close Sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu List */}
        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuConfig.map((item) => {
              const Icon = item.icon;
              const active = isMenuActive(item);

              return (
                <li key={item.key} className="menu-item">
                  <NavLink
                    to={item.path}
                    className={`menu-link ${active ? 'active' : ''}`}
                    data-tooltip={collapsed ? item.label : undefined}
                    onClick={() => {
                      if (window.innerWidth < 768 && onClose) {
                        onClose();
                      }
                    }}
                  >
                    <span className="icon-wrapper">
                      <Icon size={19} />
                    </span>
                    {!collapsed && <span className="menu-label">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!collapsed ? (
            <div className="copyright-text">
              <div>© 2025 ExoBook</div>
              <div>All rights reserved.</div>
            </div>
          ) : (
            <div className="collapsed-footer-dot" title="© 2025 ExoBook" />
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
