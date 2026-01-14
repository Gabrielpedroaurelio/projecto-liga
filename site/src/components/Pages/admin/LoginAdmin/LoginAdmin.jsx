import { useState, useEffect } from 'react';
import LoginAdminData from '../../../Elements/LoginAdminData/LoginAdminData'

import style from './LoginAdmin.module.css'

const LoginAdmin = () => {
    const [loginEffect, setLoginEffect] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        // Trigger animations on mount
        setShowLogin(true);
        const timer = setTimeout(() => {
            setLoginEffect(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={style.bodyLogin}>
            <div className={`${style.containerLogin} ${showLogin ? "showLogin" : ""} ${loginEffect ? style.LoginEffect : ""}`}>
                <LoginAdminData style={style} />
            </div>
        </div>
    )
}
export default LoginAdmin;