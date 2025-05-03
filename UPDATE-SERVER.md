<!-- How to update the EC2 instance to use the latest version of the repository -->
<!-- Make sure you pass all typechecks. Test with "npx tsc" -->
<!-- Make sure github has the lastest commit on the main branch -->

<!-- Now from the EC2 instance enter the following -->

git pull origin main

npm i

npm run build

<!-- use 'pm2' to see what the ID is of the current server program. use that ID for the following commands -->

pm2 stop ID

pm2 delete ID

pm2 start npm --name "omnilore-nextjs-app" -- start

<!-- now the updates should be refelected immediately on db.omnilore.org -->
