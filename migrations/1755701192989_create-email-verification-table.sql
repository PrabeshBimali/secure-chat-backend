-- Up Migration
CREATE TABLE IF NOT EXISTS public.email_verification_token
(
    id character varying,
    userid integer NOT NULL,
    token character varying NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT pk_email_verification_token PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.email_verification_token
    ADD CONSTRAINT fk_email_verification_token_user FOREIGN KEY (userid)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;

-- Down Migration
DROP TABLE email_verification_token;