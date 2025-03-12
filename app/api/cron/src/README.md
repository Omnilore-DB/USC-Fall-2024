new idea

from -> to

raw from keys
Zip Code -> parse for 'zip' -> {isValid: true, data: ...}
Zip -> parse for 'zip' -> {isValid: false, error: ...}

inlcude all valid keys in new table row
missing columns will rely upon raw key-column values

validation error utility can be a key inside raw form ? maybe ?

Check for first name, lastname, email, phone, then address etc
if the first/last match, or email match, or phone match --> found member
try to align the rest of the data. if the data does not match, then MEMBER CONFLICT

use the conflicts.ts to make funciton given 2 member rows be able to tell if there is a conflict.

npx supabase gen types typescript --project-id "HERE" > app/api/cron/src/supabase/generated.types.ts
