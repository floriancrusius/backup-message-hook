const nodeHtmlToImage = require("node-html-to-image");

/**
 * @returns
 */
const generateStyling = () => {
  const styling = `
    <style>
    body {
        min-width: fit-content;
        height: fit-content;
        padding: 5px;
    }
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th, td {
        padding: 15px;
        text-align: left;
        white-space: nowrap;
    }
    </style>
    `;
  return styling;
};

/**
 * @param {{domain: string, backupDate: string, backupPath: string}} data
 * @returns {string}
 */
const generateRow = (data) => {
  const row = `
    <tr>
        <td>${data.domain}</td>
        <td>${data.backupDate}</td>
        <td>${data.backupPath}</td>
    </tr>
    `;
  return row;
};

/**
 * @returns {string}
 */
const generateHeader = () => {
  const header = `
    <tr>
        <th>environment</th>
        <th>last succesful backup</th>
        <th>path</th>
    </tr>
    `;
  return header;
};

/**
 * @param {{domain: string, backupDate: string, backupPath: string}[]} data
 * @returns {string}
 * @example
 * generateTable([{domain: "test", backupDate: "test", backupPath: "test"}])
 */
const generateTable = (data) => {
  const table = `
    <table>
        ${generateHeader()}
        ${data.map(generateRow).join("")}
    </table>
    `;
  return table;
};

/**
 * @param {{domain: string, backupDate: string, backupPath: string}[]} data
 * @returns {string}
 */
const generateHtml = (data) => {
  const html = `
    <html>
        <head>
            ${generateStyling()}
        </head>
        <body>
            ${generateTable(data)}
        </body>
    </html>
    `;
  return html;
};

/**
 * @param {{domain: string, backupDate: string, backupPath: string}[]} data
 * @returns {Promise<Buffer>}
 * @example
 * generateImage([{domain: "test", backupDate: "test", backupPath: "test"}])
 * .then((image) => {
 *  // do something with image
 * })
 */
const generateImage = async (data) =>
  await new Promise((resolve, reject) => {
    try {
      const html = generateHtml(data);
      nodeHtmlToImage({
        html: html,
        puppeteerArgs: { args: ["--no-sandbox"] },
      }).then((data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
module.exports = {
  generateImage,
};
