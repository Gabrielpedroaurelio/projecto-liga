import pool from "../config/db.js";

// Criar novo sinal
export async function createSinal(req, res) {
  try {
    const {
      palavra_portugues,
      descricao_gesto,
      id_categoria,
      video_url,
      thumb_url,
      fonte,
      tags,
      url_modelo_3d,
      url_animacao
    } = req.body;

    const result = await pool.query(
      `INSERT INTO sinal
      (palavra_portugues, descricao_gesto, id_categoria, video_url, thumb_url, fonte, tags, url_modelo_3d, url_animacao)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [palavra_portugues, descricao_gesto, id_categoria, video_url, thumb_url, fonte, tags, url_modelo_3d, url_animacao]
    );

    return {
      sucesso: true,
      sinal: result.rows[0],
      status: 201
    };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}

// Listar todos os sinais
export async function getSinais(req, res) {
  try {
    const result = await pool.query(
      `SELECT s.*, c.categoria AS categoria_nome 
       FROM sinal s
       LEFT JOIN categoria c ON s.id_categoria = c.id_categoria
       ORDER BY s.id_sinal ASC`
    );

    return {
      sucesso: true,
      sinais: result.rows,
      status: 200
    }
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 }
  }
}

// Atualizar sinal
export async function updateSinal(req, res) {
  try {
    const { id_sinal } = req.params;
    const {
      palavra_portugues,
      descricao_gesto,
      id_categoria,
      video_url,
      thumb_url,
      fonte,
      tags,
      url_modelo_3d,
      url_animacao
    } = req.body;

    const result = await pool.query(
      `UPDATE sinal SET
        palavra_portugues=$1,
        descricao_gesto=$2,
        id_categoria=$3,
        video_url=$4,
        thumb_url=$5,
        fonte=$6,
        tags=$7,
        url_modelo_3d=$8,
        url_animacao=$9
       WHERE id_sinal=$10
       RETURNING *`,
      [palavra_portugues, descricao_gesto, id_categoria, video_url, thumb_url, fonte, tags, url_modelo_3d, url_animacao, id_sinal]
    );

    if (result.rowCount === 0) {
      return { sucesso: false, mensagem: "Sinal não encontrado", status: 404 };
    }

    return { sucesso: true, sinal: result.rows[0], status: 200 };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500, };
  }
}
// Deletar sinal
export async function deleteSinal(req, res) {
  try {
    const { id_sinal } = req.params;

    const result = await pool.query(
      "DELETE FROM sinal WHERE id_sinal=$1 RETURNING *",
      [id_sinal]
    );

    if (result.rowCount === 0) {
      return { sucesso: false, mensagem: "Sinal não encontrado", status: 404 };
    }

    return { sucesso: true, mensagem: "Sinal deletado com sucesso", status: 200 };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}
