import pool from "../config/db.js";

// Adicionar registro de histórico
export async function addHistorico(req) {
  try {
    const { id_usuario, acao, detalhes, id_traducao, id_sinal } = req.body;

    const result = await pool.query(
      `INSERT INTO historico
      (id_usuario, acao, detalhes, id_traducao, id_sinal)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [id_usuario, acao, detalhes, id_traducao, id_sinal]
    );

    return {sucesso: true, historico: result.rows[0],status:201 };
  } catch (erro) {
    return { sucesso: false, erro: erro.message,status:500 };
  }
}

// Listar histórico
export async function getHistorico(req, res) {
  try {
    const result = await pool.query(
      `select *from vw_history;`
    );

    return { sucesso: true, historico: result.rows,status:200 };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status:500 };
  }
}
