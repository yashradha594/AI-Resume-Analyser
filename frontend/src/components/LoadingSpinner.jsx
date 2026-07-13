import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const LoadingSpinner = ({ message = 'AI is analyzing your resume...', subMessage = 'This may take 15–30 seconds' }) => {
  return (
    <div className="loading-overlay">
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* AI Pulse Animation */}
        <div className="ai-pulse animate-pulse-glow">
          <Brain size={32} color="white" />
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Text */}
        <div>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            {message}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{subMessage}</p>
        </div>

        {/* Progress bar */}
        <div style={{ width: 280, height: 4, borderRadius: 2, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 2 }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* AI facts */}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6 }}>
          ✨ Powered by Google Gemini AI — analyzing skills, ATS compatibility, and role-fit
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
