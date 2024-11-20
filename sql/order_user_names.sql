-- This backs up the orders table, then clears it out and adds new columns.
-- Once this is done, the Python (hunter-gatherer) program can be restarted to repopulate the table.
BEGIN;

CREATE TABLE IF NOT EXISTS public.orders_backup (
                                                    LIKE public.orders INCLUDING ALL
);

INSERT INTO public.orders_backup
SELECT * FROM public.orders;

TRUNCATE TABLE public.orders RESTART IDENTITY;

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS user_names VARCHAR[],
    ADD COLUMN IF NOT EXISTS user_amounts FLOAT8[];

COMMIT;
