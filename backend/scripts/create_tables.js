import Connection from '../config/connection.js';

const pool = Connection();

const createTables = async () => {
    try {
        console.log("Iniciando criação de tabelas...");

        // Tabela Permissao
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.permissao (
                id_permissao SERIAL PRIMARY KEY,
                permissao VARCHAR(100) NOT NULL UNIQUE,
                descricao TEXT
            );
        `);
        console.log("Tabela 'permissao' verificada/criada.");

        // Tabela Permissao_Usuario
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.permissao_usuario (
                id_permissao_usuario SERIAL PRIMARY KEY,
                id_usuario INTEGER REFERENCES public.usuario(id_usuario) ON DELETE CASCADE,
                id_permissao INTEGER REFERENCES public.permissao(id_permissao) ON DELETE CASCADE,
                UNIQUE(id_usuario, id_permissao)
            );
        `);
        console.log("Tabela 'permissao_usuario' verificada/criada.");

        // Seed básico de permissões se estiver vazio
        const count = await pool.query('SELECT COUNT(*) FROM permissao');
        if (parseInt(count.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO permissao (permissao, descricao) VALUES 
                ('ADMIN', 'Acesso total ao sistema'),
                ('GESTOR', 'Gerir conteúdos'),
                ('USUARIO', 'Acesso básico')
            `);
            console.log("Permissões iniciais inseridas.");
        }

        console.log("Sucesso!");
        process.exit(0);
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
        process.exit(1);
    }
};

createTables();
