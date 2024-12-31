const Usuario = require("../models/Usuario.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  // Procura o usuário no banco de dados pelo e-mail
  const usuario = await Usuario.findOne({ email: email });

  // Caso o usuário não seja encontrado
  if (!usuario) {
    return res.status(422).json({ message: "Usuário não encontrado" });
  }

  // Verifica se a senha fornecida corresponde à senha criptografada no banco
  const validacaoSenha = await bcrypt.compare(senha, usuario.senha);

  // Caso a senha seja inválida
  if (!validacaoSenha) {
    return res.status(422).json({ message: "Usuário ou senha inválido" });
  }

  // Gera o token JWT para o usuário
  const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET);

  // Retorna o token para o usuário
  return res.status(200).json({ token });
};
