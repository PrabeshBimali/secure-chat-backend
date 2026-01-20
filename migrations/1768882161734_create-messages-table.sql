-- Up Migration
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

CREATE TABLE IF NOT EXISTS public.messages
(
    id uuid DEFAULT gen_random_uuid(),
    ciphertext text NOT NULL,
    iv character varying(255) NOT NULL,
    is_edited boolean NOT NULL DEFAULT false,
    is_deleted boolean NOT NULL DEFAULT false,
    status message_status NOT NULL DEFAULT 'sent',
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    senderid integer NOT NULL,
    roomid uuid NOT NULL,
    replyid uuid DEFAULT NULL,
    CONSTRAINT messages_pk PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.messages
    ADD CONSTRAINT messages_users_fk FOREIGN KEY (senderid)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.messages
    ADD CONSTRAINT messages_rooms_fk FOREIGN KEY (roomid)
    REFERENCES public.rooms (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE IF EXISTS public.messages
    ADD CONSTRAINT messages_reply_fk FOREIGN KEY (replyid)
    REFERENCES public.messages (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL
    NOT VALID;

CREATE INDEX idx_messages_room_timeline ON public.messages (roomid, created_at DESC);

-- Down Migration
DROP TABLE public.messages