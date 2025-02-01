const axios = require("axios");

describe("POST /api/logar", () => {
  it("deve logar um usuário e retornar um token", async () => {
    const url = "http://localhost:5000/api/logar"; 
    try {
      const resposta = await axios.post(url, {
        email: "teste@teste.com",
        senha: "minhaSenha123", 
      });

      expect(resposta.status).toBe(200);
      expect(resposta.data).toHaveProperty("token"); 
    } catch (erro) {
      console.log("Erro na requisição:", erro.message); 
    }
  });

  it("deve retornar erro ao tentar logar com credenciais inválidas", async () => {
    const url = "http://localhost:5000/api/logar";
    try {
      await axios.post(url, {
        email: "teste@teste.com",
        senha: "senhaInvalida",
      });
    } catch (erro) {
      expect(erro.response.status).toBe(422);
      expect(erro.response.data).toHaveProperty(
        "message",
        "Usuário ou senha inválido"
      );
    }
  });

  it("deve retornar erro ao tentar logar com email não existente", async () => {
    const url = "http://localhost:5000/api/logar";
    try {
      await axios.post(url, {
        email: "naoexiste@teste.com",
        senha: "minhaSenha123",
      });
    } catch (erro) {
      expect(erro.response.status).toBe(422);
      expect(erro.response.data).toHaveProperty("message", "Usuário não encontrado");
    }
  });

  it("deve retornar erro ao tentar logar sem dados", async () => {
    const url = "http://localhost:5000/api/logar";
    try {
      await axios.post(url, {});
    } catch (erro) {
      expect(erro.response.status).toBe(422);
      expect(erro.response.data).toHaveProperty("message", "Usuário não encontrado");
    }
  });
});
