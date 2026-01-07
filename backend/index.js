// servidor.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createUsuario, getUsuarios, updateUsuario } from './apis/UserController.js';
import { getPerfil } from "./apis/PerfilController.js";
import uploadFile from './utils/uploadFile.js';
import { login as loginController, logout as logoutController, getMe as getMeController } from "./apis/AuthController.js";
import jwt from "jsonwebtoken";
import { createCategoria, getCategorias, updateCategoria, deleteCategoria } from "./apis/CategoryController.js";
import { createSinal, getSinais, updateSinal, deleteSinal } from "./apis/SignalController.js";
import { getHistorico as getHistoricoAcao } from "./apis/HistoryController.js";
import { getHistorico as getHistoricoLogin } from "./apis/HistoryLoginController.js";
import { createInstituicao, getInstituicoes, updateInstituicao } from "./apis/EnterpriseController.js";
import { createPermissao, getPermissoes, updatePermissao, deletePermissao } from "./apis/permissaocontroller.js";
import { createPermissaoUsuario, getPermissoesUsuarios, updatePermissaoUsuario, deletePermissaoUsuario } from "./apis/permissaousercontroller.js";
import { getDashboardStats } from "./apis/DashboardController.js";
dotenv.config(); // carrega as variáveis do .env

const host = "localhost"; // Mudado de 127.7.6.4 para localhost para evitar problemas de rede
const PORTA = process.env.PORT || 3400;

const servidor = express();

// Middleware para aceitar requisições
servidor.use(cors({
    origin: "*", // Permitir todas as origens durante desenvolvimento ou configurar "http://localhost:5173"
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

servidor.use(express.json()); // permite receber JSON no corpo das requisições
servidor.use('/uploads', express.static('uploads'));

// ===================== DASHBOARD =====================
servidor.get("/dashboard/stats", async (req, res) => {
    const resultado = await getDashboardStats(req, res);
    return res.status(resultado.status || 200).json(resultado);
});
const SECRET_KEY = process.env.JWT_SECRET || "segredo_super_secreto";

// Middleware para verificar token JWT nas rotas protegidas
function verificarToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ sucesso: false, mensagem: "Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
        return res.status(401).json({ sucesso: false, mensagem: "Token inválido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded;
        next();
    } catch (erro) {
        return res.status(401).json({ sucesso: false, mensagem: "Token expirado ou inválido" });
    }
}

// Rota de login
servidor.post("/auth/login", async (req, res) => {
    try {
        const resultado = await loginController(req);
        if (!resultado.sucesso) {
            return res.status(401).json(resultado);
        }
        return res.json(resultado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Rota de logout (apenas simbólica, já que o JWT é stateless)
servidor.post("/auth/logout", async (req, res) => {
    try {
        const resultado = await logoutController();
        return res.json(resultado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Rota para buscar dados do usuário logado
servidor.get("/auth/me", verificarToken, async (req, res) => {
    try {
        const resultado = await getMeController(req.usuario.id_usuario);
        if (!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        return res.json(resultado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

servidor.post("/upload", async (req, res) => {
    try {
        const resultado = await uploadFile(req, "file", "./uploads/images/");
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// ===================== PERFIL =====================
// rotas protegidas por autenticação
servidor.route("/perfil")
    .all(verificarToken)
    .get(async (req, res) => {
        try {
            const perfis = await getPerfil();
            res.json({ mensagem: "Listar os perfis", datas: perfis, sucesso: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ sucesso: false, erro: err.message });
        }
    })
// ===================== USUÁRIO =====================
servidor.route("/user")
    .all(verificarToken)
    .get(async (req, res) => {
        try {
            const usuarios = await getUsuarios();
            res.json({ mensagem: "Listar os usuários", user: usuarios });
        } catch (err) {
            console.error(err);
            res.status(500).json({ sucesso: false, erro: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const retorno = await createUsuario(req);
            res.json({
                mensagem: "Usuário criado com sucesso",
                dadosEnviados: req.body,
                dadosRetornados: retorno
            });
        } catch (erro) {
            res.status(500).json({ sucesso: false, erro: erro.message });
        }
    });

// Atualização de usuário (por id)
servidor.put("/user/:id_usuario", verificarToken, async (req, res) => {
    try {
        const resultado = await updateUsuario(req);
        if (!resultado.sucesso) {
            return res.status(resultado.status || 400).json(resultado);
        }
        return res.json(resultado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Exclusão de usuário (mantida simbólica, conforme comentário no controller)
servidor.delete("/user/:id_usuario", verificarToken, async (req, res) => {
    try {
        return res.status(405).json({ sucesso: false, mensagem: "Remoção de usuário não permitida" });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// ===================== EMPRESA (INSTITUIÇÃO) =====================
servidor.route("/enterprise")
    .all(verificarToken)
    .get(async (req, res) => {
        const resultado = await getInstituicoes();
        return res.status(resultado.status || 200).json(resultado);
    })
    .post(async (req, res) => {
        const resultado = await createInstituicao(req);
        return res.status(resultado.status || 201).json(resultado);
    });

servidor.put("/enterprise/:id_instituicao", verificarToken, async (req, res) => {
    const resultado = await updateInstituicao(req);
    return res.status(resultado.status || 200).json(resultado);
});

// ===================== HISTÓRICO (Ações) =====================
servidor.get("/history/actions", verificarToken, async (req, res) => {
    try {
        const resultado = await getHistoricoAcao(req, res);
        return res.status(resultado.status || 200).json(resultado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// ===================== HISTÓRICO (Logins) =====================
servidor.get("/history/logins", verificarToken, async (req, res) => {
    try {
        const resultado = await getHistoricoLogin(req, res);
        return res.status(resultado.status || 200).json(resultado);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// ===================== CATEGORIAS =====================
servidor.route("/categories")
    .all(verificarToken)
    .get(async (req, res) => {
        const resultado = await getCategorias(req, res);
        return res.status(resultado.status || 200).json(resultado);
    })
    .post(async (req, res) => {
        const resultado = await createCategoria(req, res);
        return res.status(resultado.status || 201).json(resultado);
    });

servidor.route("/categories/:id_categoria")
    .all(verificarToken)
    .put(async (req, res) => {
        const resultado = await updateCategoria(req, res);
        return res.status(resultado.status || 200).json(resultado);
    })
    .delete(async (req, res) => {
        const resultado = await deleteCategoria(req, res);
        return res.status(resultado.status || 200).json(resultado);
    });

// ===================== SINAIS =====================
servidor.route("/signals")
    .all(verificarToken)
    .get(async (req, res) => {
        const resultado = await getSinais(req, res);
        return res.status(resultado.status || 200).json(resultado);
    })
    .post(async (req, res) => {
        const resultado = await createSinal(req, res);
        return res.status(resultado.status || 201).json(resultado);
    });

servidor.route("/signals/:id_sinal")
    .all(verificarToken)
    .put(async (req, res) => {
        const resultado = await updateSinal(req, res);
        return res.status(resultado.status || 200).json(resultado);
    })
    .delete(async (req, res) => {
        const resultado = await deleteSinal(req, res);
        return res.status(resultado.status || 200).json(resultado);
    });

// ===================== PERMISSÕES =====================
servidor.route("/permissions")
    .all(verificarToken)
    .get((req, res) => getPermissoes(req, res))
    .post((req, res) => createPermissao(req, res));

servidor.route("/permissions/:id_permissao")
    .all(verificarToken)
    .put((req, res) => updatePermissao(req, res))
    .delete((req, res) => deletePermissao(req, res));

// Relação usuário-permissão
servidor.route("/permissions/user")
    .all(verificarToken)
    .get((req, res) => getPermissoesUsuarios(req, res))
    .post((req, res) => createPermissaoUsuario(req, res));

servidor.route("/permissions/user/:id_permissao_usuario")
    .all(verificarToken)
    .put((req, res) => updatePermissaoUsuario(req, res))
    .delete((req, res) => deletePermissaoUsuario(req, res));

// ===================== INICIAR SERVIDOR =====================
servidor.listen(PORTA, host, (erro) => {
    if (erro) console.log(erro);
    console.log(`Servidor rodando em http://${host}:${PORTA}`);
});
