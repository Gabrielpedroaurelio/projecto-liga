import pool from "../config/db.js";

// Criar nova instituição (empresa)
export async function createInstituicao(req) {
  try {
    const {
      nome_instituicao,
      email_instituicao,
      provincia_instituicao,
      municipio_instituicao,
      bairro_instituicao,
      file,
      telefone
    } = req.body;

    const
      localizacao =
      {
        provincia: provincia_instituicao,
        municipio: municipio_instituicao,
        bairro: bairro_instituicao
      };

    const result = await pool.query(
      "INSERT INTO instituicao (nome_instituicao, email_instituicao, localizacao, path_logo, telefone) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [nome_instituicao, email_instituicao, localizacao, file, telefone]
    );

    return {
      sucesso: true,
      instituicao: result.rows[0],
      status: 201,
      mensagem: "Instituição criada com sucesso",
    };
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}

// Listar instituições
export async function getInstituicoes() {
  let retorno = null;
  try {
    const result = await pool.query(
      'select *from vw_empresas;'
    );
    retorno = {
      sucesso: true,
      instituicoes: result.rows,
      msm: "Empresas Listados"
    };
    return retorno;

  } catch (erro) {

    return {
      erro_type: erro,
      msm: "Erro ao listar"
    };
  }
}

// Atualizar instituição
export async function updateInstituicao(req) {
  try {
    const { id_instituicao } = req.params;
    const {
      nome_instituicao,
      email_instituicao,
      provincia_instituicao,
      municipio_instituicao,
      bairro_instituicao,
      localizacao,
      file,
    } = req.body;

    const loc =
      localizacao ||
      {
        provincia: provincia_instituicao || null,
        municipio: municipio_instituicao || null,
        bairro: bairro_instituicao || null,
      };

    const result = await pool.query(
      `UPDATE instituicao SET
        nome_instituicao = COALESCE($1, nome_instituicao),
        email_instituicao = COALESCE($2, email_instituicao),
        localizacao = COALESCE($3, localizacao),
        path_logo = COALESCE($4, path_logo)
       WHERE id_instituicao = $5
       RETURNING *`,
      [nome_instituicao, email_instituicao, loc, file, id_instituicao]
    );

    if (result.rowCount === 0) {
      return { sucesso: false, status: 404, mensagem: "Instituição não encontrada" };
    }

    return { sucesso: true, status: 200, instituicao: result.rows[0] };
  } catch (erro) {
    return { sucesso: false, status: 500, erro: erro.message };
  }
}



