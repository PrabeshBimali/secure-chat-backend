-- Up Migration
CREATE TABLE IF NOT EXISTS public.rooms
(
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    last_message_at timestamp with time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_rooms PRIMARY KEY (id)
);

-- Down Migration
DROP TABLE IF EXISTS public.rooms;