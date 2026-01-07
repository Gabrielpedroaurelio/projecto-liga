import pool from "../config/db.js";

// Criar relacionamento sinal-avatar
export async function createSinalAvatar(req, res) {
  try {
    const { id_sinal, id_avatar } = req.body;

    const result = await pool.query(
      `INSERT INTO sinal_avatar (id_sinal, id_avatar)
       VALUES ($1, $2) RETURNING *`,
      [id_sinal, id_avatar]
    );

    res.status(201).json({ sucesso: true, relacionamento: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Listar todos os relacionamentos sinal-avatar
export async function getSinaisAvatars(req, res) {
  try {
    const result = await pool.query(
      `SELECT sa.*, s.palavra_portugues AS sinal, a.nome_avatar AS avatar
       FROM sinal_avatar sa
       JOIN sinal s ON sa.id_sinal = s.id_sinal
       JOIN avatar_3d a ON sa.id_avatar = a.id_avatar
       ORDER BY sa.id_sinal, sa.id_avatar`
    );

    res.status(200).json({ sucesso: true, relacionamentos: result.rows });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Atualizar relacionamento sinal-avatar
export async function updateSinalAvatar(req, res) {
  try {
    const { id_sinal, id_avatar } = req.params;
    const { novo_id_sinal, novo_id_avatar } = req.body;

    const result = await pool.query(
      `UPDATE sinal_avatar
       SET id_sinal=$1, id_avatar=$2
       WHERE id_sinal=$3 AND id_avatar=$4
       RETURNING *`,
      [novo_id_sinal, novo_id_avatar, id_sinal, id_avatar]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Relacionamento não encontrado" });
    }

    res.status(200).json({ sucesso: true, relacionamento: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Deletar relacionamento sinal-avatar
export async function deleteSinalAvatar(req, res) {
  try {
    const { id_sinal, id_avatar } = req.params;

    const result = await pool.query(
      `DELETE FROM sinal_avatar
       WHERE id_sinal=$1 AND id_avatar=$2 RETURNING *`,
      [id_sinal, id_avatar]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Relacionamento não encontrado" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Relacionamento deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
