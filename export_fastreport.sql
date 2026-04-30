--
-- PostgreSQL database dump
--

\restrict o8Gi78jvaCzBhjDSZRKozjEVBNTWh24cbpkgMKo69k95jV0xhpwCWAFVYGhoayg

-- Dumped from database version 17.8
-- Dumped by pg_dump version 17.8

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

ALTER TABLE IF EXISTS ONLY public.reports_reportschedule DROP CONSTRAINT IF EXISTS reports_reportschedule_user_id_972eb9ca_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.reports_reportschedule DROP CONSTRAINT IF EXISTS reports_reportschedule_report_id_afe3bd17_fk_reports_report_id;
ALTER TABLE IF EXISTS ONLY public.reports_reportpermission DROP CONSTRAINT IF EXISTS reports_reportpermission_user_id_08aadd37_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.reports_reportpermission DROP CONSTRAINT IF EXISTS reports_reportpermission_group_id_7a6dc31b_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.reports_reportpermission DROP CONSTRAINT IF EXISTS reports_reportpermis_report_id_2adc118a_fk_reports_r;
ALTER TABLE IF EXISTS ONLY public.reports_reportparameter DROP CONSTRAINT IF EXISTS reports_reportparameter_report_id_03e6f3de_fk_reports_report_id;
ALTER TABLE IF EXISTS ONLY public.reports_reportexecution DROP CONSTRAINT IF EXISTS reports_reportexecution_user_id_4a59778b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.reports_reportexecution DROP CONSTRAINT IF EXISTS reports_reportexecution_report_id_0406ed5a_fk_reports_report_id;
ALTER TABLE IF EXISTS ONLY public.reports_report DROP CONSTRAINT IF EXISTS reports_report_owner_id_45bf5b4d_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.reports_report DROP CONSTRAINT IF EXISTS reports_report_datasource_id_47306062_fk_settings_;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_solar_id_a87ce72c_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_interval_id_a8ca27da_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_crontab_id_d3cba168_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_clocked_id_47a69f82_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
DROP INDEX IF EXISTS public.settings_app_smtpconfig_name_e9959ba0_like;
DROP INDEX IF EXISTS public.settings_app_ftpconfig_name_3505b725_like;
DROP INDEX IF EXISTS public.settings_app_datasource_name_344c75a6_like;
DROP INDEX IF EXISTS public.reports_reportschedule_user_id_972eb9ca;
DROP INDEX IF EXISTS public.reports_reportschedule_report_id_afe3bd17;
DROP INDEX IF EXISTS public.reports_reportpermission_user_id_08aadd37;
DROP INDEX IF EXISTS public.reports_reportpermission_report_id_2adc118a;
DROP INDEX IF EXISTS public.reports_reportpermission_group_id_7a6dc31b;
DROP INDEX IF EXISTS public.reports_reportparameter_report_id_03e6f3de;
DROP INDEX IF EXISTS public.reports_reportexecution_user_id_4a59778b;
DROP INDEX IF EXISTS public.reports_reportexecution_report_id_0406ed5a;
DROP INDEX IF EXISTS public.reports_report_owner_id_45bf5b4d;
DROP INDEX IF EXISTS public.reports_report_datasource_id_47306062;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_solar_id_a87ce72c;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_name_265a36b7_like;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_interval_id_a8ca27da;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_crontab_id_d3cba168;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_clocked_id_47a69f82;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.auth_user_username_6821ab7c_like;
DROP INDEX IF EXISTS public.auth_user_user_permissions_user_id_a95ead1b;
DROP INDEX IF EXISTS public.auth_user_user_permissions_permission_id_1fbb5f2c;
DROP INDEX IF EXISTS public.auth_user_groups_user_id_6a12ed8b;
DROP INDEX IF EXISTS public.auth_user_groups_group_id_97559544;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
ALTER TABLE IF EXISTS ONLY public.settings_app_smtpconfig DROP CONSTRAINT IF EXISTS settings_app_smtpconfig_pkey;
ALTER TABLE IF EXISTS ONLY public.settings_app_smtpconfig DROP CONSTRAINT IF EXISTS settings_app_smtpconfig_name_key;
ALTER TABLE IF EXISTS ONLY public.settings_app_ftpconfig DROP CONSTRAINT IF EXISTS settings_app_ftpconfig_pkey;
ALTER TABLE IF EXISTS ONLY public.settings_app_ftpconfig DROP CONSTRAINT IF EXISTS settings_app_ftpconfig_name_key;
ALTER TABLE IF EXISTS ONLY public.settings_app_datasource DROP CONSTRAINT IF EXISTS settings_app_datasource_pkey;
ALTER TABLE IF EXISTS ONLY public.settings_app_datasource DROP CONSTRAINT IF EXISTS settings_app_datasource_name_key;
ALTER TABLE IF EXISTS ONLY public.reports_reportschedule DROP CONSTRAINT IF EXISTS reports_reportschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.reports_reportpermission DROP CONSTRAINT IF EXISTS reports_reportpermission_pkey;
ALTER TABLE IF EXISTS ONLY public.reports_reportparameter DROP CONSTRAINT IF EXISTS reports_reportparameter_report_id_name_9b06559b_uniq;
ALTER TABLE IF EXISTS ONLY public.reports_reportparameter DROP CONSTRAINT IF EXISTS reports_reportparameter_pkey;
ALTER TABLE IF EXISTS ONLY public.reports_reportexecution DROP CONSTRAINT IF EXISTS reports_reportexecution_pkey;
ALTER TABLE IF EXISTS ONLY public.reports_report DROP CONSTRAINT IF EXISTS reports_report_pkey;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_solarschedule DROP CONSTRAINT IF EXISTS django_celery_beat_solarschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_solarschedule DROP CONSTRAINT IF EXISTS django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictasks DROP CONSTRAINT IF EXISTS django_celery_beat_periodictasks_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_periodictask_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_periodictask_name_key;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_intervalschedule DROP CONSTRAINT IF EXISTS django_celery_beat_intervalschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_crontabschedule DROP CONSTRAINT IF EXISTS django_celery_beat_crontabschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_clockedschedule DROP CONSTRAINT IF EXISTS django_celery_beat_clockedschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_username_key;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
DROP TABLE IF EXISTS public.settings_app_smtpconfig;
DROP TABLE IF EXISTS public.settings_app_ftpconfig;
DROP TABLE IF EXISTS public.settings_app_datasource;
DROP TABLE IF EXISTS public.reports_reportschedule;
DROP TABLE IF EXISTS public.reports_reportpermission;
DROP TABLE IF EXISTS public.reports_reportparameter;
DROP TABLE IF EXISTS public.reports_reportexecution;
DROP TABLE IF EXISTS public.reports_report;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_celery_beat_solarschedule;
DROP TABLE IF EXISTS public.django_celery_beat_periodictasks;
DROP TABLE IF EXISTS public.django_celery_beat_periodictask;
DROP TABLE IF EXISTS public.django_celery_beat_intervalschedule;
DROP TABLE IF EXISTS public.django_celery_beat_crontabschedule;
DROP TABLE IF EXISTS public.django_celery_beat_clockedschedule;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_clockedschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_clockedschedule (
    id integer NOT NULL,
    clocked_time timestamp with time zone NOT NULL
);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_clockedschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_clockedschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_crontabschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_crontabschedule (
    id integer NOT NULL,
    minute character varying(240) NOT NULL,
    hour character varying(96) NOT NULL,
    day_of_week character varying(64) NOT NULL,
    day_of_month character varying(124) NOT NULL,
    month_of_year character varying(64) NOT NULL,
    timezone character varying(63) NOT NULL
);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_crontabschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_crontabschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_intervalschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_intervalschedule (
    id integer NOT NULL,
    every integer NOT NULL,
    period character varying(24) NOT NULL
);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_intervalschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_intervalschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_periodictask; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_periodictask (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    task character varying(200) NOT NULL,
    args text NOT NULL,
    kwargs text NOT NULL,
    queue character varying(200),
    exchange character varying(200),
    routing_key character varying(200),
    expires timestamp with time zone,
    enabled boolean NOT NULL,
    last_run_at timestamp with time zone,
    total_run_count integer NOT NULL,
    date_changed timestamp with time zone NOT NULL,
    description text NOT NULL,
    crontab_id integer,
    interval_id integer,
    solar_id integer,
    one_off boolean NOT NULL,
    start_time timestamp with time zone,
    priority integer,
    headers text NOT NULL,
    clocked_id integer,
    expire_seconds integer,
    CONSTRAINT django_celery_beat_periodictask_expire_seconds_check CHECK ((expire_seconds >= 0)),
    CONSTRAINT django_celery_beat_periodictask_priority_check CHECK ((priority >= 0)),
    CONSTRAINT django_celery_beat_periodictask_total_run_count_check CHECK ((total_run_count >= 0))
);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_periodictask ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_periodictask_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_periodictasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_periodictasks (
    ident smallint NOT NULL,
    last_update timestamp with time zone NOT NULL
);


--
-- Name: django_celery_beat_solarschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_solarschedule (
    id integer NOT NULL,
    event character varying(24) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL
);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_solarschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_solarschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: reports_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports_report (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    sql_query text NOT NULL,
    visibility character varying(10) NOT NULL,
    output_types jsonb NOT NULL,
    routing_modes jsonb NOT NULL,
    csv_separator character varying(5) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    owner_id integer NOT NULL,
    datasource_id bigint,
    category character varying(50),
    email_body text NOT NULL,
    email_body_footer text NOT NULL,
    email_body_header text NOT NULL,
    embed_results boolean NOT NULL
);


--
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reports_report ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.reports_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reports_reportexecution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports_reportexecution (
    id bigint NOT NULL,
    parameters jsonb NOT NULL,
    output_type character varying(10) NOT NULL,
    routing_mode character varying(20) NOT NULL,
    routing_config jsonb NOT NULL,
    status character varying(10) NOT NULL,
    started_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    result_file character varying(100),
    error_message text NOT NULL,
    report_id bigint NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: reports_reportexecution_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reports_reportexecution ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.reports_reportexecution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reports_reportparameter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports_reportparameter (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    label character varying(200) NOT NULL,
    param_type character varying(20) NOT NULL,
    operators jsonb NOT NULL,
    default_value character varying(500) NOT NULL,
    required boolean NOT NULL,
    "order" integer NOT NULL,
    enum_values jsonb NOT NULL,
    report_id bigint NOT NULL,
    CONSTRAINT reports_reportparameter_order_check CHECK (("order" >= 0))
);


--
-- Name: reports_reportparameter_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reports_reportparameter ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.reports_reportparameter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reports_reportpermission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports_reportpermission (
    id bigint NOT NULL,
    can_execute boolean NOT NULL,
    can_modify boolean NOT NULL,
    group_id integer,
    report_id bigint NOT NULL,
    user_id integer
);


--
-- Name: reports_reportpermission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reports_reportpermission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.reports_reportpermission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reports_reportschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports_reportschedule (
    id bigint NOT NULL,
    parameters jsonb NOT NULL,
    output_type character varying(10) NOT NULL,
    routing_mode character varying(20) NOT NULL,
    routing_config jsonb NOT NULL,
    schedule_type character varying(10) NOT NULL,
    scheduled_at timestamp with time zone,
    cron_expression character varying(100) NOT NULL,
    timezone character varying(50) NOT NULL,
    is_active boolean NOT NULL,
    celery_task_id character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    report_id bigint NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: reports_reportschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reports_reportschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.reports_reportschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: settings_app_datasource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings_app_datasource (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    db_type character varying(20) NOT NULL,
    host character varying(255) NOT NULL,
    port integer NOT NULL,
    database_name character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(500) NOT NULL,
    options jsonb NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: settings_app_datasource_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.settings_app_datasource ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.settings_app_datasource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: settings_app_ftpconfig; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings_app_ftpconfig (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(4) NOT NULL,
    host character varying(255) NOT NULL,
    port integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(500) NOT NULL,
    remote_path character varying(500) NOT NULL,
    is_default boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: settings_app_ftpconfig_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.settings_app_ftpconfig ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.settings_app_ftpconfig_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: settings_app_smtpconfig; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings_app_smtpconfig (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    host character varying(255) NOT NULL,
    port integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(500) NOT NULL,
    use_tls boolean NOT NULL,
    from_email character varying(254) NOT NULL,
    is_default boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: settings_app_smtpconfig_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.settings_app_smtpconfig ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.settings_app_smtpconfig_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
1	Test Group 1
2	Test Group 2
3	IT
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add crontab	7	add_crontabschedule
26	Can change crontab	7	change_crontabschedule
27	Can delete crontab	7	delete_crontabschedule
28	Can view crontab	7	view_crontabschedule
29	Can add interval	8	add_intervalschedule
30	Can change interval	8	change_intervalschedule
31	Can delete interval	8	delete_intervalschedule
32	Can view interval	8	view_intervalschedule
33	Can add periodic task	9	add_periodictask
34	Can change periodic task	9	change_periodictask
35	Can delete periodic task	9	delete_periodictask
36	Can view periodic task	9	view_periodictask
37	Can add periodic task track	10	add_periodictasks
38	Can change periodic task track	10	change_periodictasks
39	Can delete periodic task track	10	delete_periodictasks
40	Can view periodic task track	10	view_periodictasks
41	Can add solar event	11	add_solarschedule
42	Can change solar event	11	change_solarschedule
43	Can delete solar event	11	delete_solarschedule
44	Can view solar event	11	view_solarschedule
45	Can add clocked	12	add_clockedschedule
46	Can change clocked	12	change_clockedschedule
47	Can delete clocked	12	delete_clockedschedule
48	Can view clocked	12	view_clockedschedule
49	Can add Rapport	13	add_report
50	Can change Rapport	13	change_report
51	Can delete Rapport	13	delete_report
52	Can view Rapport	13	view_report
53	Can add Exécution de rapport	14	add_reportexecution
54	Can change Exécution de rapport	14	change_reportexecution
55	Can delete Exécution de rapport	14	delete_reportexecution
56	Can view Exécution de rapport	14	view_reportexecution
57	Can add Permission de rapport	15	add_reportpermission
58	Can change Permission de rapport	15	change_reportpermission
59	Can delete Permission de rapport	15	delete_reportpermission
60	Can view Permission de rapport	15	view_reportpermission
61	Can add Planification de rapport	16	add_reportschedule
62	Can change Planification de rapport	16	change_reportschedule
63	Can delete Planification de rapport	16	delete_reportschedule
64	Can view Planification de rapport	16	view_reportschedule
65	Can add Paramètre	17	add_reportparameter
66	Can change Paramètre	17	change_reportparameter
67	Can delete Paramètre	17	delete_reportparameter
68	Can view Paramètre	17	view_reportparameter
69	Can add Source de données	18	add_datasource
70	Can change Source de données	18	change_datasource
71	Can delete Source de données	18	delete_datasource
72	Can view Source de données	18	view_datasource
73	Can add Configuration FTP/SFTP	19	add_ftpconfig
74	Can change Configuration FTP/SFTP	19	change_ftpconfig
75	Can delete Configuration FTP/SFTP	19	delete_ftpconfig
76	Can view Configuration FTP/SFTP	19	view_ftpconfig
77	Can add Configuration SMTP	20	add_smtpconfig
78	Can change Configuration SMTP	20	change_smtpconfig
79	Can delete Configuration SMTP	20	delete_smtpconfig
80	Can view Configuration SMTP	20	view_smtpconfig
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
3		\N	f	user_test1			u1@test.com	f	t	2026-03-06 15:50:29.144947+01
4	pbkdf2_sha256$870000$fSRsn8rdHlqGwF76hzuxDM$Gnr0O7/oghhRlNBSD2oUdQrsXjTNLMXjSxzux1D1GPA=	\N	f	new_user_via_api	New	User	new@test.com	f	t	2026-03-06 15:50:49.329377+01
1	pbkdf2_sha256$870000$JIvOQ5wC8gZh3Zx9nYshA1$ZYHsnQ/QBLQNHPsJxt11dQfJpLxxrgMKUJsrH6Ey5kc=	2026-02-17 12:38:34.22221+01	t	admin	Moez	Bouchriha	admin@example.com	t	t	2026-02-17 12:35:09.204907+01
2	pbkdf2_sha256$870000$GJ79T5rshfzaEm3RDqsOQ7$E06WVoDL36hiEWRYCJ6lMffZezuW+FTKLmv/TmiET7g=	\N	t	admin_test			admin@test.com	t	t	2026-03-06 15:50:28.224764+01
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
1	4	1
2	1	3
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_clockedschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_clockedschedule (id, clocked_time) FROM stdin;
1	2026-02-17 15:25:00+01
2	2026-02-19 16:15:00+01
3	2026-02-20 16:50:00+01
4	2026-04-29 15:00:00+02
5	2026-04-30 08:59:00+02
\.


--
-- Data for Name: django_celery_beat_crontabschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_crontabschedule (id, minute, hour, day_of_week, day_of_month, month_of_year, timezone) FROM stdin;
2	00	11	*	*	*	Europe/Paris
3	30	08	*	1	*	Europe/Paris
4	12	08	2	*	*	Europe/Berlin
1	0	4	*	*	*	Europe/Paris
\.


--
-- Data for Name: django_celery_beat_intervalschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_intervalschedule (id, every, period) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_periodictask; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_periodictask (id, name, task, args, kwargs, queue, exchange, routing_key, expires, enabled, last_run_at, total_run_count, date_changed, description, crontab_id, interval_id, solar_id, one_off, start_time, priority, headers, clocked_id, expire_seconds) FROM stdin;
5	report-schedule-4	launcher.tasks.run_scheduled_report	[]	{"schedule_id": 4}	\N	\N	\N	\N	f	2026-04-17 11:00:00.035781+02	7	2026-04-17 11:02:21.491844+02		2	\N	\N	f	\N	\N	{}	\N	\N
6	report-schedule-5	launcher.tasks.run_scheduled_report	[]	{"schedule_id": 5}	\N	\N	\N	\N	t	\N	0	2026-04-22 13:51:38.147519+02		3	\N	\N	f	\N	\N	{}	\N	\N
2	report-schedule-1	launcher.tasks.run_scheduled_report	[]	{"schedule_id": 1}	\N	\N	\N	\N	f	\N	0	2026-02-17 16:45:07.135527+01		\N	\N	\N	t	\N	\N	{}	1	\N
7	report-schedule-6	launcher.tasks.run_scheduled_report	[]	{"schedule_id": 6}	\N	\N	\N	\N	f	\N	0	2026-04-29 17:35:51.236913+02		\N	\N	\N	t	\N	\N	{}	4	\N
8	report-schedule-7	launcher.tasks.run_scheduled_report	[]	{"schedule_id": 7}	\N	\N	\N	\N	f	\N	0	2026-04-30 09:27:22.342618+02		\N	\N	\N	t	\N	\N	{}	5	\N
10	report-schedule-9	launcher.tasks.run_scheduled_report	[]	{"schedule_id": 9}	\N	\N	\N	\N	t	\N	0	2026-04-30 09:34:16.414117+02		4	\N	\N	f	\N	\N	{}	\N	\N
1	celery.backend_cleanup	celery.backend_cleanup	[]	{}	\N	\N	\N	\N	t	2026-04-30 04:00:00.034025+02	72	2026-04-30 11:41:30.987197+02		1	\N	\N	f	\N	\N	{}	\N	43200
\.


--
-- Data for Name: django_celery_beat_periodictasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_periodictasks (ident, last_update) FROM stdin;
1	2026-04-30 11:41:30.988197+02
\.


--
-- Data for Name: django_celery_beat_solarschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_solarschedule (id, event, latitude, longitude) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	django_celery_beat	crontabschedule
8	django_celery_beat	intervalschedule
9	django_celery_beat	periodictask
10	django_celery_beat	periodictasks
11	django_celery_beat	solarschedule
12	django_celery_beat	clockedschedule
13	reports	report
14	reports	reportexecution
15	reports	reportpermission
16	reports	reportschedule
17	reports	reportparameter
18	settings_app	datasource
19	settings_app	ftpconfig
20	settings_app	smtpconfig
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-02-17 12:34:41.485554+01
2	auth	0001_initial	2026-02-17 12:34:41.540671+01
3	admin	0001_initial	2026-02-17 12:34:41.558705+01
4	admin	0002_logentry_remove_auto_add	2026-02-17 12:34:41.565705+01
5	admin	0003_logentry_add_action_flag_choices	2026-02-17 12:34:41.573706+01
6	contenttypes	0002_remove_content_type_name	2026-02-17 12:34:41.585518+01
7	auth	0002_alter_permission_name_max_length	2026-02-17 12:34:41.593522+01
8	auth	0003_alter_user_email_max_length	2026-02-17 12:34:41.600166+01
9	auth	0004_alter_user_username_opts	2026-02-17 12:34:41.605676+01
10	auth	0005_alter_user_last_login_null	2026-02-17 12:34:41.614453+01
11	auth	0006_require_contenttypes_0002	2026-02-17 12:34:41.615454+01
12	auth	0007_alter_validators_add_error_messages	2026-02-17 12:34:41.622321+01
13	auth	0008_alter_user_username_max_length	2026-02-17 12:34:41.634321+01
14	auth	0009_alter_user_last_name_max_length	2026-02-17 12:34:41.640748+01
15	auth	0010_alter_group_name_max_length	2026-02-17 12:34:41.646791+01
16	auth	0011_update_proxy_permissions	2026-02-17 12:34:41.653383+01
17	auth	0012_alter_user_first_name_max_length	2026-02-17 12:34:41.660383+01
18	django_celery_beat	0001_initial	2026-02-17 12:34:41.685758+01
19	django_celery_beat	0002_auto_20161118_0346	2026-02-17 12:34:41.695757+01
20	django_celery_beat	0003_auto_20161209_0049	2026-02-17 12:34:41.701757+01
21	django_celery_beat	0004_auto_20170221_0000	2026-02-17 12:34:41.704759+01
22	django_celery_beat	0005_add_solarschedule_events_choices	2026-02-17 12:34:41.707758+01
23	django_celery_beat	0006_auto_20180322_0932	2026-02-17 12:34:41.785181+01
24	django_celery_beat	0007_auto_20180521_0826	2026-02-17 12:34:41.802181+01
25	django_celery_beat	0008_auto_20180914_1922	2026-02-17 12:34:41.834075+01
26	django_celery_beat	0006_auto_20180210_1226	2026-02-17 12:34:41.853077+01
27	django_celery_beat	0006_periodictask_priority	2026-02-17 12:34:41.862081+01
28	django_celery_beat	0009_periodictask_headers	2026-02-17 12:34:41.871268+01
29	django_celery_beat	0010_auto_20190429_0326	2026-02-17 12:34:42.070536+01
30	django_celery_beat	0011_auto_20190508_0153	2026-02-17 12:34:42.085411+01
31	django_celery_beat	0012_periodictask_expire_seconds	2026-02-17 12:34:42.094413+01
32	django_celery_beat	0013_auto_20200609_0727	2026-02-17 12:34:42.104414+01
33	django_celery_beat	0014_remove_clockedschedule_enabled	2026-02-17 12:34:42.107414+01
34	django_celery_beat	0015_edit_solarschedule_events_choices	2026-02-17 12:34:42.111412+01
35	django_celery_beat	0016_alter_crontabschedule_timezone	2026-02-17 12:34:42.121411+01
36	django_celery_beat	0017_alter_crontabschedule_month_of_year	2026-02-17 12:34:42.129681+01
37	django_celery_beat	0018_improve_crontab_helptext	2026-02-17 12:34:42.138495+01
38	django_celery_beat	0019_alter_periodictasks_options	2026-02-17 12:34:42.140495+01
39	settings_app	0001_initial	2026-02-17 12:34:42.163723+01
40	reports	0001_initial	2026-02-17 12:34:42.249301+01
41	reports	0002_report_datasource	2026-02-17 12:34:42.265201+01
42	sessions	0001_initial	2026-02-17 12:34:42.27229+01
43	reports	0003_report_category_report_email_body	2026-04-09 16:45:14.762983+02
44	reports	0004_report_email_body_footer_report_email_body_header_and_more	2026-04-30 10:59:32.66107+02
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
v1b0jhfg0thnso91z3ywfwdjlmpa12ep	.eJxVjEEOwiAQRe_C2hAQ6KBL956hmWEGqRpISrsy3l2bdKHb_977LzXiupRx7TKPE6uzsurwuxGmh9QN8B3rrenU6jJPpDdF77Tra2N5Xnb376BgL9_a-yNBMCjRZTHAlkRChhhEkqccCMzJDybFOCCgJ8ucjXVOxEJyzqv3B_L0OC8:1vsJPW:S0ImW41BOZv1w3osckc79EPM4FDTEJrZlCxoc8DGG0c	2026-03-03 12:38:34.239903+01
\.


--
-- Data for Name: reports_report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports_report (id, name, description, sql_query, visibility, output_types, routing_modes, csv_separator, created_at, updated_at, owner_id, datasource_id, category, email_body, email_body_footer, email_body_header, embed_results) FROM stdin;
1	Liste magasins	Liste des magasins storeland test	SELECT CODEMAGASIN, NOMMAGASIN, CODEPAYS FROM magasins WHERE CODEPAYS = :CODEPAYS	private	["CSV", "XLSX", "PDF"]	["screen", "email", "local"]	;	2026-02-17 15:15:30.669505+01	2026-04-30 11:03:01.655651+02	1	3	Retail	Bonjour\n\nCi-joint la liste des magasins\n\nDirection informatique			f
2	Rapport Ticket Vente ESP J-1	Voici la liste des ventes pour le client CAAN8 (77078) sur les ventes J-1 dans JDE.\nLes ventes sont intégrées via le flux SLRPT.	SELECT\n        T3.CYSHAN                  \t\tAS CLIENT_JDE\n       ,TRIM(TO_CHAR(T3.CYAA06))    \tAS CodeMagasin_STLD\n       ,TO_CHAR(PRODDTA.julien_to_gregorien(F5.CATRDJ), 'DD/MM/YY') AS JourDeVente\n       ,F5.CATRDJ\n       ,(F5.CADSC1) AS N_Ticket\n       ,(F5.CALNID/1000) AS Ligne_Ticket\n       ,F5.CAAA05 AS Type_Ope\n       ,F5.CAAITM AS EAN\n       ,F5.CALITM AS SKU\n       ,(F5.CAFPRC/1000) AS PRIXVTE\n       ,(F5.CASOQS/100) AS QTEVTE\n       ,(F5.CAFPRC/1000) * (F5.CASOQS/100) AS TTL_CA\n       ,F5.CADSC2 AS CodeVendeur\n    FROM\n        PRODDTA.F5597 F5\n    INNER JOIN\n        PRODDTA.F55421 T3   on T3.CYSHAN = F5.CASHAN  -- AND TRIM(T3.CYAA06) in ('401')\n        --AND TRIM(T3.CYAA06) in ('938') --:CODMAGSTLD)\n    -- Filtre\n    WHERE\n\t\t F5.CATRDJ = TO_NUMBER(TO_CHAR(sysdate - 1, 'YYYYDDD')) - 1900000\n\t     AND F5.CAAN8 ='77078'\n    GROUP BY\n        T3.CYSHAN\n       ,T3.CYAA06\n       ,F5.CATRDJ\n       ,F5.CATRDJ\n       ,F5.CADSC1\n       ,F5.CALNID \n       ,F5.CAAA05\n       ,F5.CAAITM \n       ,F5.CALITM \n       ,F5.CAFPRC\n       ,F5.CASOQS\n       ,(F5.CAFPRC/1000) * (F5.CASOQS/100) \n       ,F5.CADSC2     \n    ORDER BY F5.CADSC1, F5.CALNID	private	["XLSX"]	["screen", "email"]	,	2026-04-10 11:32:47.575279+02	2026-04-10 11:36:50.711073+02	1	4	Retail	Bonjour \n\nVoici la liste des ventes pour le client CAAN8 (77078) sur les ventes J-1 dans JDE.\n\nLes ventes sont intégrées via le flux SLRPT. \n\nCordialement.			f
3	Fichier analyse de la marge commercial		SELECT\n    t1.sdkco                                AS "STE",\n    t1.sddct                                AS "TYP_DOC",\n    t1.sddoc                                AS "NUM_DOC",\n    t1.sddct\n    || '_'\n    || t1.sddoc                             AS "CMTAIRE",\n    t2.gllt                                 AS "TYP_LIVRE",\n    TRIM(t2.glmcu)                          AS "MCU",\n    CASE\n        WHEN REGEXP_LIKE ( proddta.convdate_j_to_dasc(t1.sddgl),\n                           '^[1-9][0-9]{3}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$' ) THEN\n            to_char(TO_DATE(proddta.convdate_j_to_dasc(t1.sddgl),\n                    'YYYYMMDD'),\n                    'YYYYMM')\n        ELSE\n            NULL\n    END                                     AS "DAT_FACT",\n    20 || t1.sdfy                           AS "ANNEE",\n    TRIM(t4.drdl01)                         AS "DIV_COMM",\n    t1.sdan8                                AS "CLT",\n    TRIM(t2.glani)                          AS "CPTE",\n    TRIM(t2.glsbl)                          AS "NOMMARCHE",\n    t2.glsblt                               AS "TYP_MARCHE",\n    TRIM(t1.sdlitm)                         AS "ARTICLE",\n    t2.glaa / 100                           AS "MONTANT_960350",\n    t1.sduorg / 100                         AS "QUANTITE",\n    t1.sdecst / 100                         AS "MONTANT_COUT_STD",\n    '1'                                     AS "COL_CONST",\n    t1.sdaexp / 100                         AS "MONTANT_NET_HT_EUR",\n    t1.sdsrp5 || t1.sdsrp4                  AS "REF",\n    t1.sdsrp3                               AS "COULEUR",\n    20 || t2.glfy                           AS "ANNEE2",\n    t2.glpn                                 AS "MOIS",\n    t6.councs / 10000                       AS "PRI",\n    ( t1.sduorg / 100 ) * t6.councs / 10000 AS "COGS",\n    t3.abac11                               AS "SOUS-LIVRE",\n    CASE\n        WHEN t3.abac03 LIKE '%DMK%' THEN\n            'France Marketplace'\n        ELSE\n            'France détail'\n    END                                     AS "MARCHE REPORTING",\n    t1.sdsrp5\n    || t1.sdsrp4\n    || t1.sdsrp3                            AS "REF COULEUR",\n    '0'                                     AS "Num col tarif cession",\n    t1.sdcrcd                               AS "DEVISE",\n    t1.sduprc / 10000                       AS "TARIF (DEVISE)",\n    t1.sduprc / 10000                       AS "TARIF (EUR)",\n    t1.sdaexp / 100                         AS "CA",\n    t1.sdaexp / 100                         AS "CA @Tx Bud",\n    t1.sdaexp / 100                         AS "CA (devise)",\n    t3.abac03                               AS "CANAL",\n    TRIM(t5.drdl01)                         AS "SOUS-LIVRE2",\n    TRIM(t3.abalph)                         AS "NOM CLIENT FACTURE",\n    TRIM(t5.drdl01)                         AS "NOUVELLE ZONE"\nFROM\n    proddta.f4211 t1,\n    proddta.f0911 t2,\n    proddta.f0101 t3,\n    prodctl.f0005 t4,\n    prodctl.f0005 t5,\n    proddta.f4105 t6\nWHERE\n        t1.sdkcoo = '00007'\n    AND t2.glco = '00007'\n    AND t1.sdkcoo = t2.glco\n    AND t1.sddoc = t2.gldoc\n    AND t2.globj = '960350'\n    AND t1.sdan8 = t3.aban8\n    AND t6.coledg = '07'\n    AND t1.sdlitm = t6.colitm\n    AND TRIM(t1.sdmcu) = TRIM(t6.comcu)\n    AND ( TRIM(t3.abac01) = TRIM(t4.drky)\n          OR ( TRIM(t3.abac01) IS NULL\n               AND TRIM(t4.drky) IS NULL ) )\n    AND t4.drsy = '01'\n    AND t4.drrt = '01'\n    AND ( TRIM(t3.abac11) = TRIM(t5.drky)\n          OR ( TRIM(t3.abac11) IS NULL\n               AND TRIM(t5.drky) IS NULL ) )\n    AND t5.drsy = '01'\n    AND t5.drrt = '11'\n    AND t2.gllt = 'AA'\n    AND TRIM(t3.abac01) = '6'\n    AND t1.sdfy = '26'\n    AND t2.glfy = '26'\n    AND proddta.julien_to_gregorien(t1.sdivd) BETWEEN TO_DATE('01'\n                                                              || to_char(\n        add_months(sysdate, -1),\n        'MMYYYY'\n    ),\n        'ddmmyyyy') AND last_day(add_months(sysdate, -1))\nORDER BY\n    t1.sdkco,\n    t1.sdfy,\n    t1.sdivd,\n    t1.sddoc,\n    t1.sddct,\n    t1.sdlnid	public	["CSV", "XLSX", "JSON", "XML", "PDF"]	["screen", "email"]	,	2026-04-22 13:45:05.509462+02	2026-04-22 13:45:58.583324+02	1	4	Finance				f
4	xxx	xxx	Select  D.ITM_NO FROM SP.dbo.FD01D D	public	["CSV", "XLSX", "PDF"]	["screen", "email"]	,	2026-04-29 16:38:32.994503+02	2026-04-29 16:51:33.691525+02	1	6	Retail				f
5	CONTRÔLE EAN 26PE DANS STLD	Requête : Contrôle EAN MANQUANT DANS STLD\nFiltré sur la saison 26PE	SELECT\n    TEMPS.SAISON_JDE,\n    TEMPS.Description2,\n    TEMPS.SKU,\n    TEMPS.CODEBARRES_JDE,\n    TEMPS.EAN_STLD\nFROM (\n    SELECT DISTINCT\n        T1.IMITM AS CODE_ITEM,\n        T1.IMLITM AS SKU,\n        T1.IMAITM AS CODEBARRES_JDE,\n        TMP_STL.EAN_STL AS EAN_STLD,\n        TMP_STL.CODEINTERNE AS CODEINTERNEARTICLE,\n        TMP_STL.CODEPRODUIT AS CODEPRODUIT,\n        T1.IMDSC1 AS Description,\n        T1.IMDSC2 AS Description2,\n        T1.IMPRP0 AS SAISON_JDE,\n        TMP_STL.CODESAISEON_STL AS SAISON_STLD,\n        T1.IMSTKT AS Obsolete,\n        T1.IMMPST AS "en production"\n    FROM PRODDTA.F4101@JDE9 T1\n    LEFT JOIN (\n        SELECT \n            A.CODEINTERNEARTICLE AS CODEINTERNE, \n            A.CODEPRODUIT AS CODEPRODUIT, \n            P.nomproduit AS NOMPRODUIT, \n            P.libproduit AS LIBPRODUIT, \n            P.codesaison AS CODESAISEON_STL, \n            A.CODEBARRES AS EAN_STL\n        FROM Storeland.articles A\n        INNER JOIN Storeland.Produits P \n            ON A.CODEPRODUIT = P.CODEPRODUIT\n    ) TMP_STL\n        ON TMP_STL.EAN_STL = TRIM(T1.IMAITM)\n    WHERE T1.IMSTKT <> 'O'\n      AND T1.IMAITM LIKE '354%'\n      AND T1.IMMPST <> '1'\n      AND TRIM(T1.IMPRP0) IS NOT NULL\n      AND TRIM(T1.IMPRP0) <> 'TS'\n) TEMPS\nWHERE TEMPS.EAN_STLD IS NULL \nAND TEMPS.SAISON_JDE = '26PE'\nGROUP BY \n    TEMPS.SAISON_JDE,\n    TEMPS.Description2,\n    TEMPS.SKU,\n    TEMPS.CODEBARRES_JDE,\n    TEMPS.EAN_STLD\nORDER BY \n    TEMPS.SAISON_JDE,\n    TEMPS.Description2,\n    TEMPS.SKU,\n    TEMPS.CODEBARRES_JDE	private	["CSV", "XLSX"]	["screen", "email"]	;	2026-04-29 16:54:20.723645+02	2026-04-30 09:28:09.062855+02	1	7	Retail	Bonjour\n\nC'est un contrôle hebdomadaire porte sur les EAN absents dans Storeland et cible les produits 26PE.\n\nCe rapport est enovyé  par FastReport.\n\nCordialement.\nChia Ching			f
\.


--
-- Data for Name: reports_reportexecution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports_reportexecution (id, parameters, output_type, routing_mode, routing_config, status, started_at, completed_at, result_file, error_message, report_id, user_id) FROM stdin;
1	{}	CSV	screen	{}	success	2026-02-17 15:16:58.055787+01	2026-02-17 15:16:58.131788+01			1	1
27	{"CODEPAYS": {"value": "FR", "operator": "="}}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-10 14:56:38.417357+02	2026-04-10 14:56:41.988944+02	report_results/2026/04/10/Liste_magasins_20260410_125638.xlsx		1	1
2	{}	XLSX	screen	{}	success	2026-02-17 15:25:00.11723+01	2026-02-17 15:25:00.368491+01	report_results/2026/02/17/Liste_magasins_20260217_142500.xlsx		1	1
15	{"CODEPAYS": {"value": "FR", "operator": "="}}	XLSX	email	{"recipients": ["spatell@simone-perele.fr"]}	success	2026-02-20 16:51:17.071278+01	2026-02-20 16:51:18.419623+01	report_results/2026/02/20/Liste_magasins_20260220_155117.xlsx		1	1
3	{}	CSV	local	{"path": "e:\\\\Temp\\\\"}	success	2026-02-18 11:56:03.197777+01	2026-02-18 11:56:03.530785+01	report_results/2026/02/18/Liste_magasins_20260218_105603.csv		1	1
4	{"CODEPAYS": {"value": "FR", "operator": "="}}	CSV	email	{"recipients": ["moezbc@gmail.com"]}	success	2026-02-18 15:45:27.135036+01	2026-02-18 15:45:28.48788+01	report_results/2026/02/18/Liste_magasins_20260218_144527.csv		1	1
22	{"CODEPAYS": {"value": "FR", "operator": "="}}	CSV	email	{"recipients": ["mmennane@simone-perele.fr"]}	success	2026-04-01 14:58:28.629237+02	2026-04-01 14:58:29.595793+02	report_results/2026/04/01/Liste_magasins_20260401_125828.csv		1	1
5	{"CODEPAYS": {"value": "FR", "operator": "!="}}	CSV	email	{"recipients": ["cviolot@simone-perele.fr"]}	success	2026-02-19 16:09:43.884116+01	2026-02-19 16:09:45.55649+01	report_results/2026/02/19/Liste_magasins_20260219_150943.csv		1	1
16	{"CODEPAYS": {"value": "FR", "operator": "!="}}	PDF	screen	{}	success	2026-03-05 17:27:20.973543+01	2026-03-05 17:27:21.174543+01			1	1
6	{"CODEPAYS": {"value": "FR", "operator": "="}}	PDF	screen	{}	success	2026-02-19 16:13:39.901194+01	2026-02-19 16:13:40.112193+01			1	1
7	{"CODEPAYS": {"value": "FR", "operator": "!="}}	CSV	email	{"recipients": ["cviolot@simone-perele.fr"]}	success	2026-02-19 16:15:00.129322+01	2026-02-19 16:15:01.426302+01	report_results/2026/02/19/Liste_magasins_20260219_151500.csv		1	1
28	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-11 11:00:00.208192+02	2026-04-11 11:00:04.253434+02	report_results/2026/04/11/Rapport_Ticket_Vente_ESP_J-1_20260411_090000.xlsx		2	1
8	{"CODEPAYS": {"value": "DE", "operator": "="}}	XLSX	screen	{}	success	2026-02-19 16:16:14.594816+01	2026-02-19 16:16:14.678818+01			1	1
17	{"CODEPAYS": {"value": "FR", "operator": "="}}	CSV	screen	{}	success	2026-04-01 14:44:17.209617+02	2026-04-01 14:44:17.747008+02			1	1
9	{"CODEPAYS": {"value": "BE", "operator": "="}}	CSV	screen	{}	success	2026-02-19 16:16:44.425548+01	2026-02-19 16:16:44.475546+01			1	1
10	{"CODEPAYS": {"value": "FR", "operator": "!="}}	CSV	screen	{}	success	2026-02-20 13:17:31.441982+01	2026-02-20 13:17:31.57393+01			1	1
18	{"CODEPAYS": {"value": "TNDD", "operator": "="}}	CSV	email	{"recipients": ["mmennane@simone-perele.fr"]}	success	2026-04-01 14:49:44.43972+02	2026-04-01 15:51:39.602511+02	report_results/2026/04/01/Liste_magasins_20260401_124944.csv	Aucun enregistrement trouvé. Génération et routage ignorés.	1	1
11	{"CODEPAYS": {"value": "FR", "operator": "!="}}	CSV	screen	{}	success	2026-02-20 14:42:01.062818+01	2026-02-20 14:42:01.200821+01			1	1
26	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-10 14:54:54.900901+02	2026-04-10 14:57:02.132655+02	report_results/2026/04/10/Rapport_Ticket_Vente_ESP_J-1_20260410_125454_Opu7VR1.xlsx	[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'smtp.simone-perele.fr'. (_ssl.c:1010)	2	1
12	{"CODEPAYS": {"value": "FR", "operator": "!="}}	CSV	screen	{}	success	2026-02-20 16:47:20.915394+01	2026-02-20 16:47:20.980396+01			1	1
13	{"CODEPAYS": {"value": "FR", "operator": "="}}	PDF	email	{"recipients": ["spatell@simone-perele.fr"]}	success	2026-02-20 16:49:29.893372+01	2026-02-20 16:49:32.308183+01	report_results/2026/02/20/Liste_magasins_20260220_154929.pdf		1	1
14	{"CODEPAYS": {"value": "FR", "operator": "!="}}	CSV	screen	{}	success	2026-02-20 16:50:00.128806+01	2026-02-20 16:50:00.229809+01	report_results/2026/02/20/Liste_magasins_20260220_155000.csv		1	1
19	{"CODEPAYS": {"value": "FRRR", "operator": "="}}	CSV	email	{"recipients": ["mmennane@simone-perele.fr"]}	success	2026-04-01 14:54:37.668848+02	2026-04-01 14:54:39.280128+02	report_results/2026/04/01/Liste_magasins_20260401_125437.csv		1	1
20	{"CODEPAYS": {"value": "FRRR", "operator": "="}}	CSV	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	success	2026-04-01 14:56:58.540997+02	2026-04-01 14:56:59.05402+02		Aucun enregistrement trouvé. Génération et routage ignorés.	1	1
23	{"CODEPAYS": {"value": "FR", "operator": "="}}	CSV	email	{"recipients": ["moezbc@gmail.com"]}	success	2026-04-09 16:57:06.878421+02	2026-04-09 16:57:08.537296+02	report_results/2026/04/09/Liste_magasins_20260409_145706.csv		1	1
21	{"CODEPAYS": {"value": "FR", "operator": "="}}	CSV	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	success	2026-04-01 14:57:41.11779+02	2026-04-01 14:57:42.365284+02	report_results/2026/04/01/Liste_magasins_20260401_125741.csv		1	1
24	{}	csv	email	{"recipients": ["test@example.com"]}	pending	2026-04-10 10:23:30.638134+02	\N			1	1
25	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-10 11:42:38.643866+02	2026-04-10 11:42:40.610174+02	report_results/2026/04/10/Rapport_Ticket_Vente_ESP_J-1_20260410_094238.xlsx		2	1
30	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-13 11:00:00.136703+02	2026-04-13 11:00:04.086374+02	report_results/2026/04/13/Rapport_Ticket_Vente_ESP_J-1_20260413_090000.xlsx		2	1
29	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-12 11:00:00.140931+02	2026-04-12 11:00:00.417166+02		Aucun enregistrement trouvé. Génération et routage ignorés.	2	1
31	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-14 11:00:00.182825+02	2026-04-14 11:00:04.137096+02	report_results/2026/04/14/Rapport_Ticket_Vente_ESP_J-1_20260414_090000.xlsx		2	1
32	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-15 11:00:00.153084+02	2026-04-15 11:00:04.157242+02	report_results/2026/04/15/Rapport_Ticket_Vente_ESP_J-1_20260415_090000.xlsx		2	1
33	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-16 11:00:00.120094+02	2026-04-16 11:00:04.422126+02	report_results/2026/04/16/Rapport_Ticket_Vente_ESP_J-1_20260416_090000.xlsx		2	1
44	{"CODEPAYS": {"value": "ES", "operator": "="}}	XLSX	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	success	2026-04-30 11:04:21.409785+02	2026-04-30 11:04:25.261657+02	report_results/2026/04/30/Liste_magasins_20260430_090421.xlsx		1	1
34	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-17 11:00:00.144784+02	2026-04-17 11:00:04.302599+02	report_results/2026/04/17/Rapport_Ticket_Vente_ESP_J-1_20260417_090000.xlsx		2	1
45	{"CODEPAYS": {"value": "ES", "operator": "="}}	XLSX	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	success	2026-04-30 11:08:37.1131+02	2026-04-30 11:08:40.855095+02	report_results/2026/04/30/Liste_magasins_20260430_090837.xlsx		1	1
36	{}	XLSX	email	{"recipients": ["mmennane@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	success	2026-04-22 13:47:37.143487+02	2026-04-22 13:49:44.260956+02	report_results/2026/04/22/Fichier_analyse_de_la_marge_commercial_20260422_114737.xlsx		3	1
46	{"CODEPAYS": {"value": "ES", "operator": "="}}	XLSX	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	success	2026-04-30 11:20:47.053866+02	2026-04-30 11:20:50.788246+02	report_results/2026/04/30/Liste_magasins_20260430_092047.xlsx		1	1
35	{}	XLSX	email	{"recipients": ["mmennane@simone-perele.fr;mbouchriha@simone-perele.fr"]}	failed	2026-04-22 13:47:06.297275+02	2026-04-22 13:54:00.281539+02		Invalid address; only mmennane@simone-perele.fr could be parsed from "mmennane@simone-perele.fr;mbouchriha@simone-perele.fr"	3	1
47	{"CODEPAYS": {"value": "ES", "operator": "="}}	XLSX	email	{"recipients": ["mbouchriha@simone-perele.fr"], "embed_results": true, "email_body_footer": "Cordialement\\nMoez", "email_body_header": "Bonjour\\nVeuillez trouver ci joint le rapport dans le corps du mail ;)"}	success	2026-04-30 11:53:23.504046+02	2026-04-30 11:53:27.275079+02	report_results/2026/04/30/Liste_magasins_20260430_095323.xlsx		1	1
37	{"CODEPAYS": {"value": "FR", "operator": "="}}	PDF	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	success	2026-04-29 15:00:00.231238+02	2026-04-29 15:00:04.104419+02	report_results/2026/04/29/Liste_magasins_20260429_130000.pdf		1	1
38	{}	CSV	screen	{}	success	2026-04-29 16:50:41.269102+02	2026-04-29 16:50:42.724197+02			4	1
39	{}	PDF	screen	{}	success	2026-04-29 16:51:45.263006+02	2026-04-29 16:51:46.192828+02			4	1
48	{"CODEPAYS": {"value": "ES", "operator": "="}}	CSV	email	{"recipients": ["cviolot@simone-perele.fr"], "embed_results": true, "email_body_footer": "Cordialement\\nMBO", "email_body_header": "Bonjour,\\n\\nC'est joint un exemple de rapport dans le corps du mail (limite 100 lignes)\\n"}	success	2026-04-30 12:00:36.870208+02	2026-04-30 12:00:40.856729+02	report_results/2026/04/30/Liste_magasins_20260430_100036.csv		1	1
40	{}	CSV	screen	{}	failed	2026-04-29 17:04:36.071181+02	2026-04-29 17:04:36.230463+02		ORA-00933: la commande SQL ne se termine pas correctement	5	1
41	{}	CSV	screen	{}	failed	2026-04-29 17:29:42.508271+02	2026-04-29 17:29:42.550282+02		ORA-00911: caractère non valide	5	1
42	{}	CSV	email	{"recipients": ["cviolot@simone-perele.fr"]}	success	2026-04-29 17:35:01.041151+02	2026-04-29 17:35:06.359964+02	report_results/2026/04/29/CONTRÔLE_EAN_DANS_STLD_20260429_153501.csv		5	1
49	{}	XLSX	screen	{"embed_results": false, "email_body_footer": "", "email_body_header": ""}	success	2026-04-30 12:05:20.281918+02	2026-04-30 12:05:37.291061+02			5	1
43	{}	CSV	email	{"recipients": ["cviolot@simone-perele.fr"]}	success	2026-04-30 08:59:00.174728+02	2026-04-30 08:59:21.710346+02	report_results/2026/04/30/CONTRÔLE_EAN_DANS_STLD_20260430_065900.csv		5	1
\.


--
-- Data for Name: reports_reportparameter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports_reportparameter (id, name, label, param_type, operators, default_value, required, "order", enum_values, report_id) FROM stdin;
5	CODEPAYS	Code Pays	string	["=", "IN", "!=", "LIKE"]	ES	f	0	[]	1
\.


--
-- Data for Name: reports_reportpermission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports_reportpermission (id, can_execute, can_modify, group_id, report_id, user_id) FROM stdin;
1	t	t	3	1	\N
\.


--
-- Data for Name: reports_reportschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports_reportschedule (id, parameters, output_type, routing_mode, routing_config, schedule_type, scheduled_at, cron_expression, timezone, is_active, celery_task_id, created_at, updated_at, report_id, user_id) FROM stdin;
1	{}	XLSX	screen	{}	once	2026-02-17 15:25:00+01		Europe/Paris	f	report-schedule-1	2026-02-17 15:21:07.96609+01	2026-02-17 15:21:07.96609+01	1	1
4	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "mbouchriha@simone-perele.fr"]}	recurring	\N	00 11 * * *	Europe/Paris	f	report-schedule-4	2026-04-10 11:39:40.756701+02	2026-04-10 11:39:40.756701+02	2	1
5	{}	CSV	email	{"recipients": ["mmennane@simone-perele.fr"]}	recurring	\N	30 08 1 * *	Europe/Paris	t	report-schedule-5	2026-04-22 13:51:38.117515+02	2026-04-22 13:51:38.117515+02	3	1
6	{"CODEPAYS": {"value": "FR", "operator": "="}}	PDF	email	{"recipients": ["mbouchriha@simone-perele.fr"]}	once	2026-04-29 15:00:00+02		Europe/Paris	f	report-schedule-6	2026-04-29 14:56:00.718907+02	2026-04-29 14:56:00.718907+02	1	1
7	{}	CSV	email	{"recipients": ["cviolot@simone-perele.fr"]}	once	2026-04-30 08:59:00+02		Europe/Berlin	f	report-schedule-7	2026-04-29 17:35:50.04805+02	2026-04-29 17:35:50.04805+02	5	1
9	{}	XLSX	email	{"recipients": ["cviolot@simone-perele.fr", "fjoly@simone-perele.fr"]}	recurring	\N	12 08 * * 2	Europe/Berlin	t	report-schedule-9	2026-04-30 09:34:16.399118+02	2026-04-30 09:34:16.399118+02	5	1
\.


--
-- Data for Name: settings_app_datasource; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings_app_datasource (id, name, db_type, host, port, database_name, username, password, options, is_active, created_at, updated_at) FROM stdin;
3	STLD_tst	oracle	srvcylbdd01	1521	STOR	STORELAND	STORELAND	{}	t	2026-02-17 14:47:34.442414+01	2026-02-17 14:47:34.442414+01
4	JDE_prd	oracle	srvjdepdbdd1	1521	jde9prod	PRODDTA	PRODDTA	{}	t	2026-04-10 11:36:30.063993+02	2026-04-10 11:36:30.063993+02
6	BDD TW ERP	sqlserver	172.30.200.10	1433	SP	sa	_Wocowx01	{}	t	2026-04-29 14:26:58.641104+02	2026-04-29 15:21:11.834157+02
7	STLD_PRD	oracle	172.30.0.50	1521	STOR	STORELAND	STORELAND	{}	t	2026-04-29 17:01:02.248863+02	2026-04-29 17:02:21.944893+02
\.


--
-- Data for Name: settings_app_ftpconfig; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings_app_ftpconfig (id, name, protocol, host, port, username, password, remote_path, is_default, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings_app_smtpconfig; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings_app_smtpconfig (id, name, host, port, username, password, use_tls, from_email, is_default, created_at, updated_at) FROM stdin;
1	FastReport	smtp.gmail.com	587	moez.bouchriha@gmail.com	tlrk dzzo juno qbkj	t	moez.bouchriha@gmail.com	f	2026-02-18 15:42:57.937925+01	2026-04-10 14:38:38.22496+02
2	smtp_SP	smtp.simone-perele.fr	25		T9oodZzKl5n7OUfLD9K3	f	controles@simone-perele.fr	t	2026-04-10 14:34:25.761384+02	2026-04-10 14:56:03.616667+02
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 3, true);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 80, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 2, true);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 4, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_clockedschedule_id_seq', 5, true);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_crontabschedule_id_seq', 4, true);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_intervalschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_periodictask_id_seq', 10, true);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_solarschedule_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 20, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 44, true);


--
-- Name: reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_report_id_seq', 5, true);


--
-- Name: reports_reportexecution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_reportexecution_id_seq', 49, true);


--
-- Name: reports_reportparameter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_reportparameter_id_seq', 5, true);


--
-- Name: reports_reportpermission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_reportpermission_id_seq', 1, true);


--
-- Name: reports_reportschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_reportschedule_id_seq', 9, true);


--
-- Name: settings_app_datasource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_app_datasource_id_seq', 7, true);


--
-- Name: settings_app_ftpconfig_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_app_ftpconfig_id_seq', 1, false);


--
-- Name: settings_app_smtpconfig_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_app_smtpconfig_id_seq', 2, true);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_clockedschedule django_celery_beat_clockedschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_clockedschedule
    ADD CONSTRAINT django_celery_beat_clockedschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_crontabschedule django_celery_beat_crontabschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_crontabschedule
    ADD CONSTRAINT django_celery_beat_crontabschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_intervalschedule django_celery_beat_intervalschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_intervalschedule
    ADD CONSTRAINT django_celery_beat_intervalschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_name_key UNIQUE (name);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictasks django_celery_beat_periodictasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictasks
    ADD CONSTRAINT django_celery_beat_periodictasks_pkey PRIMARY KEY (ident);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq UNIQUE (event, latitude, longitude);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solarschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solarschedule_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: reports_report reports_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_report
    ADD CONSTRAINT reports_report_pkey PRIMARY KEY (id);


--
-- Name: reports_reportexecution reports_reportexecution_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportexecution
    ADD CONSTRAINT reports_reportexecution_pkey PRIMARY KEY (id);


--
-- Name: reports_reportparameter reports_reportparameter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportparameter
    ADD CONSTRAINT reports_reportparameter_pkey PRIMARY KEY (id);


--
-- Name: reports_reportparameter reports_reportparameter_report_id_name_9b06559b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportparameter
    ADD CONSTRAINT reports_reportparameter_report_id_name_9b06559b_uniq UNIQUE (report_id, name);


--
-- Name: reports_reportpermission reports_reportpermission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportpermission
    ADD CONSTRAINT reports_reportpermission_pkey PRIMARY KEY (id);


--
-- Name: reports_reportschedule reports_reportschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportschedule
    ADD CONSTRAINT reports_reportschedule_pkey PRIMARY KEY (id);


--
-- Name: settings_app_datasource settings_app_datasource_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_app_datasource
    ADD CONSTRAINT settings_app_datasource_name_key UNIQUE (name);


--
-- Name: settings_app_datasource settings_app_datasource_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_app_datasource
    ADD CONSTRAINT settings_app_datasource_pkey PRIMARY KEY (id);


--
-- Name: settings_app_ftpconfig settings_app_ftpconfig_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_app_ftpconfig
    ADD CONSTRAINT settings_app_ftpconfig_name_key UNIQUE (name);


--
-- Name: settings_app_ftpconfig settings_app_ftpconfig_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_app_ftpconfig
    ADD CONSTRAINT settings_app_ftpconfig_pkey PRIMARY KEY (id);


--
-- Name: settings_app_smtpconfig settings_app_smtpconfig_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_app_smtpconfig
    ADD CONSTRAINT settings_app_smtpconfig_name_key UNIQUE (name);


--
-- Name: settings_app_smtpconfig settings_app_smtpconfig_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_app_smtpconfig
    ADD CONSTRAINT settings_app_smtpconfig_pkey PRIMARY KEY (id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_celery_beat_periodictask_clocked_id_47a69f82; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_clocked_id_47a69f82 ON public.django_celery_beat_periodictask USING btree (clocked_id);


--
-- Name: django_celery_beat_periodictask_crontab_id_d3cba168; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_crontab_id_d3cba168 ON public.django_celery_beat_periodictask USING btree (crontab_id);


--
-- Name: django_celery_beat_periodictask_interval_id_a8ca27da; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_interval_id_a8ca27da ON public.django_celery_beat_periodictask USING btree (interval_id);


--
-- Name: django_celery_beat_periodictask_name_265a36b7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_name_265a36b7_like ON public.django_celery_beat_periodictask USING btree (name varchar_pattern_ops);


--
-- Name: django_celery_beat_periodictask_solar_id_a87ce72c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_solar_id_a87ce72c ON public.django_celery_beat_periodictask USING btree (solar_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: reports_report_datasource_id_47306062; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_report_datasource_id_47306062 ON public.reports_report USING btree (datasource_id);


--
-- Name: reports_report_owner_id_45bf5b4d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_report_owner_id_45bf5b4d ON public.reports_report USING btree (owner_id);


--
-- Name: reports_reportexecution_report_id_0406ed5a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportexecution_report_id_0406ed5a ON public.reports_reportexecution USING btree (report_id);


--
-- Name: reports_reportexecution_user_id_4a59778b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportexecution_user_id_4a59778b ON public.reports_reportexecution USING btree (user_id);


--
-- Name: reports_reportparameter_report_id_03e6f3de; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportparameter_report_id_03e6f3de ON public.reports_reportparameter USING btree (report_id);


--
-- Name: reports_reportpermission_group_id_7a6dc31b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportpermission_group_id_7a6dc31b ON public.reports_reportpermission USING btree (group_id);


--
-- Name: reports_reportpermission_report_id_2adc118a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportpermission_report_id_2adc118a ON public.reports_reportpermission USING btree (report_id);


--
-- Name: reports_reportpermission_user_id_08aadd37; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportpermission_user_id_08aadd37 ON public.reports_reportpermission USING btree (user_id);


--
-- Name: reports_reportschedule_report_id_afe3bd17; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportschedule_report_id_afe3bd17 ON public.reports_reportschedule USING btree (report_id);


--
-- Name: reports_reportschedule_user_id_972eb9ca; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_reportschedule_user_id_972eb9ca ON public.reports_reportschedule USING btree (user_id);


--
-- Name: settings_app_datasource_name_344c75a6_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_app_datasource_name_344c75a6_like ON public.settings_app_datasource USING btree (name varchar_pattern_ops);


--
-- Name: settings_app_ftpconfig_name_3505b725_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_app_ftpconfig_name_3505b725_like ON public.settings_app_ftpconfig USING btree (name varchar_pattern_ops);


--
-- Name: settings_app_smtpconfig_name_e9959ba0_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_app_smtpconfig_name_e9959ba0_like ON public.settings_app_smtpconfig USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_clocked_id_47a69f82_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_clocked_id_47a69f82_fk_django_ce FOREIGN KEY (clocked_id) REFERENCES public.django_celery_beat_clockedschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_crontab_id_d3cba168_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_crontab_id_d3cba168_fk_django_ce FOREIGN KEY (crontab_id) REFERENCES public.django_celery_beat_crontabschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_interval_id_a8ca27da_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_interval_id_a8ca27da_fk_django_ce FOREIGN KEY (interval_id) REFERENCES public.django_celery_beat_intervalschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_solar_id_a87ce72c_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_solar_id_a87ce72c_fk_django_ce FOREIGN KEY (solar_id) REFERENCES public.django_celery_beat_solarschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_report reports_report_datasource_id_47306062_fk_settings_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_report
    ADD CONSTRAINT reports_report_datasource_id_47306062_fk_settings_ FOREIGN KEY (datasource_id) REFERENCES public.settings_app_datasource(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_report reports_report_owner_id_45bf5b4d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_report
    ADD CONSTRAINT reports_report_owner_id_45bf5b4d_fk_auth_user_id FOREIGN KEY (owner_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportexecution reports_reportexecution_report_id_0406ed5a_fk_reports_report_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportexecution
    ADD CONSTRAINT reports_reportexecution_report_id_0406ed5a_fk_reports_report_id FOREIGN KEY (report_id) REFERENCES public.reports_report(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportexecution reports_reportexecution_user_id_4a59778b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportexecution
    ADD CONSTRAINT reports_reportexecution_user_id_4a59778b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportparameter reports_reportparameter_report_id_03e6f3de_fk_reports_report_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportparameter
    ADD CONSTRAINT reports_reportparameter_report_id_03e6f3de_fk_reports_report_id FOREIGN KEY (report_id) REFERENCES public.reports_report(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportpermission reports_reportpermis_report_id_2adc118a_fk_reports_r; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportpermission
    ADD CONSTRAINT reports_reportpermis_report_id_2adc118a_fk_reports_r FOREIGN KEY (report_id) REFERENCES public.reports_report(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportpermission reports_reportpermission_group_id_7a6dc31b_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportpermission
    ADD CONSTRAINT reports_reportpermission_group_id_7a6dc31b_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportpermission reports_reportpermission_user_id_08aadd37_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportpermission
    ADD CONSTRAINT reports_reportpermission_user_id_08aadd37_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportschedule reports_reportschedule_report_id_afe3bd17_fk_reports_report_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportschedule
    ADD CONSTRAINT reports_reportschedule_report_id_afe3bd17_fk_reports_report_id FOREIGN KEY (report_id) REFERENCES public.reports_report(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: reports_reportschedule reports_reportschedule_user_id_972eb9ca_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports_reportschedule
    ADD CONSTRAINT reports_reportschedule_user_id_972eb9ca_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

\unrestrict o8Gi78jvaCzBhjDSZRKozjEVBNTWh24cbpkgMKo69k95jV0xhpwCWAFVYGhoayg

