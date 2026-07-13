import { motion } from 'framer-motion';
import { TrendingUp, Star } from 'lucide-react';

const ScoreCard = ({ score }) => {
  if (score === undefined || score === null) return null;

  const percent = (score / 10) * 100;

  const getScoreData = (s) => {
    if (s >= 8) return { label: 'Excellent', color: '#10b981', barClass: 'score-bar-high', textClass: 'score-high', emoji: '🏆' };
    if (s >= 5) return { label: 'Good', color: '#f59e0b', barClass: 'score-bar-medium', textClass: 'score-medium', emoji: '📈' };
    return { label: 'Needs Work', color: '#ef4444', barClass: 'score-bar-low', textClass: 'score-low', emoji: '💪' };
  };

  const { label, color, barClass, textClass, emoji } = getScoreData(score);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ textAlign: 'center', padding: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        <TrendingUp size={18} style={{ color: '#6366f1' }} />
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Resume Score
        </h3>
      </div>

      {/* Score circle */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
          {/* Score arc */}
          <motion.circle
            cx="70" cy="70" r="60"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={2 * Math.PI * 60}
            style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 60 * (1 - percent / 100)
            }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <motion.span
            className={textClass}
            style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>/10</span>
        </div>
      </div>

      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <span style={{ fontSize: 18, fontWeight: 700, color }}>
          {label}
        </span>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            fill={i < score ? color : 'transparent'}
            stroke={i < score ? color : 'var(--border-light)'}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginTop: 20 }}>
        <motion.div
          className={`progress-fill ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        />
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
        Based on AI analysis for your selected role
      </p>
    </motion.div>
  );
};

export default ScoreCard;
