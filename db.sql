--
-- PostgreSQL database dump
--

-- Dumped from database version 13.11
-- Dumped by pg_dump version 13.11

-- Started on 2023-08-12 11:32:49

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

-- DROP DATABASE "SkillTinder";
--
-- TOC entry 3041 (class 1262 OID 16853)
-- Name: SkillTinder; Type: DATABASE; Schema: -; Owner: -
--

-- CREATE DATABASE "SkillTinder" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Colombia.1252';


-- \connect "SkillTinder"

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

--
-- TOC entry 207 (class 1255 OID 16943)
-- Name: SelectProfessionals(); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public."SelectProfessionals"()
    LANGUAGE sql
    AS $$SELECT * FROM public."Professionals" ORDER BY "Id" ASC $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 16872)
-- Name: Companies; Type: TABLE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Companies_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public."Companies" (
    "Id" integer NOT NULL DEFAULT nextval('"Companies_Id_seq"'::regclass),
    "Name" character varying NOT NULL,
    "PhoneNumber" character varying,
    "Email" character varying NOT NULL
);


ALTER SEQUENCE public."Companies_Id_seq" OWNED BY public."Companies"."Id";

--
-- TOC entry 204 (class 1259 OID 16915)
-- Name: PaymentTypes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PaymentTypes" (
    "Id" integer NOT NULL,
    "Description" character varying NOT NULL
);

CREATE SEQUENCE public."PaymentTypes_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."PaymentTypes_Id_seq" OWNED BY public."PaymentTypes"."Id";

--
-- TOC entry 203 (class 1259 OID 16902)
-- Name: Payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payments" (
    "Id" integer NOT NULL,
    "Number" character varying NOT NULL,
    "Date" date NOT NULL,
    "Value" numeric(12,2) NOT NULL,
    "Project" integer NOT NULL,
    "PaymentType" integer NOT NULL
);

CREATE SEQUENCE public."Payments_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."Payments_Id_seq" OWNED BY public."Payments"."Id";

--
-- TOC entry 206 (class 1259 OID 16932)
-- Name: Professionals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Professionals" (
    "Id" integer NOT NULL,
    "Identification" numeric NOT NULL,
    "FirstNames" character varying NOT NULL,
    "SurNames" character varying NOT NULL,
    "Profession" character varying,
    "PhoneNumber" character varying,
    "Email" character varying NOT NULL,
    "Rate" numeric(5,2) NOT NULL
);

CREATE SEQUENCE public."Professionals_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."Professionals_Id_seq" OWNED BY public."Professionals"."Id";



--
-- TOC entry 202 (class 1259 OID 16880)
-- Name: Projects; Type: TABLE; Schema: public; Owner: -
--
CREATE SEQUENCE public."Projects_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."Projects_Id_seq" OWNED BY public."Projects"."Id";

CREATE TABLE public."Projects" (
    "Id" integer NOT NULL DEFAULT nextval('"Projects_Id_seq"'::regclass),
    "Title" character varying NOT NULL,
    "Description" text,
    "TimeBudget" numeric NOT NULL,
    "CostBudget" numeric(12,2) NOT NULL,
    "Company" integer NOT NULL,
    "Professional" integer
);


--
-- TOC entry 200 (class 1259 OID 16864)
-- Name: Skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Skills" (
    "Id" integer NOT NULL,
    "Description" character varying NOT NULL
);

CREATE SEQUENCE public."Skills_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."Skills_Id_seq" OWNED BY public."Skills"."Id";

--
-- TOC entry 2877 (class 2604 OID 16935)
-- Name: Professionals Id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Professionals" ALTER COLUMN "Id" SET DEFAULT nextval('public."Professionals_Id_seq"'::regclass);


INSERT INTO public."Professionals" ("Id", "Identification", "FirstNames", "SurNames", "Profession", "PhoneNumber", "Email", "Rate") VALUES (1, 13011696, 'Álvaro', 'Viveros', 'Ingeniero de Sistemas', '3164151486', 'alvaroviverose@gmail.com', 200.00);
INSERT INTO public."Professionals" ("Id", "Identification", "FirstNames", "SurNames", "Profession", "PhoneNumber", "Email", "Rate") VALUES (2, 1022950554, 'Leidy', 'Palma', 'FullStack Developer', '3178299771', 'leidy.palma@outlook.com', 300.00);


SELECT pg_catalog.setval('public."Professionals_Id_seq"', 2, true);


--
-- TOC entry 2881 (class 2606 OID 16879)
-- Name: Companies Companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Companies"
    ADD CONSTRAINT "Companies_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2889 (class 2606 OID 16922)
-- Name: PaymentTypes PaymentTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentTypes"
    ADD CONSTRAINT "PaymentTypes_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2891 (class 2606 OID 16924)
-- Name: PaymentTypes PaymentTypes_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentTypes"
    ADD CONSTRAINT "PaymentTypes_unique" UNIQUE ("Description");


--
-- TOC entry 2887 (class 2606 OID 16909)
-- Name: Payments Payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2893 (class 2606 OID 16940)
-- Name: Professionals Professionals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Professionals"
    ADD CONSTRAINT "Professionals_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2895 (class 2606 OID 16942)
-- Name: Professionals Professionals_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Professionals"
    ADD CONSTRAINT "Professionals_unique" UNIQUE ("Identification");


--
-- TOC entry 2883 (class 2606 OID 16889)
-- Name: Projects Project_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Project_unique" UNIQUE ("Title");


--
-- TOC entry 2885 (class 2606 OID 16887)
-- Name: Projects Projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2879 (class 2606 OID 16871)
-- Name: Skills Skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT "Skills_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2898 (class 2606 OID 16925)
-- Name: Payments Payments_PaymentTypes; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_PaymentTypes" FOREIGN KEY ("PaymentType") REFERENCES public."PaymentTypes"("Id") NOT VALID;


--
-- TOC entry 2897 (class 2606 OID 16910)
-- Name: Payments Payments_Projects_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_Projects_fkey" FOREIGN KEY ("Project") REFERENCES public."Projects"("Id") NOT VALID;


--
-- TOC entry 2896 (class 2606 OID 16890)
-- Name: Projects Projects_Companies_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_Companies_fkey" FOREIGN KEY ("Company") REFERENCES public."Companies"("Id") NOT VALID;


-- Completed on 2023-08-12 11:32:49

--
-- PostgreSQL database dump complete
--

