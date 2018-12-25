-- Table: vrs.users

DROP TABLE IF EXISTS vrs.users;

CREATE TABLE vrs.users
(
  id uuid NOT NULL,
  login character varying(50) NOT NULL,
  password text NOT NULL,
  created timestamp without time zone NOT NULL,
  updated timestamp without time zone,
  version smallint NOT NULL DEFAULT 1,
  locked boolean NOT NULL DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_login_key UNIQUE (login)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE vrs.users
  OWNER TO vrs;
