const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure 'public' directory exists or create it
const uploadDir = path.join(__dirname, '../../public');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Destination function called");
    cb(null, uploadDir); // Save files in the 'public' directory
  },
  filename: (req, file, cb) => {
    console.log('File details:', file);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Setup Multer with storage configuration
 const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB file size limit
  }
});


module.exports = {
  upload,
};