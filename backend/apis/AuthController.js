import Connection from '../config/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = Connection();
const SECRET_KEY = 'segredo_super_secreto'; // depois muda isso para variável de ambiente

// LOGIN
export async function login(req) {
  try {
    const { email, senha_hash } = req.body;

    const result = await pool.query(
      'SELECT * FROM usuario WHERE email=$1 LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return { sucesso: false, mensagem: 'Usuário não Encontrado' };
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha_hash, usuario.senha_hash);

    if (!senhaCorreta) {
      return { sucesso: false, mensagem: 'Senha Incorreta' };
    }

    // Gera token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    return {
      sucesso: true,
      mensagem: 'Login efetuado com sucesso!',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        telefone: usuario.telefone,
        id_perfil: usuario.id_perfil,
        status_usuario: usuario.status_usuario,
        path_img: usuario.path_img,
        descricao: usuario.descricao,
        criado_em: usuario.criado_em,
        atualizado_em: usuario.atualizado_em,
        ultimo_login: usuario.ultimo_login,
      },
    };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
}

// LOGOUT
export async function logout() {
  return { sucesso: true, mensagem: 'Logout efetuado com sucesso' };
}

// GET ME
export async function getMe(id_usuario) {
  try {
    const result = await pool.query(
      'SELECT id_usuario, nome_completo, email, telefone, id_perfil, status_usuario, path_img, descricao, criado_em, atualizado_em, ultimo_login FROM usuario WHERE id_usuario=$1 LIMIT 1',
      [id_usuario]
    );

    if (result.rows.length === 0) {
      return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }

    return {
      sucesso: true,
      usuario: result.rows[0],
    };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
}
