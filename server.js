const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
app.use(cors());

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // keep original extension (important)
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// API
app.post("/detect", upload.single("file"), (req, res) => {
  console.log("Request received");

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // 🔥 FIX: convert to absolute path (VERY IMPORTANT for Windows)
  const filePath = path.resolve(req.file.path);
  console.log("File path:", filePath);

  let command;

  if (req.file.mimetype.startsWith("video")) {
    console.log("Processing VIDEO");

    command = `python "${path.join(__dirname, '../Deepfake-Detect/detect_video.py')}" "${filePath}"`;
  } else {
    console.log("Processing IMAGE");

    command = `python "${path.join(__dirname, '../Deepfake-Detect/detect.py')}" "${filePath}"`;
  }

  exec(command, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (error) {
      console.error("ERROR:", error);
      return res.status(500).send("Error in processing");
    }

    res.json({ result: stdout.trim() }); // clean output
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});