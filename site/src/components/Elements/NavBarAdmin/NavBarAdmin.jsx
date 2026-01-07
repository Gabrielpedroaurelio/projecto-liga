import { MdHome, MdHistory, MdStorage, MdSignLanguage, MdLogout, MdSettings, MdCategory } from 'react-icons/md'
import { FiShield } from "react-icons/fi";
import pessoa from '../../../assets/_images/people02.png';
import { FaUsers, FaMagnifyingGlass, FaStore } from 'react-icons/fa6'
import style from './NavBarAdmin.module.css'
import favicon from '../../../assets/_images/favicon.png'
import { Link } from 'react-router-dom'
import { useState } from "react"

import BoxMessage from '../../Elements/BoxMessage/BoxMessage'
export default function NavBarAdmin({ usuarioLogado = {
    "nome": "Gabriel Pedro Aurélio",
    "email": "gabrielpedroaurelio@gmail.com",
} }) {
    const [MenuExpandir, setMenuExpandir] = useState(false)
    const [toggleBoxMessage, settoggleBoxMessage] = useState(false)
    let Observador = MenuExpandir
    const Mudar = () => {
        if (Observador) {

            setMenuExpandir(false)
        } else {

            setMenuExpandir(true)
        }
    }
    return (
        <>
            {
                toggleBoxMessage ? (

                    <BoxMessage msm={'Tem certeza que deseja sair?'} setController={settoggleBoxMessage} />
                ) : (
                    <></>
                )
            }
            <div className={style.containerNavBarAdmin + ` ${MenuExpandir ? style.MenuLong : style.MenuShort} `}>
                <div className={style.logo}>
                    <img src={favicon} alt="" width="50" onClick={Mudar} />
                    <button className={style.btnExpandir} onClick={Mudar}> <FaMagnifyingGlass /> </button>


                </div>
                <div className={style.navBarAdmin}>
                    <nav className={style.navbar}>
                        <Link to="/admin/dashboards">
                            <span className="icon"><MdHome /></span>
                            <span className={style.txt}>Dashborad</span>
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
                            <span className={style.txt}>Historico</span>
                        </Link>
                        <Link to="/admin/history">
                            <span className="icon"><MdSettings /></span>
                            <span className={style.txt}>Definições</span>
                        </Link>
                        <Link to="/admin/account" className={style.btnUserAccount}>
                            <span className={style.icon}>
                                <img src={pessoa} alt="" width="20" /> </span>
                            <span className={style.txt}>
                                <span>{usuarioLogado.nome}</span>
                                <span>{usuarioLogado.email}</span>
                            </span>
                        </Link>
                        <Link to="/admin" onClick={() => settoggleBoxMessage((prev) => prev = !prev)}>
                            <span className="icon"><MdLogout /></span>
                            <span className={style.txt}>Sair</span>
                        </Link>
                    </nav>
                </div>

            </div>

        </>
    )
}
