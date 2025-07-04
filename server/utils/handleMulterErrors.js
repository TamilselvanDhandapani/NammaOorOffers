// 📁 utils/handleMulterErrors.js
const multer = require("multer");

const handleMulterErrors = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  });
};

module.exports = handleMulterErrors;
