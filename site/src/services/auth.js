import { api } from './api';

export async function loginRequest(unused_url, data) {
  // Agora usamos o path relativo e o helper centralizado
  try {
    const result = await api.post("/auth/login", data);

    if (result && result.sucesso) {
      localStorage.setItem("token", result.token);
      // Removido o armazenamento do usuário no localStorage por segurança/sincronismo
    }
    return result;
  } catch (error) {
    console.error("Login Request Error:", error);
    return { sucesso: false, mensagem: error.message };
  }
}

export async function logoutRequest(id_usuario) {
  try {
    if (id_usuario) {
      // Envia o logout para o backend registrar no histórico
      await api.post("/auth/logout", { id_usuario });
    }
    localStorage.removeItem("token");
    return { sucesso: true };
  } catch (error) {
    console.error("Logout Request Error:", error);
    // Mesmo com erro, remove o token localmente
    localStorage.removeItem("token");
    return { sucesso: true };
  }
}

export async function getMe() {
  try {
    const result = await api.get("/auth/me");
    // Não salvamos mais no localStorage, o AuthContext cuidará disso na memória
    return result;
  } catch (error) {
    console.error("getMe Request Error:", error);
    return { sucesso: false, mensagem: error.message };
  }
}

export function getUsuarioLogado() {
  // Deprecado: Use useAuth().user do context
  return null;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}


