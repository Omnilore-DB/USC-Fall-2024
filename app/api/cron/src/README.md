### to get the generated typescript types of the supabase database tables and stuff run the command below

make sure to replace HERE with the correct project-id for the supabase project

npx supabase gen types typescript --project-id "HERE" > app/api/cron/src/supabase/generated.types.ts
