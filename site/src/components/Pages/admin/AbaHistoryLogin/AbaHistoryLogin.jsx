import { FaMagnifyingGlass } from "react-icons/fa6"
import style from './AbaHistoryLogin.module.css'
import pessoa from '../../../../assets/_images/people03.png'
import { useEffect, useState } from "react";
import { historyService } from "../../../../services/appServices";

export default function AbaHistoryLogin() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    if (loading) return <div>Carregando histórico...</div>;

    return (
        <>
            <div className={style.TableHistoryLogin}>
                <h3>Historico De Logins</h3>

                <div className={style.TableBodyLogin}>
                    {history.length > 0 ? history.map((item) => (
                        <div key={item.id_historico_login}>
                            <div className={style.img}>
                                <img src={item.path_img || pessoa} alt="" />
                            </div>
                            <div className={style.userinfo}>
                                <span>{item.nome_completo || "Desconhecido"}</span>
                                <span>{item.email}</span>
                                <span>{item.ip_acesso || "---"}</span>
                            </div>
                            <div className={style.hostinfo}>
                                <strong>{item.dispositivo || "Desktop"}</strong>
                                <strong>{item.navegador || "Browser"}</strong>
                            </div>
                            <div className={style.sessioninfo}>
                                <span className={style.in}>
                                    Entrou: {new Date(item.data_login).toLocaleString()}
                                </span>
                                <span className={style.out}>
                                    {item.data_logout ? `Saíu: ${new Date(item.data_logout).toLocaleString()}` : "Sessão ativa"}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className={style.noData}>Nenhum registro de login encontrado.</div>
                    )}
                </div>
            </div>
        </>
    )
}