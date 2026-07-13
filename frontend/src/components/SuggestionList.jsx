import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

const SuggestionList = ({ suggestions = [], strengths = [], atsTips = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Strengths */}
      {strengths.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 16, fontWeight: 700, color: '#10b981', marginBottom: 16
          }}>
            <CheckCircle size={18} /> Key Strengths
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {strengths.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6
                }}
              >
                <span style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }}>✓</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 16, fontWeight: 700, color: '#f59e0b', marginBottom: 16
          }}>
            <Lightbulb size={18} /> Improvement Suggestions
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {suggestions.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,158,11,0.07)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6
                }}
              >
                <AlertCircle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 3 }} />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ATS Tips */}
      {atsTips.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 16, fontWeight: 700, color: '#8b5cf6', marginBottom: 16
          }}>
            🤖 ATS Optimization Tips
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {atsTips.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6
                }}
              >
                <span style={{ color: '#8b5cf6', flexShrink: 0 }}>→</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default SuggestionList;
