class TimeStamp {
  constructor() {
    this.colors = {
      reset: "\x1b[0m",
      warn: "\x1b[33m",
      error: "\x1b[31m",
      info: "\x1b[32m",
    };
  }

  #colored = (message, color) =>
    `${this.colors[color]}${message}${this.colors.reset}`;

  #twoDigits = (number) => (number <= 9 ? "0" + number : number);
  #timestamp = (data, type = "info") => {
    const date = new Date();
    const year = date.getFullYear();
    const month = this.#twoDigits(date.getMonth() + 1);
    const day = this.#twoDigits(date.getDate());
    const hours = this.#twoDigits(date.getHours());
    const minutes = this.#twoDigits(date.getMinutes());
    const seconds = this.#twoDigits(date.getSeconds());
    const stamp = `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
    console.log(
      stamp,
      typeof data === "string" ? this.#colored(data, type) : data
    );
  };

  info = (data) => this.#timestamp(data, "info");
  warn = (data) => this.#timestamp(data, "warn");
  error = (data) => this.#timestamp(data, "error");
}
module.exports = TimeStamp;
