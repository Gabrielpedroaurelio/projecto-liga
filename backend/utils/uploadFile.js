import multer from "multer";
import path from "path";
import fs from "fs";

// Função genérica de upload
export default function uploadFile(req, campo = "file", pasta) {
    return new Promise((resolve) => {
        // Cria pasta caso não exista
        if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

        // Configura armazenamento
        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, pasta),
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const nome = file.fieldname + "-" + Date.now() + ext;
                cb(null, nome);
            }
        });

        // Configura multer
        const upload = multer({
            storage,
            limits: { fileSize: 20 * 1024 * 1024 }, // Aumentado para 20MB para vídeos
            fileFilter: (req, file, cb) => {
                const tiposPermitidos = /jpeg|jpg|png|gif|mp4|avi|mov|glb|gltf/;
                const ext = path.extname(file.originalname).toLowerCase();
                const mimetype = file.mimetype;

                const isImage = /jpeg|jpg|png|gif/.test(ext);
                const isVideo = /mp4|avi|mov/.test(ext);
                const is3D = /glb|gltf/.test(ext);

                if (isImage || isVideo || is3D) return cb(null, true);
                cb(new Error("Formato de arquivo não permitido!"));
            }
        }).single(campo);

        // Executa upload
        upload(req, null, (err) => {
            if (err) resolve({ sucesso: false, erro: err.message });
            else if (!req.file) resolve({ sucesso: false, erro: "Nenhum arquivo enviado" });
            else {
                // Retorna um caminho relativo amigável (ex: /uploads/images/nome.png)
                // Remove './' ou 'uploads/' redundante se necessário
                const relativePath = req.file.path.replace(/\\/g, '/');
                resolve({
                    sucesso: true,
                    filename: req.file.filename,
                    path: `/${relativePath}`
                });
            }
        });
    });
}
