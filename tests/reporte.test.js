const axios = require("axios");
const fs = require("fs");

describe("GET /api/laboratorio/relatorio", () => {
  it("deve gerar um relatório em PDF", async () => {
    const url = "http://localhost:5000/api/laboratorio/relatorio";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzcwMjUxNmU4YWI5ZTFlMDllZmI3NzciLCJpYXQiOjE3MzU0MTEyODF9.5k-sY3NZI7QuejN-uaedRC_kXNLNQNQQpQhCOYT6eAk";

    const resposta = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "stream",
    });

    resposta.data.pipe(fs.createWriteStream("relatorio_laboratorio.pdf"));

    expect(resposta.status).toBe(200);
  });

  it("deve retornar erro ao tentar gerar relatório sem autenticação", async () => {
    const url = "http://localhost:5000/api/laboratorio/relatorio";
    try {
      await axios.get(url);
    } catch (erro) {
      //console.log("Erro na requisição:", erro.message);
      expect(erro.response.status).toBe(401);
      expect(erro.response.data).toHaveProperty(
        "message",
        "Sem token, autorização negada"
      );
    }
  });
});
