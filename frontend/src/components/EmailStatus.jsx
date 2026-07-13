import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

const EmailStatus = ({ sent, email }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 20px',
        borderColor: sent ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)',
        background: sent ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.05)',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: sent ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Mail size={18} color={sent ? '#10b981' : '#ef4444'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          {sent ? (
            <CheckCircle size={14} color="#10b981" />
          ) : (
            <XCircle size={14} color="#ef4444" />
          )}
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: sent ? '#10b981' : '#ef4444'
          }}>
            {sent ? 'Email Report Sent!' : 'Email Not Sent'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {sent
            ? `Report delivered to ${email || 'your email'}`
            : email
              ? 'Email delivery failed. Please check your email configuration.'
              : 'No email address provided'}
        </p>
      </div>
    </motion.div>
  );
};

export default EmailStatus;
