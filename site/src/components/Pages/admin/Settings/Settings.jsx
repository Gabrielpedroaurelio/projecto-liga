import { useState, useEffect } from 'react';
import NavBarAdmin from '../../../Elements/NavBarAdmin/NavBarAdmin';
import SideBarAdmin from '../../../Elements/SideBarAdmin/SideBarAdmin';
import style from './Settings.module.css';
import { systemService } from '../../../../services/appServices';
import { MdDownload, MdAdd, MdStorage } from 'react-icons/md';

export default function Settings() {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = async () => {
        try {
            const res = await systemService.listBackups();
            if (res.sucesso) {
                setBackups(res.backups);
            }
        } catch (error) {
            console.error("Erro ao carregar backups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        try {
            setCreating(true);
            const res = await systemService.createBackup();
            if (res.sucesso) {
                alert("Backup criado com sucesso!");
                loadBackups(); // Refresh list
            } else {
                alert("Erro: " + res.erro);
            }
        } catch (error) {
            console.error("Falha ao criar backup", error);
            alert("Erro ao criar backup: " + (error.message || "Erro desconhecido"));
        } finally {
            setCreating(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            // Trigger download via API using blob
            const blob = await systemService.downloadBackupFile(filename);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Erro no download:", error);
            alert("Erro ao baixar arquivo.");
        }
    };

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    return (
        <>
            <NavBarAdmin />
           
            <main className={style.container}>
                <div className={style.header}>
                    <h1>Cópias de Segurança</h1>
                    <p>Gerencie os backups do banco de dados.</p>
                </div>

                <div className={style.section}>
                    <div className={style.row} style={{marginBottom: '20px'}}>
                        <div>
                            <h2>Backups Disponíveis</h2>
                            <p style={{marginBottom: 0}}>Lista de pontos de restauração do sistema.</p>
                        </div>
                        <button 
                            className={style.btnPrimary} 
                            onClick={handleCreateBackup}
                            disabled={creating}
                        >
                            <MdAdd size={20} />
                            {creating ? "Criando..." : "Novo Backup"}
                        </button>
                    </div>

                    <div className={style.backupList}>
                        {loading ? (
                            <p>Carregando...</p>
                        ) : backups.length === 0 ? (
                            <div className={style.emptyState}>
                                <MdStorage size={48} color="var(--border-light)" />
                                <p>Nenhum backup encontrado.</p>
                            </div>
                        ) : (
                            <table className={style.table}>
                                <thead>
                                    <tr>
                                        <th>Arquivo</th>
                                        <th>Data</th>
                                        <th>Tamanho</th>
                                        <th style={{textAlign: 'right'}}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backups.map((backup) => (
                                        <tr key={backup.name}>
                                            <td>{backup.name}</td>
                                            <td>{new Date(backup.created_at).toLocaleString()}</td>
                                            <td>{formatBytes(backup.size)}</td>
                                            <td style={{textAlign: 'right'}}>
                                                <button 
                                                    className={style.btnIcon}
                                                    onClick={() => handleDownload(backup.name)}
                                                    title="Baixar"
                                                >
                                                    <MdDownload size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
