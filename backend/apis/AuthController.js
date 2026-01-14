import Connection from '../config/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = Connection();
const SECRET_KEY = 'segredo_super_secreto'; // depois muda isso para variável de ambiente

// Helper para identificar dispositivo e navegador
function getDeviceInfo(userAgent) {
  let navegador = 'Desconhecido';
  let dispositivo = 'Desktop';

  if (!userAgent) return { navegador, dispositivo };

  // Detecção simples de dispositivo (pode ser aprimorada)
  if (/mobile/i.test(userAgent)) {
    dispositivo = 'Mobile';
  } else if (/tablet/i.test(userAgent)) {
    dispositivo = 'Tablet';
  } else if (/ipad/i.test(userAgent)) {
    dispositivo = 'Tablet';
  }

  // Detecção simples de navegador
  if (/edg/i.test(userAgent)) {
    navegador = 'Edge';
  } else if (/opr\//i.test(userAgent)) {
    navegador = 'Opera';
  } else if (/chrome|crios/i.test(userAgent)) {
    navegador = 'Chrome';
  } else if (/firefox|fxios/i.test(userAgent)) {
    navegador = 'Firefox';
  } else if (/safari/i.test(userAgent)) {
    navegador = 'Safari';
  } else if (/msie|trident/i.test(userAgent)) {
    navegador = 'Internet Explorer';
  }

  return { navegador, dispositivo };
}

// LOGIN
export async function login(req) {
  try {
    const { email, senha_hash } = req.body;

    const result = await pool.query(
      `SELECT u.*, p.nome as nome_perfil 
       FROM usuario u 
       INNER JOIN perfil p ON u.id_perfil = p.id_perfil 
       WHERE u.email=$1 LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return { sucesso: false, mensagem: 'Usuário não Encontrado' };
    }

    const usuario = result.rows[0];

    // Verifica Status
    if (usuario.status_usuario !== 'Activo') {
      return { sucesso: false, mensagem: 'Conta inativa. Contate o administrador.' };
    }

    // Verifica Perfil (Apenas Admin e Super Admin)
    const perfisPermitidos = ['Administrador', 'Super Administrador'];
    if (!perfisPermitidos.includes(usuario.nome_perfil)) {
      return { sucesso: false, mensagem: 'Acesso restrito a administradores.' };
    }

    const senhaCorreta = await bcrypt.compare(senha_hash, usuario.senha_hash);

    if (!senhaCorreta) {
      return { sucesso: false, mensagem: 'Senha Incorreta' };
    }

    // Atualiza último login
    await pool.query(
      'UPDATE usuario SET ultimo_login = NOW() WHERE id_usuario = $1',
      [usuario.id_usuario]
    );

    // Dados do ambiente
    const userAgent = req.headers['user-agent'];
    const { navegador, dispositivo } = getDeviceInfo(userAgent);
    // Tenta pegar o IP de várias formas
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || req.ip;

    // Registra o login no histórico com detalhes
    await pool.query(
      'INSERT INTO historico_login (id_usuario, data_hora_entrada, ip_acesso, dispositivo, navegador) VALUES ($1, NOW(), $2, $3, $4)',
      [usuario.id_usuario, ip, dispositivo, navegador]
    );

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
        ultimo_login: new Date(),
      },
    };
  } catch (erro) {
    console.error("Erro no login:", erro);
    return { sucesso: false, erro: erro.message };
  }
}

// LOGOUT
export async function logout(req) {
  try {
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return { sucesso: false, mensagem: 'ID do usuário não fornecido' };
    }

    // Atualiza o último registro de login com a hora de saída
    await pool.query(
      `UPDATE historico_login 
       SET data_hora_saida = NOW() 
       WHERE id_usuario = $1 
       AND data_hora_saida IS NULL 
       ORDER BY data_hora_entrada DESC 
       LIMIT 1`,
      [id_usuario]
    );

    return { sucesso: true, mensagem: 'Logout efetuado com sucesso' };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
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
