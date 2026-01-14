import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// Helper to get backups directory
const getBackupsDir = () => {
    const backupDir = path.resolve('backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    return backupDir;
};

// List all backups
export const getBackups = async (req, res) => {
    try {
        const backupDir = getBackupsDir();
        const files = fs.readdirSync(backupDir)
            .filter(file => file.endsWith('.sql'))
            .map(file => {
                const stats = fs.statSync(path.join(backupDir, file));
                return {
                    name: file,
                    size: stats.size,
                    created_at: stats.birthtime,
                };
            })
            // Sort by date desc
            .sort((a, b) => b.created_at - a.created_at);

        return res.json({ sucesso: true, backups: files });
    } catch (error) {
        console.error("Error listing backups:", error);
        return res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// Download a specific backup file
export const downloadBackupFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const backupDir = getBackupsDir();
        const filePath = path.join(backupDir, filename);

        // Security check: prevent directory traversal
        if (!path.relative(backupDir, filePath).startsWith('') || path.isAbsolute(filename) || filename.includes('..')) {
            return res.status(403).json({ sucesso: false, erro: "Acesso negado." });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ sucesso: false, erro: "Arquivo não encontrado." });
        }

        res.download(filePath, filename);
    } catch (error) {
        console.error("Error downloading backup:", error);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// Create a new backup
export const createBackup = async (req, res) => {
    try {
        const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `backup-liga-${date}.sql`;
        const backupDir = getBackupsDir();
        const dumpPath = path.join(backupDir, filename);

        const { DB_HOST, DB_USER, DB_NAME, DB_PASS, DB_PORT } = process.env;
        
        const host = DB_HOST || 'localhost';
        const user = DB_USER || 'postgres';
        const dbName = DB_NAME || 'liga';
        const password = DB_PASS || 'Aguinaldo';
        const port = DB_PORT || 5432;

        // Command
        const command = `pg_dump -h ${host} -p ${port} -U ${user} -d ${dbName} -f "${dumpPath}"`;

        console.log(`Starting backup: ${command}`);

        exec(command, { 
            env: { ...process.env, PGPASSWORD: password }
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Backup error: ${error.message}`);
                console.error(`Stderr: ${stderr}`);
                return res.status(500).json({ 
                    sucesso: false, 
                    erro: 'Erro ao gerar backup de dados',
                    detalhes: stderr || error.message
                });
            }
            
            // Backup created successfully
            // Return success with file info so frontend can add to list
            const stats = fs.statSync(dumpPath);
            return res.json({ 
                sucesso: true, 
                mensagem: "Backup criado com sucesso",
                backup: {
                    name: filename,
                    size: stats.size,
                    created_at: stats.birthtime
                }
            });
        });

    } catch (error) {
        console.error("Backup controller error:", error);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
