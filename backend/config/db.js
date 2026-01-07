import Connection from "./connection.js";

// Wrapper simples para manter compatibilidade com arquivos que usam `import pool from "../config/db.js"`
const pool = Connection();

export default pool;



