const express = require('express');
const router = express.Router();
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware.js').autenticacaoMiddleware;
const upload = require('../middlewares/multer.js');
const labController = require('../controllers/labController.js');
const diaSemanaMiddleware = require('../middlewares/diaSemanaMiddleware.js').diaSemanaMiddleware;


router.post('/laboratorio/novo', autenticacaoMiddleware, diaSemanaMiddleware, upload.single('foto'), labController.criarLaboratorio);
router.get('/laboratorio/relatorio', autenticacaoMiddleware, diaSemanaMiddleware, labController.gerarRelatorio);
router.get('/videoTutorial', labController.videoTutorial)
router.get('/temperatura', labController.temperatura)
router.get('/temperaturaAtual', labController.temperaturaAtual)
router.post('/bloquear/:lab', labController.bloquearLaboratorio);
router.get('/obterStatusLuz', labController.obterStatusLuz)
router.get('/ligarLuz', labController.ligarLuz)

module.exports = router;

