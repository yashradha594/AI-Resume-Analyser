const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Build a role-specific prompt for resume analysis
 */
const buildAnalysisPrompt = (resumeText, role) => {
  const roleLower = role.toLowerCase();
  const isTechnical =
    roleLower.includes("sde") ||
    roleLower.includes("software") ||
    roleLower.includes("data scientist") ||
    roleLower.includes("data analyst") ||
    roleLower.includes("devops");

  const isCoreEngineering =
    roleLower.includes("core") ||
    roleLower.includes("ece") ||
    roleLower.includes("mechanical") ||
    roleLower.includes("electrical");

  let roleSpecificFocus = "";

  if (isTechnical) {
    roleSpecificFocus = `
Since this is a technical role, pay special attention to:
- Programming languages and tech stack proficiency
- Quality and impact of software/data projects
- Problem-solving skills and algorithmic thinking
- Open source contributions or competitive programming
- Cloud/DevOps tools if relevant
- Database and system design knowledge`;
  } else if (isCoreEngineering) {
    roleSpecificFocus = `
Since this is a core engineering role, pay special attention to:
- Core subject knowledge (relevant to ECE/Mechanical/Civil)
- Technical tools (MATLAB, Verilog, AutoCAD, SolidWorks, ANSYS, etc.)
- Lab and internship experience
- Research or thesis work
- Industry certifications relevant to the domain`;
  } else {
    roleSpecificFocus = `
For this role, pay special attention to:
- Leadership and management skills
- Communication and collaboration abilities
- Domain expertise and business acumen
- Relevant certifications and training`;
  }

  return `
You are an expert resume analyst and career coach. Analyze the following resume for a candidate targeting the role of **${role}**.

${roleSpecificFocus}

Resume Text:
"""
${resumeText}
"""

Provide a comprehensive, structured evaluation. Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this EXACT structure:

{
  "score": <number from 1 to 10>,
  "strengths": [<string>, <string>, ...],
  "suggestions": [<string>, <string>, ...],
  "missingSkills": [<string>, <string>, ...],
  "projectFeedback": "<string>",
  "atsTips": [<string>, <string>, ...],
  "professionalSummary": "<string>"
}

Rules:
- score: Integer from 1-10 based on suitability for ${role}
- strengths: 3-5 key strengths relevant to ${role}
- suggestions: 4-6 actionable improvement suggestions specific to ${role}
- missingSkills: 4-8 skills/tools that are missing but important for ${role}
- projectFeedback: 2-3 sentences on whether projects align with ${role}
- atsTips: 3-5 ATS optimization tips
- professionalSummary: A 2-3 sentence professional summary for this candidate targeting ${role}
`;
};

/**
 * Build prompt for job description matching
 */
const buildJobMatchPrompt = (resumeText, jobDescription, role) => {
  return `
You are an expert ATS (Applicant Tracking System) and recruiter. Compare the following resume with the job description for a ${role} position.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return ONLY a valid JSON object (no markdown, no code blocks) with this EXACT structure:

{
  "matchScore": <number from 0 to 100>,
  "matchedKeywords": [<string>, <string>, ...],
  "missingKeywords": [<string>, <string>, ...],
  "recommendation": "<string>",
  "strengthsForRole": [<string>, <string>, ...]
}

Rules:
- matchScore: Percentage (0-100) indicating how well the resume matches the JD
- matchedKeywords: Keywords from JD found in resume
- missingKeywords: Important JD keywords missing from resume
- recommendation: 2-3 sentence recommendation on fit and what to improve
- strengthsForRole: 3-4 resume strengths that align with this JD
`;
};

/**
 * Analyze resume using Gemini AI
 */
const analyzeResume = async (resumeText, role) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = buildAnalysisPrompt(resumeText, role);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    return {
      success: false,
      error: error.message || "AI analysis failed",
    };
  }
};

/**
 * Match resume against a job description using Gemini AI
 */
const matchJobDescription = async (resumeText, jobDescription, role) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = buildJobMatchPrompt(resumeText, jobDescription, role);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response
    text = text.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch (error) {
    console.error("Gemini Job Match Error:", error.message);
    return {
      success: false,
      error: error.message || "Job match analysis failed",
    };
  }
};

module.exports = { analyzeResume, matchJobDescription };
