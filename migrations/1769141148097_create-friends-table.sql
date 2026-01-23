-- Up Migration
CREATE TYPE friendship_status AS ENUM ('pending', 'friends', 'blocked');

CREATE TABLE IF NOT EXISTS public.friends
(
    user_1_id integer,
    user_2_id integer,
    requester_id integer NOT NULL,
    status friendship_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    roomid uuid NOT NULL,
    blocked_by integer DEFAULT NULL,
    CONSTRAINT friends_pk PRIMARY KEY (user_1_id, user_2_id),
    CONSTRAINT canonical_id_order CHECK (user_1_id < user_2_id),
    CONSTRAINT requester_must_be_participant CHECK (requester_id = user_1_id OR requester_id = user_2_id),
    CONSTRAINT blocked_by_must_be_participant CHECK (blocked_by = user_1_id OR blocked_by = user_2_id)
);

ALTER TABLE IF EXISTS public.friends
    ADD CONSTRAINT friends_users_fk_1 FOREIGN KEY (user_1_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.friends
    ADD CONSTRAINT friends_user_fk_2 FOREIGN KEY (user_2_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE IF EXISTS public.friends
    ADD CONSTRAINT requester_user_fk FOREIGN KEY (requester_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE IF EXISTS public.friends
    ADD CONSTRAINT blockedby_user_fk FOREIGN KEY (blocked_by)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL
    NOT VALID;


ALTER TABLE IF EXISTS public.friends
    ADD CONSTRAINT friends_rooms_fk FOREIGN KEY (roomid)
    REFERENCES public.rooms (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


-- Down Migration
DROP TABLE IF EXISTS public.friends;
DROP TYPE IF EXISTS friendship_status;