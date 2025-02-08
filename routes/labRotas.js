const express = require('express');
const router = express.Router();
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware.js').autenticacaoMiddleware;
const upload = require('../middlewares/multer.js');
const labController = require('../controllers/labController.js');
const diaSemanaMiddleware = require('../middlewares/diaSemanaMiddleware.js').diaSemanaMiddleware;


router.post('/laboratorio/novo', autenticacaoMiddleware, diaSemanaMiddleware, upload.single('foto'), labController.criarLaboratorio);
router.get('/laboratorio/relatorio', autenticacaoMiddleware, diaSemanaMiddleware, labController.gerarRelatorio);
router.get('/videoTutorial', diaSemanaMiddleware, labController.videoTutorial)
router.get('/temperatura', diaSemanaMiddleware, labController.temperatura)
router.get('/temperaturaAtual', diaSemanaMiddleware, labController.temperaturaAtual)
router.post('/bloquear/:lab', autenticacaoMiddleware, labController.bloquearLaboratorio);
router.get('/obterStatusLuz', diaSemanaMiddleware, labController.temperatura)
router.get('/ligarLuz', diaSemanaMiddleware, labController.temperaturaAtual)

module.exports = router;

