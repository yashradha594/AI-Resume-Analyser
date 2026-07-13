import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Upload, BarChart3, Mail, Shield, Zap, ChevronRight } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Google Gemini analyzes your resume for role-specific insights', color: '#6366f1' },
  { icon: BarChart3, title: 'Resume Scoring', desc: 'Get a score out of 10 with detailed feedback and ATS tips', color: '#8b5cf6' },
  { icon: Upload, title: 'PDF Upload', desc: 'Upload any text-based PDF resume in seconds', color: '#06b6d4' },
  { icon: Mail, title: 'Email Report', desc: 'Receive a detailed HTML report directly in your inbox', color: '#10b981' },
  { icon: Shield, title: 'Role-Based Insights', desc: 'Analysis tailored to SDE, Data Scientist, Core ECE, and more', color: '#f59e0b' },
  { icon: Zap, title: 'Job Matching', desc: 'Compare your resume against any job description instantly', color: '#f97316' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15), transparent)',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Brain size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
            AI Resume Analyzer
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: 14 }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: 14 }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '100px 24px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 24,
            fontSize: 13, color: '#a5b4fc', fontWeight: 600
          }}>
            <Zap size={14} /> Powered by Google Gemini AI
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 900, lineHeight: 1.1, marginBottom: 24,
            color: 'var(--text-primary)'
          }}>
            Supercharge Your Resume<br />
            <span className="gradient-text">With AI Intelligence</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px',
            lineHeight: 1.7
          }}>
            Get role-specific resume analysis, ATS scoring, missing skills detection,
            and job description matching — all powered by Google Gemini.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup')}
              className="btn-primary glow"
              style={{ padding: '14px 32px', fontSize: 16, borderRadius: 12 }}
            >
              Analyze My Resume Free <ChevronRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate('/login')}
              className="btn-secondary"
              style={{ padding: '14px 32px', fontSize: 16, borderRadius: 12 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap',
            marginTop: 60, paddingTop: 40,
            borderTop: '1px solid var(--border)'
          }}
        >
          {[
            { value: '10+', label: 'AI Metrics Analyzed' },
            { value: '6+', label: 'Target Roles' },
            { value: '100%', label: 'Free on Gemini Tier' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: 36, fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}
        >
          Everything You Need
        </motion.h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48, fontSize: 16 }}>
          Comprehensive resume intelligence in one platform
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: color, y: -4 }}
              style={{ cursor: 'default' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                background: `${color}15`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <motion.div
          className="glass-card"
          style={{ maxWidth: 600, margin: '0 auto', padding: '48px 40px' }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            Ready to Land Your Dream Job?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
            Join candidates who are using AI to optimize their resumes and get more interviews.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary glow"
            style={{ padding: '14px 40px', fontSize: 16 }}
          >
            Start Analyzing — It's Free
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)', fontSize: 13
      }}>
        Built with ❤️ using React + Gemini AI · AI Resume Analyzer © 2024
      </footer>
    </div>
  );
};

export default LandingPage;
