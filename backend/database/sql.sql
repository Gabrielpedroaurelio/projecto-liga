-- Criação do banco de dados
CREATE DATABASE liga
WITH OWNER = postgres ENCODING = 'utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


-- Definição do tipo ENUM para status do usuário
CREATE TYPE status_usuario_type AS ENUM ('Activo', 'Inativo', 'Banido');



-- Tabela de perfis de usuários
CREATE TABLE perfil (
    id_perfil SERIAL PRIMARY KEY,        -- Identificador único do perfil
    nome VARCHAR(50) NOT NULL UNIQUE,     -- Nome do perfil (ex: "normal", "especial")
    descricao TEXT                       -- Descrição do perfil
);

-- Tabela de usuários
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,       -- Identificador único do usuário
    nome_completo VARCHAR(120) NOT NULL,  -- Nome completo do usuário
    email VARCHAR(100) NOT NULL UNIQUE,   -- Email único do usuário
    telefone VARCHAR(20),                 -- Número de telefone do usuário
    senha_hash VARCHAR(255) NOT NULL,      -- Senha criptografada do usuário (tamanho adequado)
    id_perfil INT REFERENCES perfil(id_perfil) ON DELETE SET NULL, -- Relacionamento com o perfil do usuário
    status_usuario status_usuario_type,  -- Usando o tipo ENUM para o status
    path_img TEXT,                        -- Caminho para a imagem do usuário
    descricao TEXT,                       -- Descrição do usuário
    criado_em TIMESTAMPTZ DEFAULT NOW(),  -- Data e hora de criação do perfil
    atualizado_em TIMESTAMPTZ DEFAULT NOW(), -- Data e hora da última atualização
    ultimo_login TIMESTAMPTZ DEFAULT NOW() -- Data e hora do último login
);
create table instituicao(
    id_instituicao serial primary key,
    nome_instituicao varchar(200),
    email_instituicao varchar(200),
    localizacao json,
    path_logo text null
    
);
-- ------------------------------------------------------------
-- TABELAS DE CATEGORIAS E SINAIS  
-- ------------------------------------------------------------

-- Tabela de categorias de sinais
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,     -- Identificador único da categoria
    categoria VARCHAR(100),              -- Nome da categoria (ex: "Saudações")
    descricao TEXT                       -- Descrição da categoria
);
create table permissao(
    id_permissao serial PRIMARY key,
    permissao varchar(20),
    descricao text
);
create table permissao_usuario(
    id_permissao_usuario serial primary key,
    id_usuario int REFERENCES usuario(id_usuario),
    id_permissao int REFERENCES permissao(id_permissao)
);
-- Tabela de sinais ou expressoes  de Angola
-- ESSA TABELA FAZ O PAPEL DE PALAVRAS COM OS SEUS SIGNIFICADOS
CREATE TABLE sinal (
    id_sinal SERIAL PRIMARY KEY,         -- Identificador único do sinal
    palavra_portugues VARCHAR(150) NOT NULL, -- Palavra em português associada ao sinal
    descricao_gesto TEXT,                -- Descrição do gesto (como o sinal é feito)
    id_categoria INT REFERENCES categoria(id_categoria) ON DELETE CASCADE, -- Relacionamento com a categoria
    video_url TEXT NOT NULL,             -- URL do vídeo do sinal
    thumb_url TEXT,                      -- URL da thumbnail do sinal
    id_instituicao int REFERENCES instituicao(id_instituicao),                 -- Fonte do sinal (ex: "Instituto XYZ")
    --tags TEXT[],                         -- Tags associadas ao sinal para facilitar a busca
    url_modelo_3d TEXT,                  -- URL do modelo 3D do sinal (caso tenha)
    url_animacao TEXT[],                 -- URLs das animações associadas ao sinal (caso tenha)
    data_registo TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Data e hora de registro do sinal
);


-- ------------------------------------------------------------
-- TABELAS DE AVATARES 3D E ANIMAÇÕES
-- ------------------------------------------------------------

-- Tabela de avatares 3D usados para representar sinais
CREATE TABLE avatar_3d (
    id_avatar SERIAL PRIMARY KEY,          -- Identificador único do avatar
    nome_avatar VARCHAR(100) NOT NULL,     -- Nome do avatar (ex: "Avatar Básico")
    url_modelo_3d TEXT NOT NULL,           -- URL do arquivo do modelo 3D
    url_animacao TEXT[],                   -- URLs das animações 3D (se o avatar tiver animações específicas)
    descricao TEXT,                        -- Descrição do avatar
    criado_em TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Data de criação do avatar
);
-- ------------------------------------------------------------
-- TABELAS DE TRADUÇÃO DE Angola
-- ------------------------------------------------------------

-- Tabela de traduções feitas pelos usuários
CREATE TABLE traducao (
    id_traducao SERIAL PRIMARY KEY,        -- Identificador único da tradução
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE, -- Relacionamento com o usuário que fez a tradução
    entrada TEXT NOT NULL,                 -- Texto de entrada para a tradução
    resultado_texto TEXT,                  -- Resultado da tradução em texto (caso necessário)
    resultado_video_id INT REFERENCES sinal(id_sinal),  -- ID do sinal associado (caso tenha vídeo)
    resultado_modelo_3d_id INT REFERENCES avatar_3d(id_avatar), -- ID do modelo 3D associado (caso tenha)
    tipo VARCHAR(30) CHECK(tipo IN ('texto-para_gesto', 'gesto-para_texto')), -- Tipo de tradução: texto -> gesto ou gesto -> texto
    data_hora TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Data e hora da tradução
);

-- Tabela de relacionamento entre sinais e avatares 3D
CREATE TABLE sinal_avatar (
    id_sinal INT REFERENCES sinal(id_sinal) ON DELETE CASCADE,  -- Relacionamento com o sinal
    id_avatar INT REFERENCES avatar_3d(id_avatar) ON DELETE CASCADE, -- Relacionamento com o avatar 3D
    PRIMARY KEY (id_sinal, id_avatar)  -- Chave primária composta para o relacionamento
);
 

-- Tabela de histórico de ações dos usuários (ex: tradução realizada, sinal visualizado)
CREATE TABLE historico (
    id_historico SERIAL PRIMARY KEY,           -- Identificador único do histórico
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL, -- Relacionamento com o usuário
    acao VARCHAR(100) NOT NULL,                -- Ação realizada (ex: "Traduzido", "Visualizado")
    detalhes TEXT,                             -- Detalhes adicionais sobre a ação
    id_traducao INT REFERENCES traducao(id_traducao), -- Relacionamento com a tradução (se aplicável)
    id_sinal INT REFERENCES sinal(id_sinal),   -- Relacionamento com o sinal (se aplicável)
    data_accao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Data e hora da ação
);

-- Tabela para armazenar feedback dos usuários sobre as traduções ou sinais
CREATE TABLE feedback (
    id_feedback SERIAL PRIMARY KEY,              -- Identificador único do feedback
    id_traducao INT REFERENCES traducao(id_traducao) ON DELETE CASCADE, -- Relacionamento com a tradução
    id_usuario INT REFERENCES usuario(id_usuario), -- Relacionamento com o usuário que deu o feedback
    comentario TEXT,                             -- Comentário sobre a tradução ou sinal
    rating INT CHECK(rating BETWEEN 1 AND 5),     -- Avaliação (nota de 1 a 5)
    data_feedback TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Data e hora do feedback
);
 

-- ------------------------------------------------------------
-- HISTÓRICO DE LOGIN
-- ------------------------------------------------------------

-- Tabela de histórico de logins dos usuários
CREATE TABLE historico_login (
    id_historico_login SERIAL PRIMARY KEY,       -- Identificador único do histórico de login
    id_usuario INT REFERENCES usuario(id_usuario), -- Relacionamento com o usuário
    data_hora_entrada TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Hora da entrada
    data_hora_saida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Hora da saída (pode ser nulo até o usuário sair)
);

-- ------------------------------------------------------------
-- ÍNDICES
-- ------------------------------------------------------------

-- Índices para melhorar a performance de busca
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_telefone ON usuario(telefone);
CREATE INDEX idx_sinal_categoria ON sinal(id_categoria);
CREATE INDEX idx_traducao_usuario ON traducao(id_usuario);

-- ------------------------------------------------------------
-- VIEWS
-- ------------------------------------------------------------

-- View para mostrar histórico de logins
CREATE VIEW vw_historico_login AS
SELECT historico_login.id_usuario, usuario.nome_completo, usuario.email,usuario.path_img, data_hora_entrada, data_hora_saida
FROM historico_login join usuario on historico_login.id_usuario=usuario.id_usuario;

-- View para mostrar todos os usuários
CREATE VIEW vw_all_usuario AS
SELECT id_usuario, nome_completo, email, status_usuario, telefone, criado_em,ultimo_login,atualizado_em, path_img,perfil.nome as type_user, usuario.descricao
FROM usuario join perfil on perfil.id_perfil=usuario.id_perfil;

-- View para mostrar o histórico de traduções de um usuário
CREATE VIEW vw_historico AS
SELECT id_traducao, entrada, resultado_texto, data_hora
FROM traducao;

-- View para mostrar todas as categorias e sinais
CREATE VIEW vw_categoria AS
SELECT categoria, COUNT(id_sinal) AS qtd_sinais
FROM categoria
 JOIN sinal ON categoria.id_categoria = sinal.id_categoria
GROUP BY categoria;

create or replace view vw_empresas as 
select id_instituicao as codigo_instituicao,
nome_instituicao , localizacao,
path_logo, telefone from instituicao order by nome_instituicao;