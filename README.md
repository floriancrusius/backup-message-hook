# backup-message-hook

A simple webhook service to catch multiple backup messages from different servers
and send them to a single chat at specific time.

## Pre-requisites

- node 18
- pm2 (optionally to run the service as a daemon)
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
