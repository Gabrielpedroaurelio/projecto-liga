import pool from "../config/db.js";

// Criar nova tradução
export async function createTraducao(req, res) {
  try {
    const {
      id_usuario,
      entrada,
      resultado_texto,
      resultado_video_id,
      resultado_modelo_3d_id,
      tipo
    } = req.body;

    const result = await pool.query(
      `INSERT INTO traducao
      (id_usuario, entrada, resultado_texto, resultado_video_id, resultado_modelo_3d_id, tipo)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [id_usuario, entrada, resultado_texto, resultado_video_id, resultado_modelo_3d_id, tipo]
    );

return {
      sucesso: true,
      traducao: result.rows[0],
      status:200
    }
  } catch (erro) {
    return { sucesso: false, erro: erro.message,status:500, };
  }
}

// Listar todas as traduções
export async function getTraducao(req, res) {
  try {
    const result = await pool.query(
      `SELECT t.*, u.nome_completo, s.palavra_portugues AS sinal, a.nome AS avatar_3d
       FROM traducao t
       LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
       LEFT JOIN sinal s ON t.resultado_video_id = s.id_sinal
       LEFT JOIN avatar_3d a ON t.resultado_modelo_3d_id = a.id_avatar
       ORDER BY t.id_traducao ASC`
    );

    res.status(200).json({
      sucesso: true,
      traducoes: result.rows,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Atualizar tradução
export async function updateTraducao(req, res) {
  try {
    const { id_traducao } = req.params;
    const {
      id_usuario,
      entrada,
      resultado_texto,
      resultado_video_id,
      resultado_modelo_3d_id,
      tipo
    } = req.body;

    const result = await pool.query(
      `UPDATE traducao SET
        id_usuario=$1,
        entrada=$2,
        resultado_texto=$3,
        resultado_video_id=$4,
        resultado_modelo_3d_id=$5,
        tipo=$6
       WHERE id_traducao=$7
       RETURNING *`,
      [id_usuario, entrada, resultado_texto, resultado_video_id, resultado_modelo_3d_id, tipo, id_traducao]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Tradução não encontrada" });
    }

    res.status(200).json({ sucesso: true, traducao: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Deletar tradução
export async function deleteTraducao(req, res) {
  try {
    const { id_traducao } = req.params;

    const result = await pool.query(
      "DELETE FROM traducao WHERE id_traducao=$1 RETURNING *",
      [id_traducao]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Tradução não encontrada" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Tradução deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
