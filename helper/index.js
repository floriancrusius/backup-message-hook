const colors = {
  Reset: "\x1b[0m",

  warn: "\x1b[33m",
  error: "\x1b[31m",
  info: "\x1b[32m",
};

const colored = (message, color) => `${colors[color]}${message}${colors.Reset}`;

const twoDigits = (number) => (number <= 9 ? "0" + number : number);
const timestamp = (data, type = "info") => {
  const date = new Date();
  const year = date.getFullYear();
  const month = twoDigits(date.getMonth() + 1);
  const day = twoDigits(date.getDate());
  const hours = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());
  const seconds = twoDigits(date.getSeconds());
  const stamp = `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] `;
  console.log(stamp, typeof data === "string" ? colored(data, type) : data);
};

const getEnv = () => {
  const CRON_TIME = process.env.CRON_TIME || "*/10 * * * * *";
  if (!process.env.CRON_TIME) {
    timestamp(
      "No cron time found. Please set the CRON_TIME environment variable. Defaulting to */10 * * * * *",
      "warn"
    );
  }

  const SECRET = process.env.SECRET;
  const PORT = process.env.PORT || 3000;
  if (!SECRET) {
    timestamp(
      "No secret found. Please set the SECRET environment variable.",
      "error"
    );
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

module.exports = { getEnv, emptyBackupMessage, timestamp };
