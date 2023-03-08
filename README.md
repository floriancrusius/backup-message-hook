# backup-message-hook

A simple webhook service to catch multiple backup messages from different servers
and send them to a single chat at specific time.

## Pre-requisites

- node 18
- pm2 (optionally to run the service as a daemon)
- headless chrome (to generate images from html) because modul uses puppeteer under the hood
- slack bot with the following permissions:
  - chat:write
  - chat:write.public
  - files:write
- slack bot token (xoxb-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx)

## Installation

```bash
git clone
cd backup-message-hook
npm install

# optional
npm install -g pm2
pm2 install pm2-logrotate #(to rotate logs)
```

### Install headless chrome

from puppeteer [troubleshooting](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md) page:

```bash
sudo apt-get update
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

## Configuration

```bash
cp .env.example .env
```

Edit the `.env` file and add the following values

- `PORT=` (port to run the service on)
- `SECRET=` (secret to be used to authenticate the webhook)
- `SLACK_SECRET=` (slack bot token)
- `SLACK_CHANNEL_ID=` (slack channel id to send the messages to)
- `CRON_TIME=` (cron time to send the messages to slack)

## Usage

```bash
npm start
```

or

```bash
pm2 start index.js
```

## Example curl command to test the service

secret in curl command needs to be encrypted using hmac-md5 algorithm

```bash
curl -H "x-hub-signature:md5=4bce900621e07ad66ba799ce1d4aec36" -X POST "localhost:8080" -d "{\"domain\":\"example.com\",\"backupPath\":\"2023-01-01 00:00:00\",\"backupDate\":\"/var/www/example.com/backups/2023-01-01_00-00-00.tar.gz\"}"
```

## Example slack message

![](example.png)
