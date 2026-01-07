import NavBarAdmin from '../../../Elements/NavBarAdmin/NavBarAdmin';
import { useNavigate } from 'react-router-dom';
// Ícones
import { FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

import style from './Account.module.css';
import { getUsuarioLogado, logoutRequest } from '../../../../services/auth';
import { Usuario } from '../../../models/Models';

export default function Account() {
  const navigate = useNavigate();

  const user = new Usuario(getUsuarioLogado)
  console.log(user);

  function handleLogout() {
    logoutRequest();
    navigate("/admin");
  }

  return (
    <>
      <NavBarAdmin />

      <div className={style.container}>
        <div className={style.profileCard}>
          <div className={style.header}>
            <div className={style.avatar}>
              {user.path_img ? (
                <img src={user.path_img} alt="Foto do usuário" />
              ) : (
                <FiUser size={40} className={style.avatarIcon} />
              )}
            </div>

            <div className={style.headerInfo}>
              <h2>{user.nome_completo}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          <div className={style.divider}></div>

          <div className={style.section}>
            <h3>Informações Pessoais</h3>

            <div className={style.infoLine}>
              <FiMail />
              <span>{user.email}</span>
            </div>

            <div className={style.infoLine}>
              <FiPhone />
              <span>{user.telefone}</span>
            </div>

            <div className={style.infoLine}>
              <FiMapPin />
              <span>
                {user.descricao}
              </span>
            </div>
          </div>
        
        </div>
      </div>
    </>
  );
}
