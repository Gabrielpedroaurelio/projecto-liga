import Connection from './config/connection.js';

const pool = Connection();

async function assignSpecificPermissions() {
    try {
        console.log("Atribuindo permissões específicas...");

        // 1. Obter IDs dos Perfis
        const perfisRes = await pool.query("SELECT id_perfil, nome FROM perfil");
        const perfis = {};
        perfisRes.rows.forEach(p => perfis[p.nome] = p.id_perfil);

        if (!perfis['Administrador'] || !perfis['Cliente']) {
            console.error("Perfis 'Administrador' ou 'Cliente' não encontrados. Rode 'seed_profiles.js' primeiro.");
            process.exit(1);
        }

        // 2. Definir regras (Quais permissões cada perfil deve ter)
        
        // REGRAS DO ADMINISTRADOR
        // Pode gerenciar conteúdo e usuários, mas não mexe na estrutura de perfis do sistema
        const adminKeys = [
            // Usuários
            'usuario_create', 'usuario_read', 'usuario_update', 'usuario_delete',  
            // Categorias
            'categoria_create', 'categoria_read', 'categoria_update', 'categoria_delete',
            // Sinais
            'sinal_create', 'sinal_read', 'sinal_update', 'sinal_delete',
            // Traduções (Gerenciamento)
            'traducao_read', 'traducao_delete',
            // Histórico (Audit)
            'historico_read', 
            // Perfis (Apenas visualizar para atribuir a usuários)
            'perfil_read' 
        ];

        // REGRAS DO CLIENTE
        // Usuário final: consome conteúdo e usa o tradutor
        const clienteKeys = [
            // Sinais (Apenas ver)
            'sinal_read',
            // Categorias (Apenas ver)
            'categoria_read',
            // Traduções (Criar novas e ver seu histórico)
            'traducao_create', 'traducao_read'
        ];

        // Função auxiliar para atribuir permissões a um perfil
        const atribuir = async (nomePerfil, idPerfil, keys) => {
            console.log(`\nProcessando perfil: ${nomePerfil}...`);
            
            // Buscar IDs das permissões baseadas nas chaves
            const keysPlaceholders = keys.map((_, i) => `$${i + 1}`).join(',');
            const permissoesRes = await pool.query(
                `SELECT id_permissao, chave FROM permissao WHERE chave IN (${keysPlaceholders})`,
                keys
            );

            if (permissoesRes.rows.length === 0) {
                console.log(`Nenhuma permissão encontrada para a lista fornecida.`);
                return;
            }

            for (const perm of permissoesRes.rows) {
                await pool.query(`
                    INSERT INTO perfil_permissao (id_perfil, id_permissao)
                    VALUES ($1, $2)
                    ON CONFLICT (id_perfil, id_permissao) DO NOTHING
                `, [idPerfil, perm.id_permissao]);
                // console.log(`   + Atribuída: ${perm.chave}`);
            }
            console.log(`   > Total de ${permissoesRes.rows.length} permissões atribuídas a ${nomePerfil}.`);
        };

        // 3. Executar atribuições
        await atribuir('Administrador', perfis['Administrador'], adminKeys);
        await atribuir('Cliente', perfis['Cliente'], clienteKeys);

        console.log("\nConfiguração de perfis específicos concluída com sucesso!");

    } catch (error) {
        console.error("Erro ao atribuir permissões:", error);
    } finally {
        process.exit();
    }
}

assignSpecificPermissions();
