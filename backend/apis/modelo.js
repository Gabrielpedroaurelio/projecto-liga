import pool from "../config/db.js"; // conexão com o banco PostgreSQL

// Criar um novo perfil
export async function createPerfil(req, res) {
  try {
    const { nome, descricao } = req.body;

    const result = await pool.query(
      "INSERT INTO perfil (nome, descricao) VALUES ($1, $2) RETURNING *",
      [nome, descricao]
    );

    res.status(201).json({
      mensagem: "Perfil criado com sucesso!",
      perfil: result.rows[0],
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Listar todos os perfis
export async function getPerfis(req, res) {
  try {
    const result = await pool.query("SELECT * FROM perfil ORDER BY id_perfil ASC");

    res.status(200).json({
      mensagem: "Perfis encontrados",
      perfis: result.rows,
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Atualizar um perfil existente
export async function updatePerfil(req, res) {
  try {
    const { id_perfil } = req.params;
    const { nome, descricao } = req.body;

    const result = await pool.query(
      "UPDATE perfil SET nome = $1, descricao = $2 WHERE id_perfil = $3 RETURNING *",
      [nome, descricao, id_perfil]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: "Perfil não encontrado." });
    }

    res.status(200).json({
      mensagem: "Perfil atualizado com sucesso!",
      perfil: result.rows[0],
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Deletar um perfil
export async function deletePerfil(req, res) {
  try {
    const { id_perfil } = req.params;

    const result = await pool.query("DELETE FROM perfil WHERE id_perfil = $1", [id_perfil]);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: "Perfil não encontrado." });
    }

    res.status(200).json({ mensagem: "Perfil deletado com sucesso!" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
