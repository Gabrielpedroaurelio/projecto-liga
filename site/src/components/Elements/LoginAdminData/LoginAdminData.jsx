import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logotipo from '../../../assets/_images/favicon.png';
import { loginRequest } from '../../../services/auth';

const LoginAdminData = ({ style }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [loginemail, setLoginemail] = useState("");
  const [loginsenha, setLoginSenha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
        setShowTitle(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Codigo para o login
  async function Login(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const datas = new FormData(e.target);
      const email = datas.get("email");
      const senha = datas.get("password");

      // Usando o serviço padronizado que já sabe a URL
      const result = await loginRequest(null, {
        email,
        senha_hash: senha,
      });

      if (!result.sucesso) {
        setErro(result.mensagem || "Falha ao autenticar");
        return;
      }
      
      localStorage.setItem("authtoken", result.token);
      navigate("/admin/dashboards");
      
    } catch (error) {
      console.error(error);
      setErro("Erro inesperado ao autenticar. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={style.form}>
        <div className={style.cardImg}>
          <img src={logotipo} alt="Logo LIGA" />
          <div className={`${style.titleLogo}`}>
             <span>Linguagem Gestual Angolana</span>
             <strong>LIGA</strong>
          </div>
        </div>
        
        <form onSubmit={Login}>
          {erro && (
            <div className={style.errorMessage}>
              {erro}
            </div>
          )}

          <div className={style.controlerInput}>
            <label htmlFor="email">E-mail</label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                value={loginemail}
                onChange={(e) => setLoginemail(e.target.value)}
                required
            />
          </div>
          
          <div className={style.controlerInput}>
            <label htmlFor="password">Senha</label>
            <input 
                type="password" 
                name="password" 
                id="password"
                value={loginsenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                required
            />
          </div>
          
          <div className={style.controlerInput}>
            <input 
                type="submit" 
                value={loading ? "Verificando..." : "Entrar"} 
                disabled={loading} 
            />
          </div>
        </form>
      </div>
      
      <div className={style.info}>
        <div>
          <h1>Linguagem Gestual Angolana</h1>
          <p>
            Painel Administrativo
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginAdminData;