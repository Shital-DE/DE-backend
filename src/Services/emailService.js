const nodemailer = require("nodemailer");
const express = require("express");
const properties = require("properties");
const { selectDBQuery, executeDBQuery } = require("../Utils/crud");
const AppError = require("../Utils/ErrorHandling/appErrors");
const { NOT_FOUND, UNAUTHORIZED } = require("../Utils/Constants/errorCodes");
const { queryPath } = require("../Utils/Constants/query.path");
const app = express();
app.use(express.json());

getRecipientList = async () => {
  try {
    const query = await getOutsourceProperties();

    var emailListQuery = query.outsource_email.replace(/\n/g, " ");

    const emailList = await selectDBQuery(emailListQuery);

    var toList = [];
    var ccList = [];
    var recipients = [];

    emailList.forEach((element) => {
      if (element.recipientas == "to") {
        toList.push(element.email);
      }
      if (element.recipientas == "cc") {
        ccList.push(element.email);
      }
    });

    recipients.push({
      to: toList,
      cc: ccList,
    });

    return recipients;
  } catch (error) {
    throw error;
  }
};

sendNodeMail = async function (data, filename) {
  const mailReceiverList = await getRecipientList();

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: process.env.EMAIL_USER, // sender address
      to: mailReceiverList[0].to, // list of receivers
      cc: mailReceiverList[0].cc,
      bcc: ["rohini.mane@genesis-tech.in"], //temporary testing purpose  , "nilesh.desai@genesis-tech.in"
      subject: "Outsource Challan", // Subject line
      text: `Outsource Challan No : "${filename}"`,
      attachments: [
        {
          filename: `${filename}.pdf`,
          content: Buffer.from(data),
        },
      ],
    },
    (error, info) => {
      if (error) {
        return "failed";
      } else {
        return "ok";
      }
    }
  );
};

async function getOutsourceProperties() {
  return new Promise((resolve, reject) => {
    properties.parse(
      queryPath[18].OUTSOURCE,
      { path: true },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = { sendNodeMail };
