-- Up Migration
CREATE TABLE IF NOT EXISTS public.devices
(
    device_pbk character varying(255) NOT NULL,
    device_name character varying(255) NOT NULL,
    browser character varying(255) NOT NULL,
    os character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    last_seen_at timestamp with time zone NOT NULL DEFAULT NOW(),
    userid integer NOT NULL,
    CONSTRAINT pk_devices PRIMARY KEY (device_pbk)
);

ALTER TABLE IF EXISTS public.devices
    ADD CONSTRAINT fk_devices_user FOREIGN KEY (userid)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

-- Down Migration
DROP TABLE IF EXISTS devices;