import pool from "../config/db.js";

// Criar nova empresa
export async function createInstituicao(req) {
  try {
    const {
      nome_instituicao,
      email_instituicao,
      provincia_instituicao,
      municipio_instituicao,
      bairro_instituicao,
      path_logo,
      telefone
    } = req.body;

    const localizacao = {
      provincia: provincia_instituicao,
      municipio: municipio_instituicao,
      bairro: bairro_instituicao
    };

    const result = await pool.query(
      "INSERT INTO instituicao (nome_instituicao, email_instituicao, localizacao, path_logo, telefone) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [nome_instituicao, email_instituicao, localizacao, path_logo, telefone]
    );

    return {
      sucesso: true,
      empresa: result.rows[0],
      status: 201,
      mensagem: "Instituição criada com sucesso",
    };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}


// Listar empresas
export async function getInstituicoes() {
  try {
    const result = await pool.query(
      'SELECT id_instituicao, nome_instituicao, email_instituicao, localizacao, path_logo, telefone FROM instituicao ORDER BY nome_instituicao'
    );

    // Mapear localizacao JSON para campos flat para facilitar no frontend
    const instituicoes = result.rows.map(row => ({
      ...row,
      provincia_instituicao: row.localizacao?.provincia || "",
      municipio_instituicao: row.localizacao?.municipio || "",
      bairro_instituicao: row.localizacao?.bairro || "",
    }));

    return {
      sucesso: true,
      instituicoes: instituicoes,
      status: 200,
      mensagem: "Instituições listadas com sucesso"
    };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}


// Atualizar empresa
export async function updateInstituicao(req) {
  try {
    const { id_instituicao } = req.params;
    const {
      nome_instituicao,
      email_instituicao,
      provincia_instituicao,
      municipio_instituicao,
      bairro_instituicao,
      path_logo,
      telefone
    } = req.body;

    const localizacao = {
      provincia: provincia_instituicao,
      municipio: municipio_instituicao,
      bairro: bairro_instituicao,
    };

    const result = await pool.query(
      `UPDATE instituicao SET
        nome_instituicao = COALESCE($1, nome_instituicao),
        email_instituicao = COALESCE($2, email_instituicao),
        localizacao = COALESCE($3, localizacao),
        path_logo = COALESCE($4, path_logo),
        telefone = COALESCE($5, telefone)
       WHERE id_instituicao = $6
       RETURNING *`,
      [nome_instituicao, email_instituicao, localizacao, path_logo, telefone, id_instituicao]
    );

    if (result.rowCount === 0) {
      return { sucesso: false, status: 404, mensagem: "Instituição não encontrada" };
    }

    return { sucesso: true, status: 200, empresa: result.rows[0] };
  } catch (erro) {
    return { sucesso: false, status: 500, erro: erro.message };
  }
}

// Deletar empresa
export async function deleteInstituicao(req) {
  try {
    const { id_instituicao } = req.params;

    const result = await pool.query(
      "DELETE FROM instituicao WHERE id_instituicao = $1 RETURNING *",
      [id_instituicao]
    );

    if (result.rowCount === 0) {
      return { sucesso: false, status: 404, mensagem: "Instituição não encontrada" };
    }

    return { sucesso: true, status: 200, mensagem: "Instituição deletada com sucesso" };
  } catch (erro) {
    return { sucesso: false, status: 500, erro: erro.message };
  }
}




