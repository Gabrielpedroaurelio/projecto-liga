import Connection from './config/connection.js';

const pool = Connection();

async function setupPermissions() {
    try {
        console.log("Iniciando configuração de permissões...");

        // 1. Criar tabela de permissões se não existir
        await pool.query(`
            CREATE TABLE IF NOT EXISTS permissao (
                id_permissao SERIAL PRIMARY KEY,
                permissao VARCHAR(150) NOT NULL,
                chave VARCHAR(100) NOT NULL UNIQUE,
                descricao TEXT
            );
        `);
        console.log("Tabela 'permissao' verificada/criada.");

        // 2. Criar tabela pivot perfil_permissao se não existir
        await pool.query(`
            CREATE TABLE IF NOT EXISTS perfil_permissao (
                id_perfil INTEGER REFERENCES perfil(id_perfil) ON DELETE CASCADE,
                id_permissao INTEGER REFERENCES permissao(id_permissao) ON DELETE CASCADE,
                PRIMARY KEY (id_perfil, id_permissao)
            );
        `);
        console.log("Tabela 'perfil_permissao' verificada/criada.");

        // 3. Definir recursos e ações para CRUD
        const recursos = [
            { key: 'usuario', label: 'Usuário' },
            { key: 'categoria', label: 'Categoria' },
            { key: 'sinal', label: 'Sinal' },
            { key: 'perfil', label: 'Perfil' },
            { key: 'traducao', label: 'Tradução' },
            { key: 'historico', label: 'Histórico' }
        ];

        const acoes = [
            { key: 'create', label: 'Criar' },
            { key: 'read', label: 'Ler' },
            { key: 'update', label: 'Atualizar' },
            { key: 'delete', label: 'Deletar' }
        ];

        // 4. Inserir permissões
        for (const recurso of recursos) {
            for (const acao of acoes) {
                // Exceções de lógica (se necessário):
                // Histórico geralmente é apenas leitura/criação automática, mas vamos criar CRUD completo por flexibilidade de admin
                
                const chave = `${recurso.key}_${acao.key}`;
                const nome = `${acao.label} ${recurso.label}`;
                const descricao = `Permite ${acao.label.toLowerCase()} registros na tabela ${recurso.label.toLowerCase()}`;

                await pool.query(`
                    INSERT INTO permissao (permissao, chave, descricao)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (chave) DO UPDATE 
                    SET permissao = EXCLUDED.permissao, descricao = EXCLUDED.descricao;
                `, [nome, chave, descricao]);
            }
        }
        
        console.log("Permissões CRUD cadastradas com sucesso!");

        // 5. (Opcional) Associar todas as permissões ao Super Administrador
        // Buscando ID do Super Admin
        const superAdminRes = await pool.query("SELECT id_perfil FROM perfil WHERE nome = 'Super Administrador'");
        
        if (superAdminRes.rows.length > 0) {
            const idSuperAdmin = superAdminRes.rows[0].id_perfil;
            
            // Pega todas permissões
            const todasPermissoes = await pool.query("SELECT id_permissao FROM permissao");
            
            for (const row of todasPermissoes.rows) {
                await pool.query(`
                    INSERT INTO perfil_permissao (id_perfil, id_permissao)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `, [idSuperAdmin, row.id_permissao]);
            }
            console.log("Todas as permissões atribuídas ao Super Administrador.");
        }

    } catch (error) {
        console.error("Erro ao configurar permissões:", error);
    } finally {
        process.exit(); // Encerra o processo
    }
}

setupPermissions();
