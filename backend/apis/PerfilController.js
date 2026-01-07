import Connection from '../config/connection.js'
const pool = Connection()

// Listar todos os usuários
export async function getPerfil(req, res) {
let retorno=null
  try {
    const result = await pool.query(
      'select * from perfil;'
    );
 retorno = {
      sucesso: true,
      perfis: result.rows,
      msm: "Perfis Listados"
    }
    return retorno

  } catch (erro) {

    return {
      erro_type:erro,

      msm:"Erro ao listar"

    }
  }
}
