import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Upload, History, User, LogOut,
  Cpu, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Resume' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getRoleColor = (role) => {
    const colors = {
      'SDE': '#6366f1',
      'Data Scientist': '#8b5cf6',
      'Data Analyst': '#06b6d4',
      'Core Engineering (ECE/Mechanical)': '#f59e0b',
      'Product Manager': '#10b981',
      'DevOps Engineer': '#f97316',
      'Custom': '#ec4899',
    };
    return colors[role] || '#6366f1';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'w-[72px]' : ''}`}
        style={{ width: collapsed ? '72px' : '260px', transition: 'width 0.3s ease' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="ai-icon" style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Cpu size={18} color="white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                AI Resume
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                Analyzer
              </div>
            </div>
          )}

          {/* Mobile close */}
          <button onClick={onClose} className="ml-auto md:hidden" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? label : ''}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        {user && !collapsed && (
          <div className="p-4 border-t animate-fade-in" style={{ borderColor: 'var(--border)' }}>
            <div className="card" style={{ padding: '12px', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {user.name}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: `${getRoleColor(user.role)}20`,
                border: `1px solid ${getRoleColor(user.role)}40`,
                borderRadius: 20, padding: '2px 10px',
                fontSize: 11, fontWeight: 600, color: getRoleColor(user.role)
              }}>
                🎯 {user.role === 'Custom' ? user.customRole || 'Custom' : user.role}
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ color: 'var(--danger)', width: '100%' }}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-20 items-center justify-center"
          style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
