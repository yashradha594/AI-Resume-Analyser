import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, FileText, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import HistoryCard from '../components/HistoryCard';
import ScoreCard from '../components/ScoreCard';
import SuggestionList from '../components/SuggestionList';
import SkillTags from '../components/SkillTags';

const HistoryPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/resume/history');
        if (data.success) setResumes(data.data);
      } catch {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleView = async (resume) => {
    try {
      const { data } = await api.get(`/resume/${resume._id}`);
      if (data.success) setSelected(data.data);
    } catch {
      setSelected(resume);
    }
  };

  return (
    <div>
      <h1 className="section-title">
        <History size={22} style={{ color: '#6366f1' }} />
        Resume History
      </h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} color="#6366f1" className="animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px 24px' }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>📂</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            No History Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            Upload and analyze your first resume to see it here
          </p>
          <a href="/upload" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} /> Upload First Resume
          </a>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              {resumes.length} analysis record{resumes.length !== 1 ? 's' : ''} found
            </p>
            {resumes.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <HistoryCard
                  resume={r}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 16
                }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selected.fileName}
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <ScoreCard score={selected.score} />
                  <SkillTags skills={selected.missingSkills} role={selected.role} />
                  <SuggestionList
                    suggestions={selected.suggestions}
                    strengths={selected.strengths}
                    atsTips={selected.atsTips}
                  />

                  {selected.projectFeedback && (
                    <div className="card">
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>Project Feedback</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selected.projectFeedback}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
