const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const http = require('http');
const { Server } = require('socket.io');

const rotasAutenticacao = require('./routes/usuarioRotas');
const rotasLaboratorio = require('./routes/labRotas');
const labController = require('./controllers/labController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', }, });
labController.setIo(io);

// Middlewares 
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static('public'));

// Conexão com o banco de dados
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB conectado'))
    .catch((erro) => console.log(erro));

// Configuração do Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('bloquearLab', (data) => {
        io.emit('bloquearLab', data);
    });
});

// Definição das rotas
app.use('/api', rotasAutenticacao);
app.use('/api', rotasLaboratorio);

const PORTA = 5000;
server.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));

module.exports = server ;
