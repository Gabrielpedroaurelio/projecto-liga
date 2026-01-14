import pool from "../config/db.js";

export async function getDashboardStats(req, res) {
    try {
        const { range = '1y' } = req.query;

        // Total de Usuários
        const usersCount = await pool.query("SELECT COUNT(*) FROM usuario");
        const activeUsersCount = await pool.query("SELECT COUNT(*) FROM usuario WHERE status_usuario = 'Activo'");
        const inactiveUsersCount = await pool.query("SELECT COUNT(*) FROM usuario WHERE status_usuario = 'Inativo'");
        const bannedUsersCount = await pool.query("SELECT COUNT(*) FROM usuario WHERE status_usuario = 'Banido'");

        // Total de Instituições
        const institutionsCount = await pool.query("SELECT COUNT(*) FROM instituicao");

        // Total de Sinais
        const signalsCount = await pool.query("SELECT COUNT(*) FROM sinal");
        const newSignalsMonth = await pool.query("SELECT COUNT(*) FROM sinal WHERE data_registo >= NOW() - INTERVAL '1 month'");

        // Chart Data Query Logic
        let dateCondition = "INTERVAL '1 year'";
        let dateFormat = "Mon"; // Month name by default
        let groupBy = "month";
        
        switch(range) {
            case '7d':
                dateCondition = "INTERVAL '7 days'";
                dateFormat = "DD/MM"; // Day/Month
                groupBy = "day";
                break;
            case '30d':
                dateCondition = "INTERVAL '30 days'";
                dateFormat = "DD/MM";
                groupBy = "day";
                break;
            case '90d':
                dateCondition = "INTERVAL '90 days'";
                dateFormat = "DD/MM"; // Or Week? Day seems fine for 90 pts or maybe too many. Let's do Day default or Week. Day is 90 pts, might be crowded. Let's stick to simple day for now or Month if sparse. 
                // Actually 90 points is fine for a line chart.
                groupBy = "day";
                break;
            case '1y':
            default:
                dateCondition = "INTERVAL '1 year'";
                dateFormat = "Mon";
                groupBy = "month";
                break;
        }

        const signalsByTime = await pool.query(`
            SELECT 
                TO_CHAR(data_registo, '${dateFormat}') as label,
                COUNT(*) as total
            FROM sinal
            WHERE data_registo >= NOW() - ${dateCondition}
            GROUP BY TO_CHAR(data_registo, '${dateFormat}'), DATE_TRUNC('${groupBy}', data_registo)
            ORDER BY DATE_TRUNC('${groupBy}', data_registo) ASC
        `);

        return {
            sucesso: true,
            stats: {
                totalUsuarios: parseInt(usersCount.rows[0].count),
                usuariosAtivos: parseInt(activeUsersCount.rows[0].count),
                usuariosInativos: parseInt(inactiveUsersCount.rows[0].count),
                usuariosBanidos: parseInt(bannedUsersCount.rows[0].count),
                totalEmpresas: parseInt(institutionsCount.rows[0].count),
                empresasAtivas: parseInt(institutionsCount.rows[0].count),
                totalSinais: parseInt(signalsCount.rows[0].count),
                sinaisNovosMes: parseInt(newSignalsMonth.rows[0].count),
                chartSinais: {
                    labels: signalsByTime.rows.map(r => r.label),
                    data: signalsByTime.rows.map(r => parseInt(r.total))
                }
            },
            status: 200
        };
    } catch (erro) {
        return { sucesso: false, erro: erro.message, status: 500 };
    }
}
