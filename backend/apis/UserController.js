import Connection from '../config/connection.js';
import bcrypt from 'bcrypt';
const pool = Connection();

// Criar um novo usuário
export async function createUsuario(req) {
  let retorno = "sem retorno";
  try {
    const { nome_completo, email, telefone, senha_hash, id_perfil, path_img } = req.body;

    // Garante que a senha seja armazenada de forma segura
    const senhaCriptografada = await bcrypt.hash(senha_hash, 10);

    const result = await pool.query(
      `INSERT INTO usuario (nome_completo, email, telefone, senha_hash, id_perfil, status_usuario,path_img)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [nome_completo, email, telefone, senhaCriptografada, id_perfil, "Activo", path_img]
    );

    retorno = {
      sucesso: true,
      usuario: {
        id_usuario: result.rows[0].id_usuario,
        nome_completo: result.rows[0].nome_completo,
        email: result.rows[0].email,
        id_perfil: result.rows[0].id_perfil
      },
      msm: "Conta Criada com Sucesso!"
    };
  } catch (erro) {
    retorno = { sucesso: false, erro: erro.message };
  }
  return retorno;
}

// Listar todos os usuários
export async function getUsuarios(req, res) {
  let retorno = null;
  try {
    const result = await pool.query(
      'select *from usuario;'
    );
    retorno = {
      sucesso: true,
      usuario: result.rows,
      msm: "Usuarios Listados"
    };
    return retorno;

  } catch (erro) {

    return {
      erro_type: erro,
      msm: "Erro ao listar"
    };
  }
}

// Atualizar usuário
export async function updateUsuario(req) {
  try {
    const { id_usuario } = req.params;
    const {
      nome_completo,
      email,
      telefone,
      senha_hash,
      id_perfil,
      status_usuario,
      path_img,
      descricao,
    } = req.body;

    // Buscar usuário atual para manter dados não enviados
    const currentUserResult = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id_usuario]);
    if (currentUserResult.rows.length === 0) {
        return { status: 404, sucesso: false, mensagem: "Usuário não encontrado" };
    }
    const currentUser = currentUserResult.rows[0];

    // Lógica da senha: se enviou nova, hashea. Se não, mantém a antiga.
    let finalSenha = currentUser.senha_hash;
    if (senha_hash && senha_hash.trim() !== '') {
        // Se a senha já parece um hash (apenas precaução, embora raro vir do front assim), não re-hashea
        if (!senha_hash.startsWith('$2b$')) {
            finalSenha = await bcrypt.hash(senha_hash, 10);
        }
    }

    // Preparar valores (usando coalescência no JS para garantir que não mandamos undefined)
    const values = [
      nome_completo || currentUser.nome_completo,
      email || currentUser.email,
      telefone || currentUser.telefone,
      finalSenha,
      id_perfil || currentUser.id_perfil,
      status_usuario || currentUser.status_usuario,
      path_img || currentUser.path_img,
      descricao || currentUser.descricao,
      id_usuario
    ];

    const result = await pool.query(
      `UPDATE usuario SET
        nome_completo=$1,
        email=$2,
        telefone=$3,
        senha_hash=$4,
        id_perfil=$5,
        status_usuario=$6,
        path_img=$7,
        descricao=$8,
        atualizado_em=NOW()
        WHERE id_usuario=$9
        RETURNING *`,
      values
    );

    if (result.rowCount === 0) return { status: 502, sucesso: false, mensagem: "Usuário não encontrado" };

    return { sucesso: true, status: 200, usuario: result.rows[0] };
  } catch (erro) {
    return { sucesso: false, status: 500, erro: erro.message };
  }
}

// Não vai ser possivel Deletar Usuarios no Sistema ordem do Engenheiro Felino Deletar usuário
/*
export async function deleteUsuario(req, res) {
  try {
    const { id_usuario } = req.params;

    const result = await pool.query(
      "DELETE FROM usuario WHERE id_usuario=$1 RETURNING *",
      [id_usuario]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });

    res.status(200).json({ sucesso: true, mensagem: "Usuário deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
*/