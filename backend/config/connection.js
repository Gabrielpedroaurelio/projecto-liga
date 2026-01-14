import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

export default function Connection() {
  let pool;
  try {
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'liga',
      password: process.env.DB_PASS || 'Aguinaldo',
      port: process.env.DB_PORT || 5432,
    });
    console.log("Conexão com PostgreSQL criada com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
  return pool;
}
// CREATE ROLE Gabriel WITH LOGIN SUPERUSER PASSWORD '20070404%@';
