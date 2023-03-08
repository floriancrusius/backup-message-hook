const http = require("http");
const crypto = require("crypto");
const { TimeStamp } = require("../helper");
const ts = new TimeStamp();
class Webhook {
  constructor(secret, port) {
    this.backups = [];
    this.SECRET = secret;
    this.PORT = port;
  }
  start() {
    http
      .createServer((req, res) => {
        req.on("data", (chunk) => {
          const signature = `md5=${crypto
            .createHmac("md5", this.SECRET)
            .update(chunk)
            .digest("hex")}`;

          const isAllowed = req.headers["x-hub-signature"] === signature;

          const body = JSON.parse(chunk);
          if (isAllowed) {
            ts.info(
              `Received backup message from ${
                req.socket.remoteAddress ||
                req.headers["x-forwarded-for"] ||
                "-"
              }`
            );
            if (this.backups.length) {
              let found = false;
              this.backups.map((backup) => {
                if (backup.domain === body.domain) {
                  found = true;
                  return {
                    ...backup,
                    backupDate: body.backupDate
                      ? body.backupDate
                      : backup.backupDate,
                    backupPath: body.backupPath ? body.backupPath : "-",
                  };
                } else {
                  return backup;
                }
              });
              if (!found) {
                this.backups.push(body);
              }
            } else {
              this.backups.push(body);
            }
          } else {
            ts.error(
              `Unauthorized request from ${
                req.socket.remoteAddress ||
                req.headers["x-forwarded-for"] ||
                "-"
              }`
            );
          }
        });

        res.end();
      })
      .listen(this.PORT, () => {
        ts.info(`Server started on port ${this.PORT}`);
      });
  }
  getBackups() {
    return this.backups;
  }
}
module.exports = Webhook;
