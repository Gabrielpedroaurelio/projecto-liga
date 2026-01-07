import pool from "../config/db.js";

// Criar feedback
export async function createFeedback(req, res) {
  try {
    const { id_traducao, id_usuario, comentario, rating } = req.body;

    const result = await pool.query(
      `INSERT INTO feedback
       (id_traducao, id_usuario, comentario, rating)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [id_traducao, id_usuario, comentario, rating]
    );

    res.status(201).json({ sucesso: true, feedback: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Listar todos os feedbacks
export async function getFeedbacks(req, res) {
  try {
    const result = await pool.query(
      `SELECT f.*, u.nome_completo, t.entrada AS traducao
       FROM feedback f
       LEFT JOIN usuario u ON f.id_usuario = u.id_usuario
       LEFT JOIN traducao t ON f.id_traducao = t.id_traducao
       ORDER BY f.data_feedback DESC`
    );

    res.status(200).json({ sucesso: true, feedbacks: result.rows });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Atualizar feedback
export async function updateFeedback(req, res) {
  try {
    const { id_feedback } = req.params;
    const { comentario, rating } = req.body;

    const result = await pool.query(
      `UPDATE feedback
       SET comentario=$1, rating=$2
       WHERE id_feedback=$3
       RETURNING *`,
      [comentario, rating, id_feedback]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Feedback não encontrado" });
    }

    res.status(200).json({ sucesso: true, feedback: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Deletar feedback
export async function deleteFeedback(req, res) {
  try {
    const { id_feedback } = req.params;

    const result = await pool.query(
      `DELETE FROM feedback WHERE id_feedback=$1 RETURNING *`,
      [id_feedback]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Feedback não encontrado" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Feedback deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
