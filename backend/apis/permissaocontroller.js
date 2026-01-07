import pool from "../config/db.js";

// Criar nova permissão
export async function createPermissao(req, res) {
  try {
    const { permissao, descricao } = req.body;

    const result = await pool.query(
      "INSERT INTO permissao (permissao, descricao) VALUES ($1, $2) RETURNING *",
      [permissao, descricao]
    );

    res.status(201).json({
      sucesso: true,
      permissao: result.rows[0],
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Listar todas as permissões
export async function getPermissoes(req, res) {
  try {
    const result = await pool.query("SELECT * FROM permissao ORDER BY id_permissao ASC");

    res.status(200).json({
      sucesso: true,
      permissoes: result.rows,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Atualizar permissão
export async function updatePermissao(req, res) {
  try {
    const { id_permissao } = req.params;
    const { permissao, descricao } = req.body;

    const result = await pool.query(
      "UPDATE permissao SET permissao=$1, descricao=$2 WHERE id_permissao=$3 RETURNING *",
      [permissao, descricao, id_permissao]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Permissão não encontrada" });
    }

    res.status(200).json({
      sucesso: true,
      permissao: result.rows[0],
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Deletar permissão
export async function deletePermissao(req, res) {
  try {
    const { id_permissao } = req.params;

    const result = await pool.query(
      "DELETE FROM permissao WHERE id_permissao=$1 RETURNING *",
      [id_permissao]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Permissão não encontrada" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Permissão deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
