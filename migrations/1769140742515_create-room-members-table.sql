-- Up Migration
CREATE TABLE IF NOT EXISTS public.room_members
(
    userid integer,
    roomid uuid,
    CONSTRAINT room_members_pk PRIMARY KEY (userid, roomid)
);

ALTER TABLE IF EXISTS public.room_members
    ADD CONSTRAINT room_members_room_fk FOREIGN KEY (roomid)
    REFERENCES public.rooms (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.room_members
    ADD CONSTRAINT room_members_users_fk FOREIGN KEY (userid)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;

-- Down Migration
DROP TABLE IF EXISTS public.room_members