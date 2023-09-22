# connect to aws ec2 
Url endpoint
Instance ID
i-0d8aa7961b2f36fe1 (itra)
Open an SSH client.

Locate your private key file. The key used to launch this instance is itra-ec2-key-pair.pem

Run this command, if necessary, to ensure your key is not publicly viewable.
 chmod 400 itra-ec2-key-pair.pem

Connect to your instance using its Public DNS:
 ec2-13-200-79-156.ap-south-1.compute.amazonaws.com

Example:

 ssh -i "itra-ec2-key-pair.pem" ec2-user@ec2-13-200-79-156.ap-south-1.compute.amazonaws.com



## Pocketbase 
url : http://ec2-13-200-79-156.ap-south-1.compute.amazonaws.com:5000/_/
username/email : rutikthakre@gmail.com
cred : Rutik@123456
service : visiting.service

## wuzapi
url : http://ec2-13-200-79-156.ap-south-1.compute.amazonaws.com:8080/api/
new user command : sqlite3 dbdata/users.db "insert into users ('name','token') values ('narharitayde','narharitayde22')"
show all recored : sqlite3 dbdata/users.db "SELECT * FROM users"
login url : http://ec2-13-200-79-156.ap-south-1.compute.amazonaws.com:8080/login/?token=
service : wuzapi.service

## cronapp
url : http://ec2-13-200-79-156.ap-south-1.compute.amazonaws.com:3333
service : cronapp.service

[Unit]
Description=Making your environment variables rad

After=network.target

[Service]
Environment=NODE_PORT=3001
Type=simple
User=ubuntu
ExecStart=/usr/bin/node /home/ec2-user/cronapp/dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

Description = cronapp

[Service]
Type           = simple
User           = root
Group          = root
LimitNOFILE    = 4096
Restart        = always
RestartSec     = 5s
ExecStart      = /usr/bin/node /home/ec2-user/cronapp2/dist/index.js

[Install]
WantedBy = multi-user.target



###########################################################################
Ater deploying to ec2 we will need to use https to acces the endpoint 
after deployment so use api gateway
guide link  https://www.youtube.com/watch?v=d1wHFqfMAGY

###########################################################################





