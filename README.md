# Examination 3 1DV523

Building and deploying an application handeling GitHub issues.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for testing purposes.
I also go through the deployment phase.

## Installing

Before running the application run the following commands:

```
$ npm install
```

Install ngrok and execute following command

```./ngrok http 3000```

the outside world can now listen to your local application with your magical ip-address 
that ngrok will present for you. 

##Run application

Run application with the following command

```
$ npm nodemon server.js 3000
```

## Deploy application

I used a reversed proxy for my deployment my application to Digital Ocean.

Start with installing nginx at your droplet with the following command

```
$ sudo apt-get update
$ sudo apt-get install nginx
```

Make a https certificate at https://letsencrypt.org/.
Their tutorials are easy so you will have a certificate in no time.

Save your certification to the following folders at your droplet: 

``
 /etc/letsencrypt/live/your-url.se/ 
 /etc/letsencrypt/live/your-url.se/
``

Configure your reversed proxy in a config file with your own config or use the one I provide

```
server {
        listen 80;
        server_name yours.se www.yours.se;
        return 301 https://$server_name$request_uri; 
}

server {
        listen 443 ssl;
        ssl on;
        ssl_certificate /etc/letsencrypt/live/your-url.se/cert.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-url.se/privkey.pem;
        server_name yours.se www.yours.se;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        gzip on;
        gzip_comp_level 6;
        gzip_vary on;
        gzip_min_length  1000;
        gzip_proxied any;
        gzip_types text/plain text/html text/css application/json application/x-javascript text/xml applicat$
        gzip_buffers 16 8k;

        location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|media/|static/|robots.txt|humans$
                root /var/www/wsApp/public;
                access_log off;
                expires max;
        }

        location / {
                proxy_pass http://127.0.0.1:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```

REMINDER: Use Strict-Transport-Security(HSTS)
 
HSTS addresses the following threats:
      
`* man-in-the-middle attacks`

I am using PM" as a process manager but you are free to use the one you like the most. 
However PM2 will already be installed at your droplet though I have included it in the dependencies.

Anyhow you should install PM2 globally!

You need to install the application and you have a few options you can either clone the repo:

or you can provide the application in a zip file and unzip it in the directory or my choice. 

My choice was pushing repo directly up to my production server. 

Now you can start your application

By now you need your Client Id and Client Secret start the server like this:

`$ service nginx start

`$ pm2 CLIENT_ID=yourclientid CLIENT_SECRET=yoursuperdupersecretclientsecret start server.js``

Now you´re up and running!








/Ekerot

 
 
 
