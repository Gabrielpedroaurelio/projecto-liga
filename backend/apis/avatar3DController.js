import pool from "../config/db.js";

// Criar novo avatar 3D
export async function createAvatar3D(req, res) {
  try {
    const { nome_avatar, url_modelo_3d, url_animacao, descricao } = req.body;

    const result = await pool.query(
      `INSERT INTO avatar_3d (nome_avatar, url_modelo_3d, url_animacao, descricao)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome_avatar, url_modelo_3d, url_animacao, descricao]
    );

    res.status(201).json({ sucesso: true, avatar: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Listar todos os avatars 3D
export async function getAvatars3D(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM avatar_3d ORDER BY id_avatar ASC"
    );

    res.status(200).json({ sucesso: true, avatars: result.rows });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Atualizar avatar 3D
export async function updateAvatar3D(req, res) {
  try {
    const { id_avatar } = req.params;
    const { nome_avatar, url_modelo_3d, url_animacao, descricao } = req.body;

    const result = await pool.query(
      `UPDATE avatar_3d
       SET nome_avatar=$1, url_modelo_3d=$2, url_animacao=$3, descricao=$4
       WHERE id_avatar=$5 RETURNING *`,
      [nome_avatar, url_modelo_3d, url_animacao, descricao, id_avatar]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Avatar não encontrado" });
    }

    res.status(200).json({ sucesso: true, avatar: result.rows[0] });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}

// Deletar avatar 3D
export async function deleteAvatar3D(req, res) {
  try {
    const { id_avatar } = req.params;

    const result = await pool.query(
      "DELETE FROM avatar_3d WHERE id_avatar=$1 RETURNING *",
      [id_avatar]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Avatar não encontrado" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Avatar deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
