const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3400";

function buildHeaders(isJson = true) {
    const token = localStorage.getItem("token");
    const headers = isJson ? { "Content-Type": "application/json" } : {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function request(path, method = "GET", body = null, isJson = true) {
    const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const options = {
        method,
        headers: buildHeaders(isJson),
    };

    if (body) {
        options.body = isJson ? JSON.stringify(body) : body;
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            console.error(`API Error [${method}] ${url}:`, data);
            throw new Error(data.mensagem || data.erro || "Oops! Ocorreu um erro na requisição.");
        }

        return data;
    } catch (error) {
        console.error(`Network or Parsing Error:`, error);
        throw error;
    }
}

async function requestBlob(path) {
    const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = buildHeaders(true); // Sending token is important

    try {
        const response = await fetch(url, {
            method: "GET",
            headers
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.mensagem || data.erro || "Erro no download.");
        }

        return response.blob();
    } catch (error) {
        console.error("Download Error:", error);
        throw error;
    }
}

export const api = {
    get: (path) => request(path, "GET"),
    post: (path, body) => request(path, "POST", body),
    put: (path, body) => request(path, "PUT", body),
    delete: (path) => request(path, "DELETE"),
    upload: (path, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(path, "POST", formData, false);
    },
    download: (path) => requestBlob(path),
    baseUrl: BASE_URL
};
