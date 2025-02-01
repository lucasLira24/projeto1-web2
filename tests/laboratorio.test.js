const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

describe("POST /api/laboratorio/novo", () => {
    it("deve cadastrar um novo laboratório", async () => {
      const url = "http://localhost:5000/api/laboratorio/novo";
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzcwMjUxNmU4YWI5ZTFlMDllZmI3NzciLCJpYXQiOjE3MzU0MTEyODF9.5k-sY3NZI7QuejN-uaedRC_kXNLNQNQQpQhCOYT6eAk'; // Substitua pelo seu token

      const form = new FormData();
      form.append('nome', 'Laboratório Geologia');
      form.append('descricao', 'Laboratório para analise de residos geologicos');
      form.append('capacidade', 30);
      form.append('foto', fs.createReadStream('imgs/vikings-history-reprod.jpg')); 

      try {
        const resposta = await axios.post(url, form, {
          headers: {
            'Authorization': `Bearer ${token}`,
            ...form.getHeaders()
          }
        });

        expect(resposta.status).toBe(201);
        expect(resposta.data).toHaveProperty("_id");
      } catch (erro) {
        console.log('Erro na requisição:', erro.message);
      }
    });

  it("deve retornar erro ao tentar cadastrar um laboratório sem nome", async () => {
    const url = "http://localhost:5000/api/laboratorio/novo";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzcwMjUxNmU4YWI5ZTFlMDllZmI3NzciLCJpYXQiOjE3MzU0MTEyODF9.5k-sY3NZI7QuejN-uaedRC_kXNLNQNQQpQhCOYT6eAk";
    const form = new FormData();
    form.append("descricao", "Laboratório de Química");
    form.append("capacidade", 20);
    form.append("foto", fs.createReadStream("imgs/vikings-history-reprod.jpg"));
    try {
      await axios.post(url, form, {
        headers: { Authorization: `Bearer ${token}`, ...form.getHeaders() },
      });
    } catch (erro) {
      expect(erro.response.status).toBe(422);
      expect(erro.response.data).toHaveProperty(
        "message",
        "O campo de nome é obrigatório"
      );
    }
  });

  it("deve retornar erro ao tentar cadastrar um laboratório sem autenticação", async () => {
    const url = "http://localhost:5000/api/laboratorio/novo";
    const form = new FormData();
    form.append("nome", "Laboratório X");
    form.append("descricao", "Laboratório de Química");
    form.append("capacidade", 20);
    form.append("foto", fs.createReadStream("imgs/vikings-history-reprod.jpg"));
    try {
      await axios.post(url, form, { headers: { ...form.getHeaders() } });
    } catch (erro) {
      expect(erro.response.status).toBe(401);
      expect(erro.response.data).toHaveProperty(
        "message",
        "Sem token, autorização negada"
      );
    }
  });
});
