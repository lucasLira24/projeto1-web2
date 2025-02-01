const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const rotasAutenticacao = require('./routes/usuarioRotas');
const rotasLaboratorio = require('./routes/labRotas');

const app = express();

// Middlewares 
app.use(express.json());
app.use(cors({origin: '*'}));
app.use(express.static('public'))
// Conexão com o banco de dados
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB conectado'))
    .catch((erro) => console.log(erro));

app.use('/api', rotasAutenticacao);
app.use('/api', rotasLaboratorio);

const PORTA = 5000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
