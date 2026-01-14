import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import style from './Histories.module.css'
import AbaHistoryAction from "../AbaHistoryAction/AbaHistoryAction";
import AbaHistoryLogin from "../AbaHistoryLogin/AbaHistoryLogin";
import { useState } from "react";
import { FaHistory, FaUserClock } from "react-icons/fa";

export default function Histories() {
    const [activeTab, setActiveTab] = useState('actions');

    return (
        <>
            <NavBarAdmin />
            <main className={style.containerHistory}>
                <div className={style.pageHeader}>
                    <h1>Histórico do Sistema</h1>
                    <p>Monitore as atividades e acessos dos usuários</p>
                </div>

                <div className={style.tabsContainer}>
                    <button 
                        className={`${style.tabBtn} ${activeTab === 'actions' ? style.active : ''}`}
                        onClick={() => setActiveTab('actions')}
                    >
                        <FaHistory />
                        <span>Ações de Usuários</span>
                    </button>
                    <button 
                        className={`${style.tabBtn} ${activeTab === 'logins' ? style.active : ''}`}
                        onClick={() => setActiveTab('logins')}
                    >
                        <FaUserClock />
                        <span>Logins e Sessões</span>
                    </button>
                </div>

                <div className={style.contentArea}>
                    {activeTab === 'actions' ? (
                        <AbaHistoryAction embedded={true} />
                    ) : (
                        <AbaHistoryLogin embedded={true} />
                    )}
                </div>
            </main>
        </>
    )
} 