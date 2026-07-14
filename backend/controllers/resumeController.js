
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const User = require("../models/User");
const { analyzeResume, matchJobDescription } = require("../utils/gemini");
const { sendAnalysisEmail } = require("../utils/mailer");

/**
 * @desc  Upload and analyze resume
 * @route POST /api/resume/upload
 * @access Private
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const { email: emailAddress } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role =
      user.role === "Custom" && user.customRole
        ? user.customRole
        : user.role;

    let resumeText = "";

    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (pdfError) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF file",
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "PDF is empty or image-based",
      });
    }

    const analysisResult = await analyzeResume(resumeText, role);

    if (!analysisResult.success) {
      return res.status(503).json({
        success: false,
        message: "AI analysis failed",
      });
    }

    const newResume = await Resume.create({
      userId,
      email: emailAddress,
      role,
      resumeText,
      analysis: analysisResult.data,
    });

    if (emailAddress) {
      await sendAnalysisEmail(emailAddress, analysisResult.data);
    }

    res.status(201).json({
      success: true,
      data: newResume,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
//changes till here is made 

/**
 * @desc  Get user's resume history
 * @route GET /api/resume/history
 * @access Private
 */
const getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select("-resumeText") // Exclude large text
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error("Get History Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc  Get single resume analysis
 * @route GET /api/resume/:id
 * @access Private
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error("Get Resume Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc  Match resume against job description
 * @route POST /api/resume/match-job/:id
 * @access Private
 */
const matchJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid job description",
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const matchResult = await matchJobDescription(
      resume.resumeText,
      jobDescription,
      resume.role
    );

    if (!matchResult.success) {
      return res.status(503).json({
        success: false,
        message: "Job match analysis failed",
        error: matchResult.error,
      });
    }

    // Update resume with job match data
    await Resume.findByIdAndUpdate(resume._id, {
      jobDescription,
      jobMatchScore: matchResult.data.matchScore,
      jobMatchDetails: matchResult.data.recommendation,
    });

    res.status(200).json({
      success: true,
      data: matchResult.data,
    });
  } catch (error) {
    console.error("Match Job Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc  Delete a resume record
 * @route DELETE /api/resume/:id
 * @access Private
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete Resume Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { uploadResume, getHistory, getResumeById, matchJob, deleteResume };
