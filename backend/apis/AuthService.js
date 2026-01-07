export async function loginRequest(url, data) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    const result = await response.json();
  
    if (result.sucesso) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('usuario', JSON.stringify(result.usuario));
    }
  
    return result;
  }
  
  export function logoutRequest() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return { sucesso: true };
  }
  
  export function getUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
  
  export function getToken() {
    return localStorage.getItem('token');
  }
  