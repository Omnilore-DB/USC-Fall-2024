This is the repository developed by the Spring 2025 Team and is currently in production on AWS
_________________________________________________________________________________________________________

<!-- already have the elastic IP configured on the EC2 instance with the OS at least Amazon Linux 2023 -->
<!-- for security and keys I selected the preexisting options that are already on our AWS accounts -->
<!-- security group = launch-wizard-1, key name = Cron Job Public/Private Key Pair (RSA) -->

sudo yum install git
sudo yum install nginx
sudo yum install certbot
sudo yum install python3-certbot-nginx

git clone https://github.com/Omnilore-DB/USC-Fall-2024.git omnilore
curl -fsSL https://fnm.vercel.app/install | bash

<!-- read last line of install. should say something like "In order to apply the changes, open a new terminal or run the following command..." -->

fnm install --lts
node -v

<!-- should be v22 or higher -->

sudo nano /etc/nginx/conf.d/db.omnilore.com.conf

<!-- paste the following into the file -->

```
server {
    listen 80;
    server_name db.omnilore.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

<!-- save and exit nano -->

sudo certbot --nginx -d db.omnilore.org

sudo systemctl start nginx
sudo systemctl enable nginx

nano .env

<!-- paste the env variables into the file -->

npm i -g pm2
cd omnilore
npm i

npm run build
pm2 start npm --name "omnilore-nextjs-app" -- start

<!-- you may have to run ```pm2 startup``` to make pm2 auto-boot at server restart and follow any further instructions it gives you like "To setup the Startup Script, copy/paste the following command..." -->
