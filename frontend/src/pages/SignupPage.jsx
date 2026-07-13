import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import RoleSelector from '../components/RoleSelector';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1); // 1 = account info, 2 = role selection
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'SDE', customRole: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (form.role === 'Custom' && !form.customRole.trim()) {
      toast.error('Please enter your custom role');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        customRole: form.customRole,
      });
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '24px',
      backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18), transparent)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: step === 2 ? 700 : 440, padding: '40px 36px' }}
      >
        {/* Logo + Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Brain size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            {step === 1 ? 'Create Your Account' : 'Choose Your Target Role'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {step === 1 ? 'Start getting AI-powered resume insights' : 'This helps us personalize your resume analysis'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : 'var(--border-light)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        {/* Step 1 — Account Info */}
        {step === 1 && (
          <form onSubmit={handleNext}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="signup-name" name="name" type="text" className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="John Doe" value={form.name} onChange={handleChange} />
              </div>
              {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>{errors.name}</p>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="signup-email" name="email" type="email" className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="signup-password" name="password" type={showPwd ? 'text' : 'password'} className="input-field"
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>{errors.password}</p>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="signup-confirm" name="confirmPassword" type="password" className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
              </div>
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Continue to Role Selection →
            </button>
          </form>
        )}

        {/* Step 2 — Role Selection */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <RoleSelector
              selected={form.role}
              onSelect={(r) => setForm((p) => ({ ...p, role: r }))}
              customRole={form.customRole}
              onCustomRoleChange={(v) => setForm((p) => ({ ...p, customRole: v }))}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                ← Back
              </button>
              <button
                id="signup-submit"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center' }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : 'Create Account 🚀'}
              </button>
            </div>
          </motion.div>
        )}

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>

 {/* <footer
  style={{
    marginTop: 'auto',
    paddingTop: '20px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    textAlign: 'center'
  }}
>
  Made with <span style={{ color: '#3b82f6' }}>💙</span> by{" "}
  <span style={{ fontWeight: 600, color: '#6366f1' }}>
    Y R
  </span>
</footer> */}

    </div>
  );
};

export default SignupPage;
