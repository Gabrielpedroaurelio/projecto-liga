import Connection from './config/connection.js';

const pool = Connection();

async function seedProfiles() {
    try {
        const perfis = [
            { nome: 'Administrador', descricao: 'Acesso total ao sistema' },
            { nome: 'Super Administrador', descricao: 'Acesso total e configurações avançadas' },
            { nome: 'Cliente', descricao: 'Usuário padrão do sistema' }
        ];

        for (const perfil of perfis) {
            const check = await pool.query("SELECT * FROM perfil WHERE nome = $1", [perfil.nome]);
            if (check.rows.length === 0) {
                await pool.query(
                    "INSERT INTO perfil (nome, descricao) VALUES ($1, $2)",
                    [perfil.nome, perfil.descricao]
                );
                console.log(`Perfil criado: ${perfil.nome}`);
            } else {
                console.log(`Perfil já existe: ${perfil.nome}`);
            }
        }
    } catch (error) {
        console.error("Erro ao criar perfis:", error);
    } finally {
        // We do not close the pool here because in create_admin.js it calls process.exit()
        // But here we might want to close it properly if it was a real connection pool, 
        // however Connection() returns a pool according to common patterns. 
        // pg pool usually needs to be ended. 
        // Let's assume process.exit is fine as in the example.
        process.exit();
    }
}

seedProfiles();
