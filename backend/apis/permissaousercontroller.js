import pool from "../config/db.js";

// Criar uma nova relação usuário-permissão
export async function createPermissaoUsuario(req, res) {
  try {
    const { id_usuario, id_permissao } = req.body;

    const result = await pool.query(
      "INSERT INTO permissao_usuario (id_usuario, id_permissao) VALUES ($1, $2) RETURNING *",
      [id_usuario, id_permissao]
    );

    res.status(201).json({
      sucesso: true,
      permissao_usuario: result.rows[0],
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Listar todas as relações usuário-permissão
export async function getPermissoesUsuarios(req, res) {
  try {
    const result = await pool.query(
      `SELECT pu.id_permissao_usuario, u.nome_completo, p.permissao
       FROM permissao_usuario pu
       JOIN usuario u ON pu.id_usuario = u.id_usuario
       JOIN permissao p ON pu.id_permissao = p.id_permissao
       ORDER BY pu.id_permissao_usuario ASC`
    );

    res.status(200).json({
      sucesso: true,
      permissoes_usuarios: result.rows,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Buscar permissões de um usuário específico
export async function getPermissoesDoUsuario(req, res) {
  try {
    const { id_usuario } = req.params;

    const result = await pool.query(
      `SELECT pu.id_permissao_usuario, pu.id_permissao, p.permissao, p.descricao
       FROM permissao_usuario pu
       JOIN permissao p ON pu.id_permissao = p.id_permissao
       WHERE pu.id_usuario = $1
       ORDER BY p.permissao ASC`,
      [id_usuario]
    );

    res.status(200).json({
      sucesso: true,
      permissoes: result.rows,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Atualizar relação usuário-permissão
export async function updatePermissaoUsuario(req, res) {
  try {
    const { id_permissao_usuario } = req.params;
    const { id_usuario, id_permissao } = req.body;

    const result = await pool.query(
      "UPDATE permissao_usuario SET id_usuario=$1, id_permissao=$2 WHERE id_permissao_usuario=$3 RETURNING *",
      [id_usuario, id_permissao, id_permissao_usuario]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Relação não encontrada" });
    }

    res.status(200).json({
      sucesso: true,
      permissao_usuario: result.rows[0],
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Deletar relação usuário-permissão
export async function deletePermissaoUsuario(req, res) {
  try {
    const { id_permissao_usuario } = req.params;

    const result = await pool.query(
      "DELETE FROM permissao_usuario WHERE id_permissao_usuario=$1 RETURNING *",
      [id_permissao_usuario]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Relação não encontrada" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Relação deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
