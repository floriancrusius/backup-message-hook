const TimeStamp = require("./timestamp");
const ts = new TimeStamp();

const getEnv = () => {
  const CRON_TIME = process.env.CRON_TIME || "*/10 * * * * *";
  if (!process.env.CRON_TIME) {
    ts.warn(
      "No cron time found. Please set the CRON_TIME environment variable. Defaulting to */10 * * * * *"
    );
  }

  const SECRET = process.env.SECRET;
  const PORT = process.env.PORT || 3000;
  if (!SECRET) {
    ts.error("No secret found. Please set the SECRET environment variable.");
    process.exit(1);
  }
  return { CRON_TIME, SECRET, PORT };
};

const emptyBackupMessage = {
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Info",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "No backup messages received",
      },
    },
  ],
};

module.exports = { getEnv, emptyBackupMessage, TimeStamp };
