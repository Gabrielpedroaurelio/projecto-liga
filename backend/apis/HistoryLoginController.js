import pool from "../config/db.js";

// Adicionar registro de histórico
export async function addHistorico(req) {
  try {
    const { id_usuario,descricao } = req.body;

    const result = await pool.query(
      `INSERT INTO historico_login
      (id_usuario,data_hora_entrada, descricao)
      VALUES ($1,default,$3)
      RETURNING *`,
      [id_usuario,descricao]
    );

    return {sucesso: true, historico: result.rows[0],status:201 };
  } catch (erro) {
    return { sucesso: false, erro: erro.message,status:500 };
  }
}

// Adicionar registro de histórico
export async function LogoutHistorico(req) {
  try {
    const { id_usuario} = req.body;

    const result = await pool.query(
      `update historico_login set data_hora_saida=default where id_usuario= $1`,
      [id_usuario]
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
