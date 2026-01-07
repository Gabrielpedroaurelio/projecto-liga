import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let usuarios = []; // (substituir depois por banco PostgreSQL)

// Rota para cadastrar usuário
app.post("/api/usuarios", (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  const novoUsuario = { id: Date.now(), nome, email, senha, cargo };
  usuarios.push(novoUsuario);

  console.log("Usuário cadastrado:", novoUsuario);
  res.status(201).json({ message: "Usuário criado com sucesso", usuario: novoUsuario });
});

// Listar usuários
app.get("/api/usuarios", (req, res) => {
  res.json(usuarios);
});

app.listen(5000, () => console.log("✅ Servidor rodando em http://localhost:5000"));
