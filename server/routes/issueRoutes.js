const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue
} = require('../controllers/issueController');

const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `issue-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // Max 5MB
});

router
  .route('/')
  .get(getAllIssues)
  .post(upload.single('image'), createIssue);

router
  .route('/:id')
  .get(getIssueById)
  .put(updateIssueStatus)
  .delete(deleteIssue);

module.exports = router;
