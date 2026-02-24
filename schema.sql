--
-- PostgreSQL database dump
--

\restrict LIWjTBEeTTkijAx4XdnocNxj0qdOtH3iklBF51w4jeO2hSUJwvJlM14gxLl0UCs

-- Dumped from database version 16.11 (Homebrew)
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: ai_logs; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.ai_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    endpoint text NOT NULL,
    input jsonb NOT NULL,
    output text,
    mode text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_logs OWNER TO sebastianolarte;

--
-- Name: ai_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.ai_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_logs_id_seq OWNER TO sebastianolarte;

--
-- Name: ai_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.ai_logs_id_seq OWNED BY public.ai_logs.id;


--
-- Name: cursos; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.cursos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    categoria character varying(50) NOT NULL,
    lenguaje character varying(50),
    materia character varying(50),
    nivel character varying(50),
    vistas integer DEFAULT 0,
    created_by integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cursos OWNER TO sebastianolarte;

--
-- Name: cursos_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.cursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_id_seq OWNER TO sebastianolarte;

--
-- Name: cursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.cursos_id_seq OWNED BY public.cursos.id;


--
-- Name: document_audit; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.document_audit (
    id integer NOT NULL,
    document_id integer,
    action character varying(50) NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.document_audit OWNER TO sebastianolarte;

--
-- Name: document_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.document_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_audit_id_seq OWNER TO sebastianolarte;

--
-- Name: document_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.document_audit_id_seq OWNED BY public.document_audit.id;


--
-- Name: document_data; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.document_data (
    document_id integer NOT NULL,
    extracted_text text,
    extracted_fields jsonb,
    processed_at timestamp without time zone
);


ALTER TABLE public.document_data OWNER TO sebastianolarte;

--
-- Name: document_types; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.document_types (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.document_types OWNER TO sebastianolarte;

--
-- Name: document_types_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.document_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_types_id_seq OWNER TO sebastianolarte;

--
-- Name: document_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.document_types_id_seq OWNED BY public.document_types.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    owner_type character varying(50) NOT NULL,
    owner_id integer NOT NULL,
    document_type_id integer NOT NULL,
    file_path text NOT NULL,
    mime_type character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    uploaded_by integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.documents OWNER TO sebastianolarte;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO sebastianolarte;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer,
    token_hash text NOT NULL,
    revoked boolean DEFAULT false,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.refresh_tokens OWNER TO sebastianolarte;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO sebastianolarte;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: sebastianolarte
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO sebastianolarte;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: sebastianolarte
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO sebastianolarte;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sebastianolarte
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: ai_logs id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.ai_logs ALTER COLUMN id SET DEFAULT nextval('public.ai_logs_id_seq'::regclass);


--
-- Name: cursos id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id SET DEFAULT nextval('public.cursos_id_seq'::regclass);


--
-- Name: document_audit id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_audit ALTER COLUMN id SET DEFAULT nextval('public.document_audit_id_seq'::regclass);


--
-- Name: document_types id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_types ALTER COLUMN id SET DEFAULT nextval('public.document_types_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: ai_logs ai_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT ai_logs_pkey PRIMARY KEY (id);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id);


--
-- Name: document_audit document_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_audit
    ADD CONSTRAINT document_audit_pkey PRIMARY KEY (id);


--
-- Name: document_data document_data_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_data
    ADD CONSTRAINT document_data_pkey PRIMARY KEY (document_id);


--
-- Name: document_types document_types_code_key; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_types
    ADD CONSTRAINT document_types_code_key UNIQUE (code);


--
-- Name: document_types document_types_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_types
    ADD CONSTRAINT document_types_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_documents_owner; Type: INDEX; Schema: public; Owner: sebastianolarte
--

CREATE INDEX idx_documents_owner ON public.documents USING btree (owner_type, owner_id);


--
-- Name: idx_documents_status; Type: INDEX; Schema: public; Owner: sebastianolarte
--

CREATE INDEX idx_documents_status ON public.documents USING btree (status);


--
-- Name: idx_documents_type; Type: INDEX; Schema: public; Owner: sebastianolarte
--

CREATE INDEX idx_documents_type ON public.documents USING btree (document_type_id);


--
-- Name: ai_logs ai_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT ai_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: cursos cursos_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: document_audit document_audit_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_audit
    ADD CONSTRAINT document_audit_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: document_audit document_audit_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_audit
    ADD CONSTRAINT document_audit_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: document_data document_data_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.document_data
    ADD CONSTRAINT document_data_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: documents documents_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id);


--
-- Name: documents documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sebastianolarte
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict LIWjTBEeTTkijAx4XdnocNxj0qdOtH3iklBF51w4jeO2hSUJwvJlM14gxLl0UCs

