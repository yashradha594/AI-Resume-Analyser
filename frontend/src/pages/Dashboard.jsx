import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, History, User, TrendingUp, Clock, Award, Cpu } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role === 'Custom' && user?.customRole ? user.customRole : user?.role;

  const quickActions = [
    {
      icon: Upload, label: 'Upload Resume', desc: 'Analyze a new resume with AI',
      to: '/upload', color: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)'
    },
    {
      icon: History, label: 'View History', desc: 'See your past analyses',
      to: '/history', color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#34d399)'
    },
    {
      icon: User, label: 'My Profile', desc: 'Update your target role',
      to: '/profile', color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#fcd34d)'
    },
  ];

  const tips = [
    '📌 Use a text-based PDF (not scanned) for best results',
    '🎯 Make sure your role is correctly set in Profile for accurate analysis',
    '📧 Add your email to receive a formatted report after analysis',
    '💡 Use the Job Matcher to compare your resume with job descriptions',
    '📥 Download your analysis as a PDF from the Upload page',
  ];

  return (
    <div>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 32, padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 16, position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Cpu size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Your target role:{' '}
              <span style={{
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 20, padding: '2px 10px', fontSize: 13,
                fontWeight: 600, color: '#a5b4fc'
              }}>
                🎯 {role}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <h2 className="section-title">
        <LayoutDashboard size={20} style={{ color: '#6366f1' }} />
        Quick Actions
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {quickActions.map(({ icon: Icon, label, desc, to, color, gradient }, i) => (
          <motion.div
            key={to}
            className="card-interactive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(to)}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, marginBottom: 14,
              background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={22} color="white" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Role Card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Award size={18} color="#f59e0b" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Your Target Role</h3>
          </div>
          <div style={{
            padding: '16px', borderRadius: 12, textAlign: 'center',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)'
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#a5b4fc', marginBottom: 4 }}>{role}</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI will tailor analysis for this role</p>
          </div>
          <button onClick={() => navigate('/profile')} className="btn-secondary" style={{ width: '100%', marginTop: 12, justifyContent: 'center', fontSize: 13 }}>
            Change Role
          </button>
        </motion.div>

        {/* Tips */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <TrendingUp size={18} color="#10b981" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Pro Tips</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}
              >
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          textAlign: 'center', padding: '32px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}></div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Ready to Analyze Your Resume?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
          Upload your PDF and get AI-powered insights in under 30 seconds
        </p>
        <button onClick={() => navigate('/upload')} className="btn-primary glow" style={{ padding: '12px 32px' }}>
          Upload Resume Now →
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
