const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const forbiddenExts = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.vbs', '.msi', '.com', '.scr', '.ps1'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (forbiddenExts.includes(ext)) {
    return cb(new Error('Executable file uploads are strictly forbidden for security reasons.'), false);
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, PDFs, and standard office documents are permitted.`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
