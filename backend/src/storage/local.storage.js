const multer = require("multer");
const path = require("path");
const fs = require("fs");

const basePath = process.env.UPLOAD_BASE_PATH;
const uploadDir = path.join(basePath, "garbage-types");

// ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

module.exports = storage;
