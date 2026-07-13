import { Sun, Moon, Menu, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header style={{
      height: 64, background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="md:hidden btn-secondary"
        style={{ padding: '8px', borderRadius: 8 }}
      >
        <Menu size={20} />
      </button>

      {/* Page title area */}
      <div className="flex items-center gap-2" style={{ marginRight: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 15, fontWeight: 600, color: 'var(--text-primary)'
        }}>
          <Cpu size={16} style={{ color: '#6366f1' }} />
          AI Resume Analyzer
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          title="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User avatar */}
        {user && (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white',
            cursor: 'pointer',
          }}
            title={user.name}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
