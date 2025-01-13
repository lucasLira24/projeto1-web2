const Laboratorio = require('../models/Lab'); // Modelo de laboratório
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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

    // Cria um stream de upload para o GridFS
    const uploadStream = gfs.openUploadStream('relatorio_laboratorios.pdf', {
      contentType: 'application/pdf',
    });

    // Passa o stream de escrita do PDF para o GridFS
    doc.pipe(uploadStream);

    let yOffset = 20;
    let contadorLaboratorios = 0;

    // Loop para percorrer todos os laboratórios e gerar o conteúdo do PDF
    for (let laboratorio of laboratorios) {
      // Adiciona o nome, descrição e capacidade do laboratório
      doc.text(`Nome: ${laboratorio.nome}`, 20, yOffset);
      yOffset += 20;

      doc.text(`Descrição: ${laboratorio.descricao}`, 20, yOffset);
      yOffset += 20;

      doc.text(`Capacidade: ${laboratorio.capacidade}`, 20, yOffset);
      yOffset += 20;

      // Verifica se há uma foto associada ao laboratório
      if (laboratorio.foto) {
        // Adiciona a imagem ao PDF
        await adicionarImagemAoPDF(doc, laboratorio.foto, yOffset);
        yOffset += 200; // Ajusta o espaço após a imagem
      } else {
        doc.text("Sem foto", 20, yOffset);
        yOffset += 20;
      }

      contadorLaboratorios++;

      // Se o yOffset ultrapassar o limite da página, cria uma nova página
      if (yOffset > 700) { // 700px é uma margem para garantir que o conteúdo não ultrapasse
        doc.addPage();
        yOffset = 20; // Reseta o yOffset para o topo da página
      }
    }

    // Finaliza o documento e fecha o stream de upload
    doc.end();

    // Quando o upload do PDF no GridFS estiver completo
    uploadStream.on('finish', () => {
      res.status(200).json({ message: 'Relatório gerado com sucesso', fileId: uploadStream.id });
    });

  } catch (erro) {
    console.error("Erro ao gerar o relatório PDF:", erro);
    res.status(500).json({ message: "Erro no servidor ao gerar o relatório", error: erro });
  }
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

exports.gerarRelatorio = async (req, res) => {
  try {
    const laboratorios = await Laboratorio.find();

    const doc = new PDFDocument();
    // Mudar o diretório para um local temporário (exemplo: '/tmp/relatorio_laboratorios.pdf')
    const caminhoArquivo = path.join('/tmp', 'relatorio_laboratorios.pdf');
    const writeStream = fs.createWriteStream(caminhoArquivo);

    doc.pipe(writeStream);
    let yOffset = 20;
    let contadorLaboratorios = 0;

    writeStream.on('finish', () => {
      // Após gerar o PDF, faz o download do arquivo
      res.download(caminhoArquivo, "relatorio_laboratorios.pdf", (err) => {
        if (err) {
          res.status(500).json({ message: "Erro ao baixar o arquivo.", error: err });
        } else {
          fs.unlinkSync(caminhoArquivo); // Remove o arquivo temporário
        }
      });
    });

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

      contadorLaboratorios++;

      if (yOffset > 700) {
        doc.addPage();
        yOffset = 20; // Reseta o yOffset para o topo da página
      }
    }

    doc.end();
  } catch (erro) {
    console.error("Erro ao gerar o relatório PDF:", erro);
    res.status(500).json({ message: "Erro no servidor ao gerar o relatório", error: erro });
  }
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
