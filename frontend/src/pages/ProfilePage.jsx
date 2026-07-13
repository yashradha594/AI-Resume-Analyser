import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Loader2, Save } from 'lucide-react';
import RoleSelector from '../components/RoleSelector';

const ProfilePage = () => {
  const { user, updateRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'SDE');
  const [customRole, setCustomRole] = useState(user?.customRole || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selectedRole === 'Custom' && !customRole.trim()) {
      toast.error('Please enter your custom role');
      return;
    }
    setSaving(true);
    try {
      await updateRole(selectedRole, customRole);
      toast.success('Role updated successfully! 🎯');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  const currentRole = user?.role === 'Custom' && user?.customRole ? user.customRole : user?.role;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 className="section-title">
        <User size={22} style={{ color: '#6366f1' }} />
        My Profile
      </h1>

      {/* User Info Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {user?.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Mail size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 20, padding: '4px 14px',
              fontSize: 13, fontWeight: 600, color: '#a5b4fc'
            }}>
              🎯 Current Role: {currentRole}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role Update Section */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Update Target Role
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Your target role determines how AI analyzes your resume and what missing skills are highlighted
        </p>

        <RoleSelector
          selected={selectedRole}
          onSelect={setSelectedRole}
          customRole={customRole}
          onCustomRoleChange={setCustomRole}
        />

        <div style={{ marginTop: 20 }}>
          <button
            id="save-role-btn"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Role</>
            )}
          </button>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: 20 }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          Account Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email Address', value: user?.email },
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <footer
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
</footer>

    </div>
  );
};

export default ProfilePage;
