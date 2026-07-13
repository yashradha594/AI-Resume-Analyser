import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const JobMatcher = ({ resumeId }) => {
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jobDesc.trim() || jobDesc.trim().length < 20) {
      toast.error('Please enter a valid job description (min 20 characters)');
      return;
    }
    if (!resumeId) {
      toast.error('Please upload a resume first');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post(`/resume/match-job/${resumeId}`, {
        jobDescription: jobDesc,
      });
      if (data.success) {
        setResult(data.data);
        toast.success('Job match analysis complete!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Match analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 70) return { color: '#10b981', label: 'Strong Match', bg: 'rgba(16,185,129,0.1)' };
    if (score >= 45) return { color: '#f59e0b', label: 'Moderate Match', bg: 'rgba(245,158,11,0.1)' };
    return { color: '#ef4444', label: 'Weak Match', bg: 'rgba(239,68,68,0.1)' };
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16
      }}>
        <Briefcase size={18} style={{ color: '#6366f1' }} />
        Job Description Matcher
      </h3>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Paste a job description to see how well your resume matches it
      </p>

      <textarea
        className="input-field"
        rows={6}
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <button
        onClick={handleMatch}
        disabled={loading || !resumeId}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Analyzing Match...</>
        ) : (
          <><Briefcase size={16} /> Analyze Job Match</>
        )}
      </button>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 24 }}
        >
          {/* Match Score */}
          {(() => {
            const { color, label, bg } = getMatchColor(result.matchScore);
            return (
              <div style={{
                background: bg, border: `1px solid ${color}40`,
                borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 20
              }}>
                <div style={{ fontSize: 48, fontWeight: 800, color, lineHeight: 1 }}>
                  {result.matchScore}%
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color, marginTop: 4 }}>{label}</div>
                <div className="progress-bar" style={{ marginTop: 12 }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 4, background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.matchScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Matched Keywords */}
          {result.matchedKeywords?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#10b981', marginBottom: 8 }}>
                ✅ Matched Keywords ({result.matchedKeywords.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.matchedKeywords.map((kw, i) => (
                  <span key={i} className="tag tag-success" style={{ fontSize: 12 }}>{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {result.missingKeywords?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>
                ❌ Missing Keywords ({result.missingKeywords.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.missingKeywords.map((kw, i) => (
                  <span key={i} className="tag tag-danger" style={{ fontSize: 12 }}>{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div style={{
              background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)',
              borderRadius: 10, padding: 14
            }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Recommendation: </strong>
                {result.recommendation}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobMatcher;
