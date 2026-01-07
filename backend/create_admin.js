import Connection from './config/connection.js';
import bcrypt from 'bcrypt';

const pool = Connection();

async function createAdmin() {
    try {
        const nome_completo = "Administrador";
        const email = "admin@liga.com";
        const senha_plain = "admin";

        // Hash the password
        const senha_hash = await bcrypt.hash(senha_plain, 10);

        // Check if user exists
        const check = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
        if (check.rows.length > 0) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        // Insert admin user
        // Assuming id_perfil 1 is for admin (based on typical setups, or NULL/default if not strictly enforced yet)
        // We insert "Activo" for status_usuario as per schema constraints
        const result = await pool.query(
            `INSERT INTO usuario (nome_completo, email, senha_hash, status_usuario, id_perfil)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [nome_completo, email, senha_hash, "Activo", 1]
        );

        console.log("Admin user created successfully:", result.rows[0]);
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        process.exit();
    }
}

createAdmin();
