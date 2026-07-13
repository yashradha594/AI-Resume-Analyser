import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const SkillTags = ({ skills = [], role = '' }) => {
  if (!skills.length) return null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h3 style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 16, fontWeight: 700, color: '#ef4444', marginBottom: 6
      }}>
        <XCircle size={18} /> Missing Skills
      </h3>
      {role && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Skills recommended for <strong style={{ color: 'var(--text-secondary)' }}>{role}</strong> that are not found in your resume
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map((skill, i) => (
          <motion.span
            key={i}
            className="tag tag-danger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            ✕ {skill}
          </motion.span>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
        💡 Add these skills to your resume to increase your match rate
      </p>
    </motion.div>
  );
};

export default SkillTags;
