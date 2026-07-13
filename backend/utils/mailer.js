const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Generate score color based on score value
 */
const getScoreColor = (score) => {
  if (score >= 8) return "#10b981"; // green
  if (score >= 5) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};

/**
 * Generate HTML email body for resume analysis report
 */
const generateEmailHTML = (userName, role, analysisData, fileName) => {
  const {
    score,
    strengths = [],
    suggestions = [],
    missingSkills = [],
    projectFeedback,
    atsTips = [],
    professionalSummary,
  } = analysisData;

  const scoreColor = getScoreColor(score);
  const scorePercent = (score / 10) * 100;

  const listItems = (arr) =>
    arr.map((item) => `<li style="margin-bottom:8px;">${item}</li>`).join("");

  const skillTags = missingSkills
    .map(
      (skill) =>
        `<span style="display:inline-block;background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:20px;font-size:13px;margin:4px;">${skill}</span>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Analysis Report</title>
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#0f172a;margin:0;padding:20px;">
  <div style="max-width:640px;margin:0 auto;background:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">AI Resume Analyzer</h1>
      <p style="color:#c7d2fe;margin:8px 0 0;font-size:16px;">Your Personalized Resume Report</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      
      <!-- Greeting -->
      <p style="color:#94a3b8;font-size:15px;margin:0 0 8px;">Hello, <strong style="color:#e2e8f0;">${userName}</strong> 👋</p>
      <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">
        Here is your AI-powered resume analysis report for the <strong style="color:#818cf8;">${role}</strong> role.
        File analyzed: <em style="color:#64748b;">${fileName}</em>
      </p>

      <!-- Score Card -->
      <div style="background:#0f172a;border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
        <p style="color:#94a3b8;margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Resume Score</p>
        <div style="font-size:64px;font-weight:800;color:${scoreColor};line-height:1;">${score}<span style="font-size:28px;color:#475569;">/10</span></div>
        <div style="background:#1e293b;border-radius:8px;height:10px;margin:16px 0 0;overflow:hidden;">
          <div style="height:100%;width:${scorePercent}%;background:${scoreColor};border-radius:8px;transition:width 0.5s;"></div>
        </div>
      </div>

      <!-- Professional Summary -->
      ${
        professionalSummary
          ? `
      <div style="background:#1e3a5f;border-left:4px solid #3b82f6;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <h3 style="color:#93c5fd;margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Professional Summary</h3>
        <p style="color:#cbd5e1;font-size:14px;margin:0;line-height:1.7;">${professionalSummary}</p>
      </div>`
          : ""
      }

      <!-- Strengths -->
      ${
        strengths.length
          ? `
      <div style="margin-bottom:24px;">
        <h3 style="color:#10b981;font-size:16px;margin:0 0 12px;">✅ Key Strengths</h3>
        <ul style="color:#cbd5e1;font-size:14px;padding-left:20px;margin:0;line-height:1.8;">
          ${listItems(strengths)}
        </ul>
      </div>`
          : ""
      }

      <!-- Suggestions -->
      ${
        suggestions.length
          ? `
      <div style="margin-bottom:24px;">
        <h3 style="color:#f59e0b;font-size:16px;margin:0 0 12px;">💡 Improvement Suggestions</h3>
        <ul style="color:#cbd5e1;font-size:14px;padding-left:20px;margin:0;line-height:1.8;">
          ${listItems(suggestions)}
        </ul>
      </div>`
          : ""
      }

      <!-- Missing Skills -->
      ${
        missingSkills.length
          ? `
      <div style="margin-bottom:24px;">
        <h3 style="color:#ef4444;font-size:16px;margin:0 0 12px;"> Missing Skills for ${role}</h3>
        <div>${skillTags}</div>
      </div>`
          : ""
      }

      <!-- Project Feedback -->
      ${
        projectFeedback
          ? `
      <div style="background:#172554;border-left:4px solid #6366f1;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <h3 style="color:#a5b4fc;margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Project Feedback</h3>
        <p style="color:#cbd5e1;font-size:14px;margin:0;line-height:1.7;">${projectFeedback}</p>
      </div>`
          : ""
      }

      <!-- ATS Tips -->
      ${
        atsTips.length
          ? `
      <div style="margin-bottom:24px;">
        <h3 style="color:#8b5cf6;font-size:16px;margin:0 0 12px;"> ATS Optimization Tips</h3>
        <ul style="color:#cbd5e1;font-size:14px;padding-left:20px;margin:0;line-height:1.8;">
          ${listItems(atsTips)}
        </ul>
      </div>`
          : ""
      }

    </div>

    <!-- Footer -->
    <div style="background:#0f172a;padding:20px 32px;text-align:center;border-top:1px solid #1e293b;">
      <p style="color:#475569;font-size:12px;margin:0;">
        Generated by <strong style="color:#6366f1;">AI Resume Analyzer</strong> &bull; 
        Keep improving and keep growing! 
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send analysis report email
 */
const sendAnalysisEmail = async (toEmail, userName, role, analysisData, fileName) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not set. Skipping email.");
      return { success: false, reason: "Email not configured" };
    }

    const transporter = createTransporter();
    const htmlContent = generateEmailHTML(userName, role, analysisData, fileName);

    const mailOptions = {
      from: `"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `📊 Your Resume Analysis Report — ${role} | AI Resume Analyzer`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Mailer Error:", error.message);
    return { success: false, reason: error.message };
  }
};

module.exports = { sendAnalysisEmail };
