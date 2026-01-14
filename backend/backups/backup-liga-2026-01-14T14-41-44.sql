--
-- PostgreSQL database dump
--

\restrict HxK1xqQdcaDbSPcvatvi7Cnb5AUlxtd9kgjYhB9WbaDDrFGjFhZLx8BNbdjAMsP

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: status_usuario_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_usuario_type AS ENUM (
    'Activo',
    'Inativo',
    'Banido'
);


ALTER TYPE public.status_usuario_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avatar_3d; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avatar_3d (
    id_avatar integer NOT NULL,
    nome_avatar character varying(100) NOT NULL,
    url_modelo_3d text NOT NULL,
    url_animacao text[],
    descricao text,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.avatar_3d OWNER TO postgres;

--
-- Name: avatar_3d_id_avatar_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avatar_3d_id_avatar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avatar_3d_id_avatar_seq OWNER TO postgres;

--
-- Name: avatar_3d_id_avatar_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avatar_3d_id_avatar_seq OWNED BY public.avatar_3d.id_avatar;


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    id_categoria integer NOT NULL,
    categoria character varying(100),
    descricao text
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_categoria_seq OWNER TO postgres;

--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_categoria_seq OWNED BY public.categoria.id_categoria;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id_feedback integer NOT NULL,
    id_traducao integer,
    id_usuario integer,
    comentario text,
    rating integer,
    data_feedback timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_id_feedback_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_id_feedback_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_feedback_seq OWNER TO postgres;

--
-- Name: feedback_id_feedback_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_feedback_seq OWNED BY public.feedback.id_feedback;


--
-- Name: historico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historico (
    id_historico integer NOT NULL,
    id_usuario integer,
    acao character varying(100) NOT NULL,
    detalhes text,
    id_traducao integer,
    id_sinal integer,
    data_accao timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historico OWNER TO postgres;

--
-- Name: historico_id_historico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historico_id_historico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historico_id_historico_seq OWNER TO postgres;

--
-- Name: historico_id_historico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historico_id_historico_seq OWNED BY public.historico.id_historico;


--
-- Name: historico_login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historico_login (
    id_historico_login integer NOT NULL,
    id_usuario integer,
    data_hora_entrada timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_hora_saida timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ip_acesso inet,
    dispositivo character varying(50),
    navegador character varying(50)
);


ALTER TABLE public.historico_login OWNER TO postgres;

--
-- Name: historico_login_id_historico_login_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historico_login_id_historico_login_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historico_login_id_historico_login_seq OWNER TO postgres;

--
-- Name: historico_login_id_historico_login_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historico_login_id_historico_login_seq OWNED BY public.historico_login.id_historico_login;


--
-- Name: instituicao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instituicao (
    id_instituicao integer NOT NULL,
    nome_instituicao character varying(200),
    email_instituicao character varying(200),
    localizacao json,
    path_logo text,
    telefone character varying(20)
);


ALTER TABLE public.instituicao OWNER TO postgres;

--
-- Name: instituicao_id_instituicao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instituicao_id_instituicao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instituicao_id_instituicao_seq OWNER TO postgres;

--
-- Name: instituicao_id_instituicao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instituicao_id_instituicao_seq OWNED BY public.instituicao.id_instituicao;


--
-- Name: perfil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil (
    id_perfil integer NOT NULL,
    nome character varying(50) NOT NULL,
    descricao text
);


ALTER TABLE public.perfil OWNER TO postgres;

--
-- Name: perfil_id_perfil_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfil_id_perfil_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfil_id_perfil_seq OWNER TO postgres;

--
-- Name: perfil_id_perfil_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfil_id_perfil_seq OWNED BY public.perfil.id_perfil;


--
-- Name: perfil_permissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil_permissao (
    id_perfil integer NOT NULL,
    id_permissao integer NOT NULL
);


ALTER TABLE public.perfil_permissao OWNER TO postgres;

--
-- Name: permissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissao (
    id_permissao integer NOT NULL,
    permissao character varying(20),
    descricao text,
    chave character varying(100) NOT NULL
);


ALTER TABLE public.permissao OWNER TO postgres;

--
-- Name: permissao_id_permissao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissao_id_permissao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissao_id_permissao_seq OWNER TO postgres;

--
-- Name: permissao_id_permissao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissao_id_permissao_seq OWNED BY public.permissao.id_permissao;


--
-- Name: permissao_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissao_usuario (
    id_permissao_usuario integer NOT NULL,
    id_usuario integer,
    id_permissao integer
);


ALTER TABLE public.permissao_usuario OWNER TO postgres;

--
-- Name: permissao_usuario_id_permissao_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissao_usuario_id_permissao_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissao_usuario_id_permissao_usuario_seq OWNER TO postgres;

--
-- Name: permissao_usuario_id_permissao_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissao_usuario_id_permissao_usuario_seq OWNED BY public.permissao_usuario.id_permissao_usuario;


--
-- Name: sinal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sinal (
    id_sinal integer NOT NULL,
    palavra_portugues character varying(150) NOT NULL,
    descricao_gesto text,
    id_categoria integer,
    video_url text NOT NULL,
    thumb_url text,
    id_instituicao integer,
    url_modelo_3d text,
    url_animacao text[],
    data_registo timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fonte character varying(200),
    tags text[]
);


ALTER TABLE public.sinal OWNER TO postgres;

--
-- Name: sinal_avatar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sinal_avatar (
    id_sinal integer NOT NULL,
    id_avatar integer NOT NULL
);


ALTER TABLE public.sinal_avatar OWNER TO postgres;

--
-- Name: sinal_id_sinal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sinal_id_sinal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sinal_id_sinal_seq OWNER TO postgres;

--
-- Name: sinal_id_sinal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sinal_id_sinal_seq OWNED BY public.sinal.id_sinal;


--
-- Name: traducao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.traducao (
    id_traducao integer NOT NULL,
    id_usuario integer,
    entrada text NOT NULL,
    resultado_texto text,
    resultado_video_id integer,
    resultado_modelo_3d_id integer,
    tipo character varying(30),
    data_hora timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT traducao_tipo_check CHECK (((tipo)::text = ANY (ARRAY[('texto-para_gesto'::character varying)::text, ('gesto-para_texto'::character varying)::text])))
);


ALTER TABLE public.traducao OWNER TO postgres;

--
-- Name: traducao_id_traducao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.traducao_id_traducao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.traducao_id_traducao_seq OWNER TO postgres;

--
-- Name: traducao_id_traducao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.traducao_id_traducao_seq OWNED BY public.traducao.id_traducao;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nome_completo character varying(120) NOT NULL,
    email character varying(100) NOT NULL,
    telefone character varying(20),
    senha_hash character varying(255) NOT NULL,
    id_perfil integer,
    status_usuario public.status_usuario_type,
    path_img text,
    descricao text,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now(),
    ultimo_login timestamp with time zone DEFAULT now()
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: vw_empresas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_empresas AS
 SELECT id_instituicao AS codigo_instituicao,
    nome_instituicao,
    localizacao,
    path_logo,
    telefone
   FROM public.instituicao
  ORDER BY nome_instituicao;


ALTER VIEW public.vw_empresas OWNER TO postgres;

--
-- Name: vw_historico_login; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_historico_login AS
 SELECT h.id_historico_login,
    h.id_usuario,
    u.nome_completo,
    u.email,
    u.path_img,
    h.data_hora_entrada,
    h.data_hora_saida,
    h.ip_acesso,
    h.dispositivo,
    h.navegador
   FROM (public.historico_login h
     JOIN public.usuario u ON ((h.id_usuario = u.id_usuario)))
  ORDER BY h.data_hora_entrada DESC;


ALTER VIEW public.vw_historico_login OWNER TO postgres;

--
-- Name: avatar_3d id_avatar; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_3d ALTER COLUMN id_avatar SET DEFAULT nextval('public.avatar_3d_id_avatar_seq'::regclass);


--
-- Name: categoria id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);


--
-- Name: feedback id_feedback; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id_feedback SET DEFAULT nextval('public.feedback_id_feedback_seq'::regclass);


--
-- Name: historico id_historico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico ALTER COLUMN id_historico SET DEFAULT nextval('public.historico_id_historico_seq'::regclass);


--
-- Name: historico_login id_historico_login; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico_login ALTER COLUMN id_historico_login SET DEFAULT nextval('public.historico_login_id_historico_login_seq'::regclass);


--
-- Name: instituicao id_instituicao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituicao ALTER COLUMN id_instituicao SET DEFAULT nextval('public.instituicao_id_instituicao_seq'::regclass);


--
-- Name: perfil id_perfil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil ALTER COLUMN id_perfil SET DEFAULT nextval('public.perfil_id_perfil_seq'::regclass);


--
-- Name: permissao id_permissao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao ALTER COLUMN id_permissao SET DEFAULT nextval('public.permissao_id_permissao_seq'::regclass);


--
-- Name: permissao_usuario id_permissao_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao_usuario ALTER COLUMN id_permissao_usuario SET DEFAULT nextval('public.permissao_usuario_id_permissao_usuario_seq'::regclass);


--
-- Name: sinal id_sinal; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal ALTER COLUMN id_sinal SET DEFAULT nextval('public.sinal_id_sinal_seq'::regclass);


--
-- Name: traducao id_traducao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao ALTER COLUMN id_traducao SET DEFAULT nextval('public.traducao_id_traducao_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Data for Name: avatar_3d; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avatar_3d (id_avatar, nome_avatar, url_modelo_3d, url_animacao, descricao, criado_em) FROM stdin;
\.


--
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id_categoria, categoria, descricao) FROM stdin;
3	Saudação	htrete
4	Comida	alguma descricao
5	Alfabeto	Todas letras no nosso idioma
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id_feedback, id_traducao, id_usuario, comentario, rating, data_feedback) FROM stdin;
\.


--
-- Data for Name: historico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historico (id_historico, id_usuario, acao, detalhes, id_traducao, id_sinal, data_accao) FROM stdin;
\.


--
-- Data for Name: historico_login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historico_login (id_historico_login, id_usuario, data_hora_entrada, data_hora_saida, ip_acesso, dispositivo, navegador) FROM stdin;
1	18	2026-01-14 12:23:00.637945+01	2026-01-14 12:23:00.637945+01	\N	\N	\N
2	18	2026-01-14 14:09:52.566272+01	2026-01-14 14:09:52.566272+01	\N	\N	\N
3	18	2026-01-14 14:15:15.61925+01	2026-01-14 14:15:15.61925+01	\N	\N	\N
4	18	2026-01-14 14:23:09.739729+01	2026-01-14 14:23:09.739729+01	\N	\N	\N
5	18	2026-01-14 14:38:56.532888+01	2026-01-14 14:38:56.532888+01	::1	Desktop	Edge
\.


--
-- Data for Name: instituicao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instituicao (id_instituicao, nome_instituicao, email_instituicao, localizacao, path_logo, telefone) FROM stdin;
12	ANSA	ansa@gmail.com	{"provincia":"Luanda","municipio":"Talatona","bairro":"Vidrul"}	{"0":{}}	94324324
13	InovaServer	inovaserver@gmail.com	{"provincia":"Luanda","municipio":"Cacuaco","bairro":"Vidrul"}	/uploads/images/file-1768215894376.jpeg	932423
15	Connexion	connexion@gmail.com	{"provincia":"Luanda","municipio":"CAcucao","bairro":"fdsf"}	/uploads/images/file-1768222212065.jpeg	4324
16	Empresa 01	empresa01@gmail.com	{"provincia":"Luanda","municipio":"Cacuaco","bairro":"Vidrul"}	uploads/images/file-1768231254007.jpeg	93243244
\.


--
-- Data for Name: perfil; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil (id_perfil, nome, descricao) FROM stdin;
3	Administrador	Acesso total ao sistema
4	Super Administrador	Acesso total e configurações avançadas
5	Cliente	Usuário padrão do sistema
\.


--
-- Data for Name: perfil_permissao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil_permissao (id_perfil, id_permissao) FROM stdin;
\.


--
-- Data for Name: permissao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissao (id_permissao, permissao, descricao, chave) FROM stdin;
4	Criar Usuário	Permite criar registros na tabela usuário	usuario_create
5	Ler Usuário	Permite ler registros na tabela usuário	usuario_read
6	Atualizar Usuário	Permite atualizar registros na tabela usuário	usuario_update
7	Deletar Usuário	Permite deletar registros na tabela usuário	usuario_delete
8	Criar Categoria	Permite criar registros na tabela categoria	categoria_create
9	Ler Categoria	Permite ler registros na tabela categoria	categoria_read
10	Atualizar Categoria	Permite atualizar registros na tabela categoria	categoria_update
11	Deletar Categoria	Permite deletar registros na tabela categoria	categoria_delete
12	Criar Sinal	Permite criar registros na tabela sinal	sinal_create
13	Ler Sinal	Permite ler registros na tabela sinal	sinal_read
14	Atualizar Sinal	Permite atualizar registros na tabela sinal	sinal_update
15	Deletar Sinal	Permite deletar registros na tabela sinal	sinal_delete
16	Criar Perfil	Permite criar registros na tabela perfil	perfil_create
17	Ler Perfil	Permite ler registros na tabela perfil	perfil_read
18	Atualizar Perfil	Permite atualizar registros na tabela perfil	perfil_update
19	Deletar Perfil	Permite deletar registros na tabela perfil	perfil_delete
20	Criar Tradução	Permite criar registros na tabela tradução	traducao_create
21	Ler Tradução	Permite ler registros na tabela tradução	traducao_read
22	Atualizar Tradução	Permite atualizar registros na tabela tradução	traducao_update
23	Deletar Tradução	Permite deletar registros na tabela tradução	traducao_delete
24	Criar Histórico	Permite criar registros na tabela histórico	historico_create
25	Ler Histórico	Permite ler registros na tabela histórico	historico_read
26	Atualizar Histórico	Permite atualizar registros na tabela histórico	historico_update
27	Deletar Histórico	Permite deletar registros na tabela histórico	historico_delete
\.


--
-- Data for Name: permissao_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissao_usuario (id_permissao_usuario, id_usuario, id_permissao) FROM stdin;
1	14	1
2	14	2
3	14	3
4	51	4
5	18	14
6	19	4
7	14	4
\.


--
-- Data for Name: sinal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sinal (id_sinal, palavra_portugues, descricao_gesto, id_categoria, video_url, thumb_url, id_instituicao, url_modelo_3d, url_animacao, data_registo, fonte, tags) FROM stdin;
10	A	1ª letra do alfabeto	5	uploads/images/file-1768398436610.mp4	uploads/images/file-1768398464479.jpeg	\N	uploads/images/file-1768398467644.glb	\N	2026-01-14 14:48:00.273231+01	\N	\N
\.


--
-- Data for Name: sinal_avatar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sinal_avatar (id_sinal, id_avatar) FROM stdin;
\.


--
-- Data for Name: traducao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.traducao (id_traducao, id_usuario, entrada, resultado_texto, resultado_video_id, resultado_modelo_3d_id, tipo, data_hora) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nome_completo, email, telefone, senha_hash, id_perfil, status_usuario, path_img, descricao, criado_em, atualizado_em, ultimo_login) FROM stdin;
14	Felino	felinodomingos@gmail.com	9324324324	$2b$10$YMt2OtUhaoxy1TWvK90HSulCYYLi8ZMma1lOp4gPwybj/z4GWUesq	2	Activo	\N	\N	2025-12-01 20:56:45.545545+01	2025-12-01 20:56:45.545545+01	2025-12-01 20:56:45.545545+01
17	Teste1	testes@gmail.com	123456789	$2b$10$ivk3og8D2AX1fD4LciSU8urP/oj2Z2yHm0OF3xRyRakOghGnIjeUS	1	Activo	\N	\N	2025-12-18 00:23:18.577039+01	2025-12-18 00:23:18.577039+01	2025-12-18 00:23:18.577039+01
19	teste01	teste01@liga.com	223423432	$2b$10$bnsHb1Bw3XJ0q5g7kjW7bejxEuk14zkEVO5w.VKy7IxH5dJ2nInv6	1	Activo	\N	\N	2026-01-05 15:08:20.146083+01	2026-01-05 15:08:20.146083+01	2026-01-05 15:08:20.146083+01
51	Aguinaldo	aguinaldo@gmail.com	987654321	$2b$10$OFnt19SNlO64Nq3PYbXkz.8t6LJwuIZaszbX5uTPJ6nuImUAVG8IS	3	Activo	/uploads/images/file-1768222106736.JPG	\N	2026-01-12 13:48:27.069188+01	2026-01-12 13:48:27.069188+01	2026-01-12 13:48:27.069188+01
13	Aguinaldo Arnaldo	amarndoarnaldo234@gmail.com	223423432	$2b$10$9pZIUA8CP9mzI9E/fHqqAOvXZixDi340WerClsaXhQjzKpn3iid0i	1	Inativo	..\\uploads\\images\\file-1764441740579.JPG	\N	2025-11-29 19:42:21.780257+01	2026-01-12 14:20:58.225624+01	2025-11-29 19:42:21.780257+01
18	Administrador	admin@liga.com	946464376 	$2b$10$6mqn6dZ0267YU7Vf3RuhZ.h7lznn3G8VtgpoXxAGgPs5PQNhkkv6O	4	Activo	uploads/images/file-1768399653822.gif	Administrador gerarl	2026-01-05 15:03:32.014008+01	2026-01-14 15:07:34.265998+01	2026-01-14 14:38:56.524597+01
16	Gabriel	gabriel@gmail.com	93334324	$2b$10$NdW2Jl85KVk9ZL6hgioGj.Te4Id4lU4mMY5tAzeNW/1MRQuBbPJ5e	1	Banido	\N	\N	2025-12-01 23:13:28.903291+01	2026-01-14 15:37:37.639262+01	2025-12-01 23:13:28.903291+01
\.


--
-- Name: avatar_3d_id_avatar_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avatar_3d_id_avatar_seq', 1, false);


--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_categoria_seq', 5, true);


--
-- Name: feedback_id_feedback_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_feedback_seq', 1, false);


--
-- Name: historico_id_historico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historico_id_historico_seq', 1, false);


--
-- Name: historico_login_id_historico_login_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historico_login_id_historico_login_seq', 5, true);


--
-- Name: instituicao_id_instituicao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instituicao_id_instituicao_seq', 16, true);


--
-- Name: perfil_id_perfil_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfil_id_perfil_seq', 5, true);


--
-- Name: permissao_id_permissao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissao_id_permissao_seq', 27, true);


--
-- Name: permissao_usuario_id_permissao_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissao_usuario_id_permissao_usuario_seq', 7, true);


--
-- Name: sinal_id_sinal_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sinal_id_sinal_seq', 10, true);


--
-- Name: traducao_id_traducao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.traducao_id_traducao_seq', 1, false);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 54, true);


--
-- Name: avatar_3d avatar_3d_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_3d
    ADD CONSTRAINT avatar_3d_pkey PRIMARY KEY (id_avatar);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id_feedback);


--
-- Name: historico_login historico_login_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico_login
    ADD CONSTRAINT historico_login_pkey PRIMARY KEY (id_historico_login);


--
-- Name: historico historico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_pkey PRIMARY KEY (id_historico);


--
-- Name: instituicao instituicao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituicao
    ADD CONSTRAINT instituicao_pkey PRIMARY KEY (id_instituicao);


--
-- Name: perfil perfil_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_nome_key UNIQUE (nome);


--
-- Name: perfil_permissao perfil_permissao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_permissao
    ADD CONSTRAINT perfil_permissao_pkey PRIMARY KEY (id_perfil, id_permissao);


--
-- Name: perfil perfil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_pkey PRIMARY KEY (id_perfil);


--
-- Name: permissao permissao_chave_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT permissao_chave_key UNIQUE (chave);


--
-- Name: permissao permissao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT permissao_pkey PRIMARY KEY (id_permissao);


--
-- Name: permissao_usuario permissao_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao_usuario
    ADD CONSTRAINT permissao_usuario_pkey PRIMARY KEY (id_permissao_usuario);


--
-- Name: sinal_avatar sinal_avatar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal_avatar
    ADD CONSTRAINT sinal_avatar_pkey PRIMARY KEY (id_sinal, id_avatar);


--
-- Name: sinal sinal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal
    ADD CONSTRAINT sinal_pkey PRIMARY KEY (id_sinal);


--
-- Name: traducao traducao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao
    ADD CONSTRAINT traducao_pkey PRIMARY KEY (id_traducao);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: idx_sinal_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sinal_categoria ON public.sinal USING btree (id_categoria);


--
-- Name: idx_traducao_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_traducao_usuario ON public.traducao USING btree (id_usuario);


--
-- Name: idx_usuario_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_email ON public.usuario USING btree (email);


--
-- Name: idx_usuario_telefone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_telefone ON public.usuario USING btree (telefone);


--
-- Name: feedback feedback_id_traducao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_id_traducao_fkey FOREIGN KEY (id_traducao) REFERENCES public.traducao(id_traducao) ON DELETE CASCADE;


--
-- Name: feedback feedback_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: historico historico_id_sinal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_sinal_fkey FOREIGN KEY (id_sinal) REFERENCES public.sinal(id_sinal);


--
-- Name: historico historico_id_traducao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_traducao_fkey FOREIGN KEY (id_traducao) REFERENCES public.traducao(id_traducao);


--
-- Name: historico historico_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- Name: historico_login historico_login_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico_login
    ADD CONSTRAINT historico_login_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: perfil_permissao perfil_permissao_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_permissao
    ADD CONSTRAINT perfil_permissao_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil) ON DELETE CASCADE;


--
-- Name: perfil_permissao perfil_permissao_id_permissao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_permissao
    ADD CONSTRAINT perfil_permissao_id_permissao_fkey FOREIGN KEY (id_permissao) REFERENCES public.permissao(id_permissao) ON DELETE CASCADE;


--
-- Name: permissao_usuario permissao_usuario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao_usuario
    ADD CONSTRAINT permissao_usuario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: sinal_avatar sinal_avatar_id_avatar_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal_avatar
    ADD CONSTRAINT sinal_avatar_id_avatar_fkey FOREIGN KEY (id_avatar) REFERENCES public.avatar_3d(id_avatar) ON DELETE CASCADE;


--
-- Name: sinal_avatar sinal_avatar_id_sinal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal_avatar
    ADD CONSTRAINT sinal_avatar_id_sinal_fkey FOREIGN KEY (id_sinal) REFERENCES public.sinal(id_sinal) ON DELETE CASCADE;


--
-- Name: sinal sinal_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal
    ADD CONSTRAINT sinal_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria) ON DELETE CASCADE;


--
-- Name: sinal sinal_id_instituicao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal
    ADD CONSTRAINT sinal_id_instituicao_fkey FOREIGN KEY (id_instituicao) REFERENCES public.instituicao(id_instituicao);


--
-- Name: traducao traducao_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao
    ADD CONSTRAINT traducao_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- Name: traducao traducao_resultado_modelo_3d_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao
    ADD CONSTRAINT traducao_resultado_modelo_3d_id_fkey FOREIGN KEY (resultado_modelo_3d_id) REFERENCES public.avatar_3d(id_avatar);


--
-- Name: traducao traducao_resultado_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao
    ADD CONSTRAINT traducao_resultado_video_id_fkey FOREIGN KEY (resultado_video_id) REFERENCES public.sinal(id_sinal);


--
-- PostgreSQL database dump complete
--

\unrestrict HxK1xqQdcaDbSPcvatvi7Cnb5AUlxtd9kgjYhB9WbaDDrFGjFhZLx8BNbdjAMsP

