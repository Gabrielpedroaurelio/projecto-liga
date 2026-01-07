import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logotipo from '../../../assets/_images/favicon.png';
import { loginRequest } from '../../../services/auth';
import { GetURL } from '../../../services/ModelServices';

const LoginAdminData = ({ style }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [loginemail, setLoginemail] = useState(null)
  const [loginsenha, setLoginSenha] = useState(null)
  const navigate = useNavigate();

  const obseverTitle = showTitle

  function ShowTitle() {
    if (obseverTitle) {
      setShowTitle(false)
    } else {

      setShowTitle(true)
    }

  }

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
      console.log(result);
      localStorage.setItem("authtoken",result.token)
      navigate("/admin/dashboards");
      console.log("Login successful:", result);

    } catch (error) {
      console.error(error);
      setErro("Erro inesperado ao autenticar. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className={style.form} onLoad={() => {


        ShowTitle()
      }}>
        <div className={style.cardImg}>
          <img src={logotipo} alt="" width="50" />
          <span className={`${showTitle ? style.titleLogo : ""}`}>Linguagem Gestual Angolana <hr />  <strong>LIGA</strong> </span>
        </div>
        <form action="" onSubmit={Login}>

          {erro && (
            <p className={style.errorMessage}>
              {erro}
            </p>
          )}

          <div className={style.controlerInput}>
            <input type="email" name="email" id="email" onChange={(e) =>
              setLoginemail((prev) => prev = e.target.value)
            } />
            <label htmlFor="email" className={`${loginemail ? style.valued : null}`}>E-mail:</label>
          </div>
          <div className={style.controlerInput}>
            <input type="password" name="password" id="password"
              onChange={(e) =>
                setLoginSenha((prev) => prev = e.target.value)
              } />
            <label htmlFor="password" className={`${loginsenha ? style.valued : null}`}>Senha:</label>
          </div>
          <div className={style.controlerInput}>
            <input type="submit" value={loading ? "Entrando..." : "Entrar"} disabled={loading} />
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
  )
}
export default LoginAdminData;