import { FaMagnifyingGlass, FaEye, FaLanguage, FaStar } from "react-icons/fa6";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import style from './AbaHistoryAction.module.css';
import { useEffect, useState } from "react";
import { historyService } from "../../../../services/appServices";

export default function AbaHistoryAction({ embedded = false }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadHistory();
    }, []);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    async function loadHistory() {
        try {
            const res = await historyService.getActions();
            if (res && res.sucesso) {
                setHistory(res.historico || []);
            }
        } catch (error) {
            console.error("Erro ao carregar histórico de ações:", error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = history.filter(item =>
        item.acao?.toLowerCase().includes(search.toLowerCase()) ||
        item.detalhes?.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const getActionIcon = (action) => {
        const actionLower = action?.toLowerCase() || '';
        if (actionLower.includes('visualiz')) return <FaEye />;
        if (actionLower.includes('traduz') || actionLower.includes('traduç')) return <FaLanguage />;
        if (actionLower.includes('edit') || actionLower.includes('atualiz')) return <MdEdit />;
        if (actionLower.includes('delet') || actionLower.includes('remov')) return <MdDelete />;
        if (actionLower.includes('cri') || actionLower.includes('adicion')) return <MdAdd />;
        if (actionLower.includes('avali') || actionLower.includes('feedback')) return <FaStar />;
        return <FaEye />;
    };

    const getActionColor = (action) => {
        const actionLower = action?.toLowerCase() || '';
        if (actionLower.includes('delet') || actionLower.includes('remov')) return style.danger;
        if (actionLower.includes('edit') || actionLower.includes('atualiz')) return style.warning;
        if (actionLower.includes('cri') || actionLower.includes('adicion')) return style.success;
        return style.info;
    };

    if (loading) {
        if (embedded) {
            return (
                <div className={style.loadingState}>
                    <span>Carregando histórico de ações...</span>
                </div>
            )
        }
        return (
            <>
                <NavBarAdmin />
                <main className={style.container}>
                    <div className={style.loadingState}>
                        <span>Carregando histórico de ações...</span>
                    </div>
                </main>
            </>
        );
    }

    const Content = () => (
        <>
            {!embedded && (
                <div className={style.header}>
                    <h1>Histórico de Ações</h1>
                </div>
            )}
            
            <div className={style.header} style={embedded ? { marginBottom: '24px' } : {}}>
                 <div className={style.barsearch}>
                    <FaMagnifyingGlass />
                    <input
                        type="text"
                        placeholder="Pesquisar ações..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className={style.timeline}>
                {currentItems.length > 0 ? (
                    <>
                        {currentItems.map((item) => (
                            <div key={item.id_historico} className={style.timelineItem}>
                                <div className={`${style.iconBadge} ${getActionColor(item.acao)}`}>
                                    {getActionIcon(item.acao)}
                                </div>
                                <div className={style.content}>
                                    <div className={style.actionHeader}>
                                        <h3>{item.acao}</h3>
                                        <span className={style.timestamp}>
                                            {new Date(item.data_accao).toLocaleString('pt-AO', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    {item.detalhes && (
                                        <p className={style.details}>{item.detalhes}</p>
                                    )}
                                    <div className={style.metadata}>
                                        {item.nome_usuario && (
                                            <span className={style.user}>👤 {item.nome_usuario}</span>
                                        )}
                                        {item.id_sinal && (
                                            <span className={style.reference}>🔗 Sinal #{item.id_sinal}</span>
                                        )}
                                        {item.id_traducao && (
                                            <span className={style.reference}>🔗 Tradução #{item.id_traducao}</span>
                                        )}
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
                        <span>Nenhuma ação registrada no sistema.</span>
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