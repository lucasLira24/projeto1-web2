const multer = require('multer');

const armazenamento = multer.memoryStorage();

const upload = multer({ storage: armazenamento });

module.exports = upload;
