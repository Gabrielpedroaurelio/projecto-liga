import pool from "../config/db.js";

export async function getDashboardStats(req, res) {
    try {
        // Total de Usuários
        const usersCount = await pool.query("SELECT COUNT(*) FROM usuario");
        const activeUsers = await pool.query("SELECT COUNT(*) FROM usuario WHERE status_usuario = 'Activo'");

        // Total de Instituições
        const institutionsCount = await pool.query("SELECT COUNT(*) FROM empresa");

        // Total de Sinais
        const signalsCount = await pool.query("SELECT COUNT(*) FROM sinal");
        const newSignalsMonth = await pool.query("SELECT COUNT(*) FROM sinal WHERE criado_em >= NOW() - INTERVAL '1 month'");

        return {
            sucesso: true,
            stats: {
                totalUsuarios: parseInt(usersCount.rows[0].count),
                usuariosAtivos: parseInt(activeUsers.rows[0].count),
                totalEmpresas: parseInt(institutionsCount.rows[0].count),
                empresasAtivas: parseInt(institutionsCount.rows[0].count), // Simplificado por enquanto
                totalSinais: parseInt(signalsCount.rows[0].count),
                sinaisNovosMes: parseInt(newSignalsMonth.rows[0].count)
            },
            status: 200
        };
    } catch (erro) {
        return { sucesso: false, erro: erro.message, status: 500 };
    }
}
