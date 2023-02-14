const { generateImage } = require("./services/imageGenerator");
generateImage([
  {
    domain: "example.com",
    backupDate: "2023-01-01 00:00:00",
    backupPath: "/var/www/example.com/backups/2023-01-01_00-00-00.tar.gz",
  },
  {
    domain: "example2.com",
    backupDate: "2023-01-02 00:00:00",
    backupPath: "/var/www/example2.com/backups/2023-01-02_00-00-00.tar.gz",
  },
]);
