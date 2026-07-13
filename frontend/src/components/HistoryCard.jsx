import { motion } from 'framer-motion';
import { FileText, Clock, Award, Trash2 } from 'lucide-react';

const HistoryCard = ({ resume, onView, onDelete }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getScoreData = (score) => {
    if (score >= 8) return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Excellent' };
    if (score >= 5) return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Good' };
    return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Needs Work' };
  };

  const { color, bg, label } = getScoreData(resume.score);

  return (
    <motion.div
      className="card-interactive"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onView(resume)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'rgba(99,102,241,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FileText size={20} color="#6366f1" />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
            marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {resume.fileName || 'Resume'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span className="tag tag-info" style={{ fontSize: 11 }}>🎯 {resume.role}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <Clock size={11} /> {formatDate(resume.createdAt)}
            </span>
          </div>

          {/* Score badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: bg, border: `1px solid ${color}30`,
            borderRadius: 20, padding: '3px 10px',
            fontSize: 12, fontWeight: 700, color
          }}>
            <Award size={12} />
            {resume.score}/10 · {label}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(resume._id); }}
          className="btn-danger"
          style={{ padding: '6px', borderRadius: 8, border: 'none', background: 'transparent' }}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
};

export default HistoryCard;
