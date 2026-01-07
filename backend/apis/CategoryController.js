import pool from "../config/db.js";

// Criar nova categoria
export async function createCategoria(req) {
  try {
    const { categoria, descricao } = req.body;

    const result = await pool.query(
      "INSERT INTO categoria (categoria, descricao) VALUES ($1, $2) RETURNING *",
      [categoria, descricao]
    );

    return {
      sucesso: true,
      categoria: result.rows[0],
      status: 201
    }
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}

// Listar todas as categorias
export async function getCategorias(req, res) {
  try {
    const result = await pool.query("SELECT * FROM categoria ORDER BY categoria ASC");

    return {
      sucesso: true,
      categorias: result.rows,
      status: 201
    }
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 };
  }
}

// Atualizar categoria
export async function updateCategoria(req, res) {
  try {
    const { id_categoria } = req.params;
    const { categoria, descricao } = req.body;

    const result = await pool.query(
      "UPDATE categoria SET categoria=$1, descricao=$2 WHERE id_categoria=$3 RETURNING *",
      [categoria, descricao, id_categoria]
    );

    if (result.rowCount === 0) {
      return { sucesso: false, mensagem: "Categoria não encontrada", status: 404 };
    }

    return {
      sucesso: true,
      categoria: result.rows[0],
      status: 200
    }
  } catch (erro) {
    return { sucesso: false, erro: erro.message, status: 500 }
  }
}

// Deletar categoria
export async function deleteCategoria(req, res) {
  try {
    const { id_categoria } = req.params;

    const result = await pool.query(
      "DELETE FROM categoria WHERE id_categoria=$1 RETURNING *",
      [id_categoria]
    );

    if (result.rowCount === 0) {
      return{ sucesso: false, mensagem: "Categoria não encontrada",status:404 };
    }

    return { sucesso: true, mensagem: "Categoria deletada com sucesso",status:200 };
  } catch (erro) {
    return { sucesso: false, erro: erro.message,status:500 };
  }
}
