// module.exports = upload;
const multer = require('multer');

// Armazenamento em memória
const armazenamento = multer.memoryStorage();

// Configuração do multer
const upload = multer({ storage: armazenamento });

module.exports = upload;
