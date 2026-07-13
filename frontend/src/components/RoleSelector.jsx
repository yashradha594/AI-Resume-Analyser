import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const ROLES = [
  { id: 'SDE', label: 'Software Dev Engineer', desc: 'Full-stack, Backend, Frontend', icon: '💻', color: '#6366f1' },
  { id: 'Data Scientist', label: 'Data Scientist', desc: 'ML, Deep Learning, NLP, Python', icon: '🧠', color: '#8b5cf6' },
  { id: 'Data Analyst', label: 'Data Analyst', desc: 'SQL, Excel, Tableau, Power BI', icon: '📊', color: '#06b6d4' },
  { id: 'Core Engineering (ECE/Mechanical)', label: 'Core Engineering', desc: 'ECE, Mechanical, Civil', icon: '⚙️', color: '#f59e0b' },
  { id: 'Product Manager', label: 'Product Manager', desc: 'Roadmaps, Agile, Strategy', icon: '🚀', color: '#10b981' },
  { id: 'DevOps Engineer', label: 'DevOps Engineer', desc: 'CI/CD, Kubernetes, Cloud', icon: '☁️', color: '#f97316' },
  { id: 'Custom', label: 'Custom Role', desc: 'Enter your own target role', icon: '✏️', color: '#ec4899' },
];

const RoleSelector = ({ selected, onSelect, customRole, onCustomRoleChange }) => {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
        {ROLES.map((role) => {
          const isSelected = selected === role.id;
          return (
            <motion.button
              key={role.id}
              onClick={() => onSelect(role.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: isSelected ? `${role.color}15` : 'var(--bg-tertiary)',
                border: `2px solid ${isSelected ? role.color : 'var(--border-light)'}`,
                borderRadius: 12,
                padding: '16px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <CheckCircle size={16} color={role.color} />
                </div>
              )}
              <div style={{ fontSize: 24, marginBottom: 8 }}>{role.icon}</div>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: isSelected ? role.color : 'var(--text-primary)',
                marginBottom: 4, lineHeight: 1.3
              }}>
                {role.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {role.desc}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom role input */}
      {selected === 'Custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: 4 }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Enter your target role (e.g., Blockchain Developer)"
            value={customRole}
            onChange={(e) => onCustomRoleChange(e.target.value)}
          />
        </motion.div>
      )}
    </div>
  );
};

export default RoleSelector;
export { ROLES };
