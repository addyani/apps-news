const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, '././public/images');
	}, 
	filename: (req, file, callback) => {
		callback(null, Date.now() + path.extname(file.originalname))
	}
});

const upload = multer({
	storage: fileStorage
  });

  module.exports = upload