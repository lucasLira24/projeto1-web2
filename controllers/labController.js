const Laboratorio = require('../models/Lab'); // Modelo de laboratório
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

let dadosClima = []

// Conexão com o MongoDB
const conexao = mongoose.createConnection(process.env.MONGO_URL, {});

let gfs;
conexao.once('open', () => {
  console.log("Conexão estabelecida com sucesso");
  // Inicializa o GridFSBucket
  gfs = new GridFSBucket(conexao.db, {
    bucketName: 'Lab' // Define o nome do bucket onde os arquivos serão armazenados
  });
});

exports.criarLaboratorio = async (req, res) => {
  const { nome, descricao, capacidade } = req.body;
  const { file } = req;
  const { originalname, mimetype, buffer } = file;

  if (!nome) {
    return res.status(422).json({ message: 'O campo de nome é obrigatório' });
  }

  try {
    // Criando o arquivo no GridFS
    const uploadStream = gfs.openUploadStream(originalname, {
      contentType: mimetype,
    });

    const readBuffer = new Readable();
    readBuffer.push(buffer);
    readBuffer.push(null);

    const arquivoId = await new Promise((resolve, reject) => {
      readBuffer.pipe(uploadStream)
        .on("finish", () => resolve(uploadStream.id))
        .on("error", (err) => reject(err));
    });

    // Salva o laboratório no banco de dados, com referência ao arquivo no GridFS
    const novoLaboratorio = new Laboratorio({
      nome,
      descricao,
      capacidade,
      foto: arquivoId, // O ID do arquivo no GridFS
    });

    const laboratorioSalvo = await novoLaboratorio.save();
    res.status(201).json(laboratorioSalvo); // Responde com o laboratório criado
  } catch (err) {
    console.error('Erro ao salvar o laboratório:', err);
    res.status(500).json({ message: 'Erro ao salvar o laboratório', error: err });
  }
};

exports.gerarRelatorio = async (req, res) => {
  try {
    const laboratorios = await Laboratorio.find();

    const doc = new PDFDocument();
    // Mudar o diretório para um local temporário (exemplo: '/tmp/relatorio_laboratorios.pdf')
    const caminhoArquivo = path.join('/tmp', 'relatorio_laboratorios.pdf');
    const writeStream = fs.createWriteStream(caminhoArquivo);

    let yOffset = 20;

    // Loop para percorrer todos os laboratórios e gerar o conteúdo do PDF
    for (let laboratorio of laboratorios) {
      doc.text(`Nome: ${laboratorio.nome}`, 20, yOffset);
      yOffset += 20;

      doc.text(`Descrição: ${laboratorio.descricao}`, 20, yOffset);
      yOffset += 20;

      doc.text(`Capacidade: ${laboratorio.capacidade}`, 20, yOffset);
      yOffset += 20;

      // Verifica se há uma foto associada ao laboratório
      if (laboratorio.foto) {
        await adicionarImagemAoPDF(doc, laboratorio.foto, yOffset);
        yOffset += 200; // Ajusta o espaço após a imagem
      } else {
        doc.text("Sem foto", 20, yOffset);
        yOffset += 20;
      }

      if (yOffset > 700) {
        doc.addPage();
        yOffset = 20; // Reseta o yOffset para o topo da página
      }
    }
    writeStream.on('finish', () => {
      // Após gerar o PDF, faz o download do arquivo
      res.download(caminhoArquivo, "relatorio_laboratorios.pdf", (err) => {
        if (err) {
          res.status(500).json({ message: "Erro ao baixar o arquivo.", error: err });
        } else {
          fs.unlinkSync(caminhoArquivo); // Remove o arquivo temporário
        }foto
      });
    });
    
    doc.pipe(writeStream);
    doc.end();
  } catch (erro) {
    console.error("Erro ao gerar o relatório PDF:", erro);
    res.status(500).json({ message: "Erro no servidor ao gerar o relatório", error: erro });
  }
};

exports.videoTutorial = (req, res) => {
  const videoPath = path.join(__dirname, '..', 'videos', 'teste1.mp4'); // Caminho do vídeo

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": (end - start) + 1,
      "Content-Type": "video/mp4",
    });

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
};

exports.temperatura = (req, res) => {

  dadosClima.push(req.query.temp)
  res.json({mensagem: 'Temperatura gravada'})
};

exports.temperaturaAtual = (req, res) => {
  res.json({dados: dadosClima})
};
// Função para adicionar imagem ao PDF
async function adicionarImagemAoPDF(doc, fotoId, yOffset) {
  return new Promise((resolve, reject) => {
    const downloadStream = gfs.openDownloadStream(fotoId);

    const buffers = [];
    downloadStream.on("data", (chunk) => {
      buffers.push(chunk);
    });

    downloadStream.on("end", () => {
      const buffer = Buffer.concat(buffers);
      doc.image(buffer, 20, yOffset, { fit: [250, 300] });
      resolve();
    });

    downloadStream.on("error", (err) => {
      console.error("Erro ao baixar imagem do GridFS:", err);
      doc.text("Imagem não encontrada", 20, yOffset);
      resolve(); // Não interrompe o fluxo, apenas coloca uma mensagem
    });
  });
}

let io;

exports.setIo = (socketIo) => {
  io = socketIo;
};

exports.bloquearLaboratorio = async (req, res) => {
  const { lab } = req.params;

  if (!lab) {
    return res.status(400).json({ message: 'Nome do laboratório é obrigatório' });
  }

 try {
    const laboratorio = await Laboratorio.findOne({ nome: lab });

    if (!laboratorio) {
      return res.status(404).json({ message: `Laboratório "${lab}" não encontrado.` });
    }

    io.emit(`bloquear(${lab})`, { message: `O ${lab} foi bloqueado!` });

    res.status(200).json({ message: `Bloqueio do ${lab} notificado.` });
  } catch (error) {
    console.error("Erro ao bloquear laboratório:", error);
    res.status(500).json({ message: "Erro interno do servidor ao bloquear laboratório." });
  }

};