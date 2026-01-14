import Connection from './config/connection.js';

const pool = Connection();

async function updateTable() {
    try {
        console.log("Iniciando atualização da tabela historico_login...");

        // Adicionar coluna ip_acesso com tipo específico para IP (INET)
        await pool.query(`
            ALTER TABLE historico_login 
            ADD COLUMN IF NOT EXISTS ip_acesso INET;
        `);
        console.log("Coluna ip_acesso verificada/adicionada como INET.");

        // Adicionar coluna dispositivo
        await pool.query(`
            ALTER TABLE historico_login 
            ADD COLUMN IF NOT EXISTS dispositivo VARCHAR(50);
        `);
        console.log("Coluna dispositivo verificada/adicionada.");

        // Adicionar coluna navegador
        await pool.query(`
            ALTER TABLE historico_login 
            ADD COLUMN IF NOT EXISTS navegador VARCHAR(50);
        `);
        console.log("Coluna navegador verificada/adicionada.");

        // Atualizar a View vw_historico_login para incluir os novos campos
        await pool.query(`
            CREATE OR REPLACE VIEW vw_historico_login AS
            SELECT 
                h.id_historico_login,
                h.id_usuario,
                u.nome_completo,
                u.email,
                u.path_img,
                h.data_hora_entrada,
                h.data_hora_saida,
                h.ip_acesso,
                h.dispositivo,
                h.navegador
            FROM historico_login h
            JOIN usuario u ON h.id_usuario = u.id_usuario
            ORDER BY h.data_hora_entrada DESC;
        `);
        console.log("View vw_historico_login atualizada com sucesso.");

        console.log("Tabela atualizada com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar tabela:", error);
    } finally {
        // Encerra a conexão
        await pool.end();
    }
}

updateTable();
