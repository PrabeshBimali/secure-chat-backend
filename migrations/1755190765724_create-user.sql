-- Up Migration
CREATE TABLE IF NOT EXISTS public.users
(
    id serial,
    username character varying(36) NOT NULL,
    email character varying(254) NOT NULL,
    password_hash character varying(60) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT unique_email UNIQUE (email)
);

-- Down Migration
DROP TABLE users;