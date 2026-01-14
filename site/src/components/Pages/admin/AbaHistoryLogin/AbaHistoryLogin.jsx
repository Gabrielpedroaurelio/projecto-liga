import { FaMagnifyingGlass, FaArrowRightFromBracket, FaArrowRightToBracket } from "react-icons/fa6";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import style from './AbaHistoryLogin.module.css';
import pessoa from '../../../../assets/_images/people03.png';
import { useEffect, useState } from "react";
import { historyService } from "../../../../services/appServices";
import { GetURL } from "../../../../services/ModelServices";

export default function AbaHistoryLogin({ embedded = false }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const baseURL = GetURL();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        loadHistory();
    }, []);

    // Reset details when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    async function loadHistory() {
        try {
            const res = await historyService.getLogins();
            if (res && res.sucesso) {
                setHistory(res.historico || []);
            }
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = history.filter(item =>
        item.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    if (loading) {
        if (embedded) {
            return (
                <div className={style.loadingState}>
                    <span>Carregando histórico de logins...</span>
                </div>
            )
        }
        return (
            <>
                <NavBarAdmin />
                <main className={style.container}>
                    <div className={style.loadingState}>
                        <span>Carregando histórico de logins...</span>
                    </div>
                </main>
            </>
        );
    }

    const Content = () => (
        <>
            {!embedded && (
                <div className={style.header}>
                    <h1>Histórico de Logins</h1>
                </div>
            )}
            
            <div className={style.header} style={embedded ? { marginBottom: '24px' } : {}}>
                 <div className={style.barsearch}>
                    <FaMagnifyingGlass />
                    <input
                        type="text"
                        placeholder="Pesquisar por usuário ou email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className={style.historyList}>
                {currentItems.length > 0 ? (
                    <>
                        {currentItems.map((item) => (
                            <div key={item.id_historico_login} className={style.historyCard}>
                                <div className={style.userSection}>
                                    <div className={style.avatar}>
                                        <img
                                            src={item.path_img ? (item.path_img.startsWith('http') ? item.path_img : `${baseURL}${item.path_img}`) : pessoa}
                                            alt={item.nome_completo}
                                        />
                                    </div>
                                    <div className={style.userInfo}>
                                        <h3>{item.nome_completo || "Usuário Desconhecido"}</h3>
                                        <span className={style.email}>{item.email}</span>
                                        {item.ip_acesso && <span className={style.ip}>IP: {item.ip_acesso}</span>}
                                    </div>
                                </div>

                                <div className={style.deviceSection}>
                                    <div className={style.deviceInfo}>
                                        {item.dispositivo?.toLowerCase().includes('mobile') ?
                                            <FiSmartphone size={18} /> : <FiMonitor size={18} />
                                        }
                                        <span>{item.dispositivo || "Desktop"}</span>
                                    </div>
                                    <span className={style.browser}>{item.navegador || "Browser desconhecido"}</span>
                                </div>

                                <div className={style.sessionSection}>
                                    <div className={style.sessionTime}>
                                        <FaArrowRightToBracket />
                                        <div>
                                            <small>Entrada</small>
                                            <span>{new Date(item.data_hora_entrada).toLocaleString('pt-AO', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        </div>
                                    </div>
                                    <div className={`${style.sessionTime} ${!item.data_hora_saida ? style.active : ''}`}>
                                        <FaArrowRightFromBracket />
                                        <div>
                                            <small>Saída</small>
                                            <span>
                                                {item.data_hora_saida ?
                                                    new Date(item.data_hora_saida).toLocaleString('pt-AO', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) :
                                                    <span className={style.activeBadge}>Sessão Ativa</span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className={style.pagination}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={style.pageBtn}
                            >
                                Anterior
                            </button>
                            <span className={style.pageInfo}>
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={style.pageBtn}
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={style.emptyState}>
                        <span>Nenhum registro de login encontrado.</span>
                    </div>
                )}
            </div>
        </>
    );

    if (embedded) {
        return <Content />;
    }

    return (
        <>
            <NavBarAdmin />
            <main className={style.container}>
                <Content />
            </main>
        </>
    );
}