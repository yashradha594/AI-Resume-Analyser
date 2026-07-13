const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadResume,
  getHistory,
  getResumeById,
  matchJob,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// All routes are protected
router.use(protect);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/history", getHistory);
router.get("/:id", getResumeById);
router.post("/match-job/:id", matchJob);
router.delete("/:id", deleteResume);

module.exports = router;
