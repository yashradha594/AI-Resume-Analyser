import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreCard from '../components/ScoreCard';
import SuggestionList from '../components/SuggestionList';
import SkillTags from '../components/SkillTags';
import JobMatcher from '../components/JobMatcher';
import EmailStatus from '../components/EmailStatus';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

const UploadPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: (files) => {
      if (files[0]?.errors[0]?.code === 'file-too-large') {
        toast.error('File too large. Max 5MB allowed.');
      } else {
        toast.error('Only PDF files are accepted.');
      }
    }
  });

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please select a PDF file'); return; }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    if (email) formData.append('email', email);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setResult(data.data);
        toast.success('Resume analyzed successfully! 🎉');
        window.scrollTo({ top: document.getElementById('results')?.offsetTop - 80, behavior: 'smooth' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('AI Resume Analysis Report', 20, y); y += 12;

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Role: ${result.role}  |  Score: ${result.score}/10`, 20, y); y += 10;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y); y += 16;

    if (result.professionalSummary) {
      doc.setFontSize(13); doc.setTextColor(0);
      doc.text('Professional Summary', 20, y); y += 8;
      doc.setFontSize(10); doc.setTextColor(80);
      const summaryLines = doc.splitTextToSize(result.professionalSummary, 170);
      doc.text(summaryLines, 20, y); y += summaryLines.length * 5 + 10;
    }

    const addSection = (title, items) => {
      if (!items?.length) return;
      doc.setFontSize(13); doc.setTextColor(0);
      doc.text(title, 20, y); y += 8;
      doc.setFontSize(10); doc.setTextColor(80);
      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, 165);
        if (y + lines.length * 5 > 270) { doc.addPage(); y = 20; }
        doc.text(lines, 25, y); y += lines.length * 5 + 3;
      });
      y += 8;
    };

    addSection('Key Strengths', result.strengths);
    addSection('Improvement Suggestions', result.suggestions);
    addSection('Missing Skills', result.missingSkills);
    addSection('ATS Tips', result.atsTips);

    doc.save(`resume-analysis-${Date.now()}.pdf`);
    toast.success('PDF report downloaded!');
  };

  const role = user?.role === 'Custom' && user?.customRole ? user.customRole : user?.role;

  return (
    <div>
      {loading && <LoadingSpinner />}

      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}>
          <Upload size={22} style={{ color: '#6366f1' }} />
          Upload & Analyze Resume
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Analyzing for role: <strong style={{ color: '#a5b4fc' }}>{role}</strong>
          {' '}— Change this in{' '}
          <a href="/profile" style={{ color: '#6366f1', textDecoration: 'none' }}>Profile</a>
        </p>
      </div>

      {/* Upload Area */}
      <div className="card" style={{ marginBottom: 20 }}>
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          style={{ marginBottom: file ? 16 : 0 }}
        >
          <input {...getInputProps()} id="resume-file-input" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Upload size={24} color="#6366f1" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {isDragActive ? 'Drop your PDF here!' : 'Drag & drop your resume'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                or <span style={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}>browse files</span> · PDF only · Max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Selected File */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)'
              }}
            >
              <FileText size={20} color="#6366f1" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email input */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">Email for Report (optional)</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="report-email"
              type="email"
              className="input-field"
              style={{ paddingLeft: 42 }}
              placeholder="Receive full report in your inbox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          id="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
          ) : (
            '🔍 Analyze Resume with AI'
          )}
        </button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            id="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Email Status */}
            <EmailStatus sent={result.emailSent} email={result.emailAddress} />

            {/* Download button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleDownloadPDF} className="btn-secondary" style={{ fontSize: 13 }}>
                📥 Download PDF Report
              </button>
            </div>

            {/* Score + Project Feedback row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 2fr', gap: 20 }}>
              <ScoreCard score={result.score} />

              {result.projectFeedback && (
                <motion.div
                  className="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#a5b4fc', marginBottom: 12 }}>
                    🗂️ Project Feedback
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {result.projectFeedback}
                  </p>
                  {result.professionalSummary && (
                    <div style={{
                      marginTop: 16, padding: '14px 16px', borderRadius: 10,
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)'
                    }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Professional Summary
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {result.professionalSummary}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Missing Skills */}
            <SkillTags skills={result.missingSkills} role={result.role} />

            {/* Suggestions */}
            <SuggestionList
              suggestions={result.suggestions}
              strengths={result.strengths}
              atsTips={result.atsTips}
            />

            {/* Job Matcher */}
            <JobMatcher resumeId={result._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPage;
