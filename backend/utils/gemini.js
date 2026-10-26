const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Models tried in order if one is overloaded or unavailable
// All confirmed available for this API key via models.list()
const FALLBACK_MODELS = [
  "gemini-3.8-flash",      // Latest — try first
  "gemini-3.7-flash",      // One version back
  "gemini-3.5-flash",      // Stable fallback
  "gemini-flash-latest",   // Alias — always points to newest available
  "gemini-3.1-pro-preview" // Pro fallback (slower but reliable)
];

// Timeout (ms) per model attempt — avoids hanging forever
const MODEL_TIMEOUT_MS = 25000;

/**
 * Wrap a promise with a timeout
 */
const withTimeout = (promise, ms, modelName) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Model ${modelName} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);

/**
 * Generate content with automatic fallback across models.
 * Thinking mode is disabled for speed — resume analysis doesn't need deep reasoning.
 */
const generateWithFallback = async (prompt) => {
  let lastError;
  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`🤖 Trying model: ${model}`);
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            thinkingConfig: { thinkingBudget: 0 }, // Disable thinking — much faster
          },
        }),
        MODEL_TIMEOUT_MS,
        model
      );
      console.log(`✅ Success with model: ${model}`);
      return response.text;
    } catch (err) {
      const status = err?.status || err?.error?.code;
      const isRetryable = status === 503 || status === 404 || err.message?.includes("timed out");
      if (isRetryable) {
        console.warn(`⚠️ Model ${model} failed (${err.message}), trying next...`);
        lastError = err;
        continue;
      }
      throw err; // Auth errors, bad requests etc. — fail immediately
    }
  }
  throw lastError;
};

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
    const prompt = buildAnalysisPrompt(resumeText, role);

    let text = await generateWithFallback(prompt);

    // Clean up any accidental markdown wrapping
    text = text.replace(/```json/gi, "").replace(/```/gi, "").trim();

    const parsed = JSON.parse(text);

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error("❌ Gemini Analysis Error FULL:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Match resume against a job description using Gemini AI
 */
const matchJobDescription = async (resumeText, jobDescription, role) => {
  try {
    const prompt = buildJobMatchPrompt(resumeText, jobDescription, role);

    let text = await generateWithFallback(prompt);

    // Optional cleanup (safe)
    text = text.replace(/```json/gi, "").replace(/```/gi, "").trim();

    const parsed = JSON.parse(text);

    return { success: true, data: parsed };
  } catch (error) {
    console.error("❌ Gemini Job Match Error:", error);

    return {
      success: false,
      error: error.message || "Job match analysis failed",
    };
  }
};

module.exports = { analyzeResume, matchJobDescription };
