require("dotenv").config();
const { getEnv, emptyBackupMessage, TimeStamp } = require("./helper");
const cron = require("node-cron");
const Webhook = require("./services/webhook");
const { generateImage } = require("./services/imageGenerator");
const { sendFileToSlack, postToSlack } = require("./services/slack");

const { CRON_TIME, SECRET, PORT } = getEnv();

const ts = new TimeStamp();
const webhook = new Webhook(SECRET, PORT);
webhook.start();
cron.schedule(CRON_TIME, () => {
  const backups = webhook.getBackups();
  if (backups.length > 0) {
    generateImage(backups)
      .then((image) => {
        sendFileToSlack(image)
          .then((res) => {
            if (res.statusText === "OK") {
              ts.info("Backup messages sent to slack");
            }
          })
          .catch((err) => {
            ts.error(err);
          });
      })
      .catch((err) => ts(err));
  } else {
    ts.info("No backup messages received");
    postToSlack(emptyBackupMessage);
  }
});
