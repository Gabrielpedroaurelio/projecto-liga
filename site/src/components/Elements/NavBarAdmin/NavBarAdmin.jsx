import { MdHome, MdHistory, MdStorage, MdSignLanguage, MdLogout, MdSettings, MdCategory, MdPerson, MdAssessment } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa6'
import style from './NavBarAdmin.module.css'
import favicon from '../../../assets/_images/favicon.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react"
import { useAuth } from '../../../contexts/AuthContext'
import { GetURL } from '../../../services/ModelServices'

import BoxMessage from '../../Elements/BoxMessage/BoxMessage'

export default function NavBarAdmin() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const URL = GetURL();

    const [MenuExpandir, setMenuExpandir] = useState(true)
    const [toggleBoxMessage, settoggleBoxMessage] = useState(false)

    const Mudar = () => {
        setMenuExpandir(!MenuExpandir);
    }

    const handleLogout = () => {
        logout();
        navigate('/admin');
    }

    return (
        <>
            {
                toggleBoxMessage && (
                    <BoxMessage
                        msm={'Tem certeza que deseja sair?'}
                        setController={settoggleBoxMessage}
                        onConfirm={handleLogout}
                    />
                )
            }
            <div className={style.containerNavBarAdmin + ` ${MenuExpandir ? style.MenuLong : style.MenuShort} `}>
                <div className={style.logo} onClick={Mudar}>
                    <img src={favicon} alt="Liga Logo" width="50" />
                    <span className={style.txt}>Project LIGA</span>
                </div>

                <div className={style.navBarAdmin}>
                    <div className={style.navContent}>
                        <nav className={style.navbar}>
                            <Link to="/admin/dashboards">
                                <span className="icon"><MdHome /></span>
                                <span className={style.txt}>Dashboard</span>
                            </Link>

                            <Link to="/admin/users" >
                                <span className="icon"><FaUsers /></span>
                                <span className={style.txt}>Usuários</span>
                            </Link>

                            <Link to="/admin/enterprise" >
                                <span className="icon"><MdStorage /></span>
                                <span className={style.txt}>Empresas</span>
                            </Link>

                            <Link to="/admin/categorias">
                                <span className="icon"><MdCategory /></span>
                                <span className={style.txt}>Categorias</span>
                            </Link>

                            <Link to="/admin/signals">
                                <span className="icon"><MdSignLanguage /></span>
                                <span className={style.txt}>Sinais</span>
                            </Link>

                            <Link to="/admin/history">
                                <span className="icon"><MdHistory /></span>
                                <span className={style.txt}>Histórico</span>
                            </Link>

                            <Link to="/admin/reports">
                                <span className="icon"><MdAssessment /></span>
                                <span className={style.txt}>Relatórios</span>
                            </Link>

                            <Link to="/admin/settings">
                                <span className="icon"><MdSettings /></span>
                                <span className={style.txt}>Definições</span>
                            </Link>
                        </nav>
                    </div>

                    <div className={style.navFooter}>
                        <Link to="/admin/account" className={style.btnUserAccount}>
                            <span className={style.icon}>
                                {user?.path_img ? (
                                    <img src={user.path_img.startsWith('http') ? user.path_img : `${URL}${user.path_img}`} alt="User Avatar" />
                                ) : (
                                    <MdPerson size={24} color="white" />
                                )}
                            </span>
                            <span className={style.txt}>
                                <span>{user?.nome_completo || 'Usuário'}</span>
                                <span>{user?.email || 'email@exemplo.com'}</span>
                            </span>
                        </Link>

                        <a href="#" className={style.btnLogout} onClick={(e) => { e.preventDefault(); settoggleBoxMessage(true); }}>
                            <span className="icon"><MdLogout /></span>
                            <span className={style.txt}>Sair</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
