# Sistemas de Informação
![logoIF](https://github.com/user-attachments/assets/fffe6c6c-f0ad-4552-8d55-deee8dd6cede)

Atividade avaliativa apresentada a disciplina de Projeto de Sistemas Web II
---
## 📌Tópicos 

- [📝 Objetivo](#objetivo)
- [🤖 Funcionalidades](#funcionalidades)
- [⚙️ Ferramentas](#ferramentas)
- [🖥️ Como executar esse projeto](#comandos)
- [🗺️ Rotas no Vercel](#rotas)
- [🔎 Testes Automatizados](#testes)
- [👥 Equipe](#equipe)


## 📝 Objetivo <a id="objetivo"></a>

Este projeto consiste em uma API para gerenciamento de laboratórios, incluindo funcionalidades como criação de laboratórios com upload de fotos e geração de relatórios em formato PDF. O sistema utiliza autenticação JWT, middlewares personalizados e um controle de acesso baseado em dias da semana.

## 🤖 Funcionalidades <a id="funcionalidades"></a>

- Criar laboratórios com upload de fotos.
- Gerar relatórios de laboratórios em formato PDF.
- Autenticação de usuários com JWT.
- Controle de acesso baseado em dias da semana.
- Upload de imagens utilizando Multer.
- Testes automatizados para validar as funcionalidades.

---

## ⚙️ Ferramentas <a id="ferramentas"></a>
- **Node.js**: Plataforma de execução JavaScript no servidor.
- **Express**: Framework para construção de APIs REST.
- **MongoDB**: Banco de dados NoSQL.
- **JWT (Json Web Token)**: Para autenticação e controle de sessões.
- **Axios**: Cliente HTTP para requisições.

---

## 🖥️ Como executar esse projeto <a id="comandos"></a>
1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasLira24/projeto1-web2.git
   cd projeto1-web2
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e configure as variáveis:
   ```env
   PORT=5000
   MONGO_URI=mongodb:sua_uri_do_mongoDB
   JWT_SECRET=sua_chave_secreta
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. Acesse a API em: `http://localhost:5000`.

---

## 🗺️ Rotas no Vercel<a id="rotas"></a>
Autenticação:
https://projeto1-web2.vercel.app/api/logar

Gerar relatório:
https://projeto1-web2.vercel.app/api/laboratorio/relatorio

Criar laboratório:
https://projeto1-web2.vercel.app/api/laboratorio/novo

## 🔎 Testes Automatizados <a id="testes"></a>

### **Rodar Testes**
Execute os testes com o comando:
```bash
npm test
```

### **Cobertura dos Testes**
Relatorio: 
- Gerar relatório com sucesso
- Erro ao acessar rota de gerar relatório sem autenticação:
- Erro ao acessar rota de relatório em dias inválidos (Sábado ou Domingo)

Login:
- Login com credenciais válidas e inválidas.
- Erro ao tentar logar com e-mail inexistente
- Erro ao tentar logar com dados incompletos

Laboratórios:
- Cadastro de laboratório com sucesso
- Erro ao tentar cadastrar laboratório sem autenticação
- Erro ao tentar cadastrar laboratório sem nome


## 👥 Equipe <a id="equipe"></a>

* [Carlos Bertran](https://github.com/hell-if)
* [Lucas Lira](https://github.com/lucasLira24)
* [Mylena Soares](https://github.com/mylensoares)