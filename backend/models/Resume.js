const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      default: "resume.pdf",
    },
    resumeText: {
      type: String,
      required: true,
    },
    // AI Analysis Results
    score: {
      type: Number,
      min: 0,
      max: 10,
    },
    strengths: [{ type: String }],
    suggestions: [{ type: String }],
    missingSkills: [{ type: String }],
    projectFeedback: {
      type: String,
      default: "",
    },
    atsTips: [{ type: String }],
    professionalSummary: {
      type: String,
      default: "",
    },
    // Job Match
    jobDescription: {
      type: String,
      default: "",
    },
    jobMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    jobMatchDetails: {
      type: String,
      default: "",
    },
    // Email
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
