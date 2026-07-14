// ==============================
//  IMPORTS
// ==============================
const nodemailer = require("nodemailer");


// ==============================
//  CREATE TRANSPORTER
// ==============================
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //  Verify connection (DEBUGGING)
  transporter.verify((error) => {
    if (error) {
      console.error("❌ Email transporter error:", error.message);
    } else {
      console.log("✅ Email server ready");
    }
  });

  return transporter;
};


// ==============================
//  SCORE COLOR HELPER
// ==============================
const getScoreColor = (score) => {
  if (score >= 8) return "#10b981"; // green
  if (score >= 5) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};


// ==============================
//  GENERATE EMAIL HTML
// ==============================
const generateEmailHTML = (userName, role, analysisData, fileName) => {

  //  SAFETY CHECK (VERY IMPORTANT)
  if (!analysisData || typeof analysisData !== "object") {
    return `<p>Invalid analysis data. Please try again.</p>`;
  }

  //  FALLBACK VALUES (prevents undefined UI)
  userName = userName || "User";
  role = role || "your target role";
  fileName = fileName || "your resume";

  //  SAFE DESTRUCTURING
  const {
    score: scoreRaw = 0,
    strengths = [],
    suggestions = [],
    missingSkills = [],
    projectFeedback,
    atsTips = [],
    professionalSummary,
  } = analysisData;

  //  CLEAN SCORE
  const score = Math.round(scoreRaw);
  const scoreColor = getScoreColor(score);

  //  SAFE PERCENT
  const scorePercent = Math.max(0, Math.min(100, (score / 10) * 100));

  // Helpers
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
<body style="font-family:Arial;background:#0f172a;padding:20px;">

  <div style="max-width:640px;margin:auto;background:#1e293b;border-radius:16px;overflow:hidden;">

    <div style="background:#6366f1;padding:30px;text-align:center;">
      <h1 style="color:#fff;margin:0;">AI Resume Analyzer</h1>
    </div>

    <div style="padding:24px;">
      <p style="color:#cbd5e1;">Hello <strong>${userName}</strong></p>
      <p style="color:#94a3b8;">
        Role: <strong>${role}</strong><br/>
        File: ${fileName}
      </p>

      <h2 style="color:${scoreColor};">${score}/10</h2>

      <div style="background:#334155;height:10px;border-radius:6px;">
        <div style="width:${scorePercent}%;background:${scoreColor};height:100%;"></div>
      </div>

      ${
        strengths.length
          ? `<h3>Strengths</h3><ul>${listItems(strengths)}</ul>`
          : ""
      }

      ${
        suggestions.length
          ? `<h3>Suggestions</h3><ul>${listItems(suggestions)}</ul>`
          : ""
      }

      ${
        missingSkills.length
          ? `<h3>Missing Skills</h3><div>${skillTags}</div>`
          : ""
      }

      ${
        projectFeedback
          ? `<h3>Project Feedback</h3><p>${projectFeedback}</p>`
          : ""
      }

      ${
        atsTips.length
          ? `<h3>ATS Tips</h3><ul>${listItems(atsTips)}</ul>`
          : ""
      }

    </div>

  </div>
</body>
</html>
  `;
};


// ==============================
// 📧 SEND EMAIL FUNCTION
// ==============================
const sendAnalysisEmail = async (
  toEmail,
  userName,
  role,
  analysisData,
  fileName
) => {
  try {
    //  CHECK ENV
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not configured");
    }

    const transporter = createTransporter();

    //  VALIDATE DATA (CRITICAL FIX)
    if (!analysisData || typeof analysisData.score !== "number") {
      throw new Error("Invalid analysis data: score missing");
    }

    //  GENERATE HTML
    const htmlContent = generateEmailHTML(
      userName,
      role,
      analysisData,
      fileName
    );

    const mailOptions = {
      from: `"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `📊 Resume Report — ${role}`,
      html: htmlContent,
    };

    //  SEND EMAIL
    await transporter.sendMail(mailOptions);

    console.log(` Email sent to ${toEmail}`);

    return { success: true };

  } catch (error) {
    //  DO NOT SILENT FAIL
    console.error(" Mailer Error FULL:", error);

    throw error; //  IMPORTANT (lets controller handle it)
  }
};


// ==============================
// 📤 EXPORT
// ==============================
module.exports = { sendAnalysisEmail };
