--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

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
-- Name: historico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historico (
    id_historico integer NOT NULL,
    id_usuario integer,
    acao character varying(100) NOT NULL,
    detalhes text,
    data_accao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    data_hora_entrada timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_hora_saida timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: sinal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sinal (
    id_sinal integer NOT NULL,
    palavra_portugues character varying(150) NOT NULL,
    descricao_gesto text,
    id_categoria integer,
    video_url text NOT NULL,
    thumb_url text,
    fonte character varying(200),
    tags text[],
    data_registo timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sinal OWNER TO postgres;

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
    tipo character varying(30),
    data_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT traducao_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['texto-para_gesto'::character varying, 'gesto_para_texto'::character varying])::text[])))
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
    numero_bilhete character varying(14),
    numero_nif character varying(14),
    telefone character varying(20),
    senha_hash text NOT NULL,
    id_perfil integer,
    status_usuario character varying(20),
    path_img text,
    descricao text,
    endereco_provincia character varying(50),
    endereco_municipio character varying(50),
    endereco_bairro character varying(50),
    criado_em timestamp without time zone DEFAULT now(),
    atualizado_em timestamp without time zone DEFAULT now(),
    ultimo_login timestamp without time zone DEFAULT now(),
    CONSTRAINT usuario_status_usuario_check CHECK (((status_usuario)::text = ANY ((ARRAY['Activo'::character varying, 'Inativo'::character varying, 'Banido'::character varying])::text[])))
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
-- Name: vw_all_usuario; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_all_usuario AS
 SELECT nome_completo,
    email,
    numero_bilhete,
    numero_nif,
    telefone,
    path_img,
    endereco_provincia,
    endereco_municipio,
    endereco_bairro,
    criado_em,
    ultimo_login
   FROM public.usuario
  ORDER BY email;


ALTER VIEW public.vw_all_usuario OWNER TO postgres;

--
-- Name: vw_categoria; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_categoria AS
 SELECT id_categoria AS codigo_categoria,
    categoria,
    descricao
   FROM public.categoria
  ORDER BY categoria;


ALTER VIEW public.vw_categoria OWNER TO postgres;

--
-- Name: vw_historico; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_historico AS
 SELECT historico.id_historico,
    historico.acao,
    usuario.email,
    usuario.nome_completo,
    usuario.id_usuario,
    historico.detalhes,
    historico.data_accao
   FROM (public.historico
     JOIN public.usuario ON ((historico.id_usuario = usuario.id_usuario)))
  ORDER BY historico.data_accao DESC;


ALTER VIEW public.vw_historico OWNER TO postgres;

--
-- Name: vw_historico_login; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_historico_login AS
 SELECT historico_login.id_usuario AS codigo_usuario,
    usuario.nome_completo AS usuario,
    usuario.numero_bilhete,
    usuario.numero_nif AS nif,
    usuario.path_img AS imagem_usuario,
    perfil.nome AS tipo_usuario,
    historico_login.data_hora_entrada,
    historico_login.data_hora_saida
   FROM ((public.usuario
     JOIN public.historico_login ON ((historico_login.id_usuario = usuario.id_usuario)))
     JOIN public.perfil ON ((perfil.id_perfil = usuario.id_perfil)));


ALTER VIEW public.vw_historico_login OWNER TO postgres;

--
-- Name: categoria id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);


--
-- Name: historico id_historico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico ALTER COLUMN id_historico SET DEFAULT nextval('public.historico_id_historico_seq'::regclass);


--
-- Name: historico_login id_historico_login; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historico_login ALTER COLUMN id_historico_login SET DEFAULT nextval('public.historico_login_id_historico_login_seq'::regclass);


--
-- Name: perfil id_perfil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil ALTER COLUMN id_perfil SET DEFAULT nextval('public.perfil_id_perfil_seq'::regclass);


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
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id_categoria, categoria, descricao) FROM stdin;
\.


--
-- Data for Name: historico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historico (id_historico, id_usuario, acao, detalhes, data_accao) FROM stdin;
\.


--
-- Data for Name: historico_login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historico_login (id_historico_login, id_usuario, data_hora_entrada, data_hora_saida) FROM stdin;
\.


--
-- Data for Name: perfil; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil (id_perfil, nome, descricao) FROM stdin;
\.


--
-- Data for Name: sinal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sinal (id_sinal, palavra_portugues, descricao_gesto, id_categoria, video_url, thumb_url, fonte, tags, data_registo) FROM stdin;
\.


--
-- Data for Name: traducao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.traducao (id_traducao, id_usuario, entrada, resultado_texto, resultado_video_id, tipo, data_hora) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nome_completo, email, numero_bilhete, numero_nif, telefone, senha_hash, id_perfil, status_usuario, path_img, descricao, endereco_provincia, endereco_municipio, endereco_bairro, criado_em, atualizado_em, ultimo_login) FROM stdin;
\.


--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_categoria_seq', 1, false);


--
-- Name: historico_id_historico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historico_id_historico_seq', 1, false);


--
-- Name: historico_login_id_historico_login_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historico_login_id_historico_login_seq', 1, false);


--
-- Name: perfil_id_perfil_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfil_id_perfil_seq', 1, false);


--
-- Name: sinal_id_sinal_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sinal_id_sinal_seq', 1, false);


--
-- Name: traducao_id_traducao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.traducao_id_traducao_seq', 1, false);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 1, false);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


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
-- Name: perfil perfil_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_nome_key UNIQUE (nome);


--
-- Name: perfil perfil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_pkey PRIMARY KEY (id_perfil);


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
-- Name: usuario usuario_numero_bilhete_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_numero_bilhete_key UNIQUE (numero_bilhete);


--
-- Name: usuario usuario_numero_nif_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_numero_nif_key UNIQUE (numero_nif);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: idx_historico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historico ON public.historico USING btree (id_usuario);


--
-- Name: idx_historico_login; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historico_login ON public.historico_login USING btree (id_usuario);


--
-- Name: idx_palavra; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_palavra ON public.sinal USING btree (palavra_portugues);


--
-- Name: idx_usuario_by_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_by_email ON public.usuario USING btree (email);


--
-- Name: idx_usuario_by_nome; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_by_nome ON public.usuario USING btree (nome_completo);


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
-- Name: sinal sinal_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinal
    ADD CONSTRAINT sinal_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria) ON DELETE CASCADE;


--
-- Name: traducao traducao_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao
    ADD CONSTRAINT traducao_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- Name: traducao traducao_resultado_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traducao
    ADD CONSTRAINT traducao_resultado_video_id_fkey FOREIGN KEY (resultado_video_id) REFERENCES public.sinal(id_sinal);


--
-- Name: usuario usuario_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

