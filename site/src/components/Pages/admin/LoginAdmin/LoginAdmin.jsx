import { useState } from 'react';
import LoginAdminData from '../../../Elements/LoginAdminData/LoginAdminData'

import style from './LoginAdmin.module.css'

const LoginAdmin = () => {
    const pages_anable = [
        <LoginAdminData style={style}></LoginAdminData>,

    ]
    const [LoginEffect, setLoginEffect] = useState(false);
    const LoginEffectFunction = () => {
        setLoginEffect(true)
    }
    const [showLogin, setShowLogin] = useState(false);

    const obseverLogin = showLogin
    function ShowLogin() {
        if (obseverLogin) {
            setShowLogin(false)
        } else {

            setShowLogin(true)
        }
    }
    return (
        <div className={style.bodyLogin   } onLoad={() => {
            ShowLogin()
            LoginEffectFunction()

             
        }}>
            <div className={style.containerLogin + `  ${showLogin ? "showLogin" : ""}` + ` ${LoginEffect ? style.LoginEffect : ""}`}>

                {pages_anable[0]}

            </div>
        </div >
    )
}
export default LoginAdmin;