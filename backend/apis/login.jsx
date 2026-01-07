import { useState } from "react";
import { loginRequest } from "../../services/AuthService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha_hash, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const response = await loginRequest("http://127.7.6.4:3000/auth/login", {
      email,
      senha_hash,
    });

    if (response.sucesso) {
      setMensagem("Login efetuado com sucesso!");
      window.location.href = "/dashboard";
    } else {
      setMensagem(response.mensagem || "Erro ao efetuar login");
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha_hash}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
