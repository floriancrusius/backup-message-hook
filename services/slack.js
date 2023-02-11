const fs = require("fs");
const axios = require("axios");
const path = require("path");
const { timestamp } = require("../helper");

const channels = process.env.SLACK_CHANNEL_ID;
const SlackClient = axios.create({
  baseURL: "https://slack.com/api",
  headers: {
    Authorization: `Bearer ${process.env.SLACK_SECRET}`,
    "Content-Type": "application/json",
  },
});

const sendFileToSlack = async (data) =>
  await new Promise((resolve, reject) => {
    if (!process.env.SLACK_SECRET) {
      timestamp(
        "No slack secret found. Please set the SLACK_SECRET environment variable.",
        "error"
      );
      process.exit(-3);
    }
    if (!process.env.SLACK_CHANNEL_ID) {
      timestamp(
        "No slack channel id found. Please set the SLACK_CHANNEL_ID environment variable.",
        "error"
      );
      process.exit(-3);
    }
    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", data, "image.png");
    form.append("initial_comment", "Backups");
    form.append("channels", channels);

    try {
      const result = SlackClient.post("/files.upload", form, {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_SECRET}`,
          "Content-Type":
            "multipart/form-data; boundary=---011000010111000001101001",
        },
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

const sendFileFromPathToSlack = async (filePath) =>
  await new Promise((resolve, reject) => {
    if (!process.env.SLACK_SECRET) {
      timestamp(
        "No slack secret found. Please set the SLACK_SECRET environment variable.",
        "error"
      );
      process.exit(-3);
    }
    if (!process.env.SLACK_CHANNEL_ID) {
      timestamp(
        "No slack channel id found. Please set the SLACK_CHANNEL_ID environment variable.",
        "error"
      );
      process.exit(-3);
    }
    if (!fs.existsSync(filePath)) {
      timestamp("File not found", "error");
      process.exit(-3);
    }
    const file = new fs.createReadStream(filePath);

    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", file, path.basename(filePath));
    form.append("initial_comment", "Backups");
    form.append("channels", channels);
    try {
      const result = SlackClient.post("/files.upload", form, {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_SECRET}`,
          "Content-Type":
            "multipart/form-data; boundary=---011000010111000001101001",
        },
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

const postToSlack = async (data) =>
  await new Promise((resolve, reject) => {
    const defaultData = {
      channel: channels,
    };
    const postData = JSON.stringify(
      Object.assign(
        defaultData,
        typeof data === "string" ? JSON.parse(data) : data
      )
    );
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_SECRET}`,
        "Content-Type": "application/json",
        "Content-Length": postData.length,
      },
    };
    try {
      const result = SlackClient.post("/chat.postMessage", postData, options);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

module.exports = { sendFileToSlack, postToSlack, sendFileFromPathToSlack };
