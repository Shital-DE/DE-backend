const properties = require("properties");
const { queryPath } = require("../Utils/Constants/query.path");
const dbConnect = require("../Config/Database/postgresql_config");
const AppError = require("../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../Utils/Constants/errorCodes");
const nodemailer = require("nodemailer");
const { executeSelectQuery } = require("../Utils/file_read");

const sendReminderOfCalibration = async function sendReminder() {
  try {
    const recipients = await getRecipients();
    const subject = "Reminder: Instrument Calibration Due";
    executeQueryAndCheckReminder()
      .then((message) => {
        if (message == "Send mail.") {
          getCalibrationSchedule()
            .then(async (rows) => {
              if (rows.length > 0) {
                const table = generateTable(rows);
                const content = generateEmailContent({ table: table });
                recipients.forEach(async (recipient) => {
                  await sendEmail({
                    from: "erpdatta@datta.co.in",
                    to: recipient.emailaddress,
                    bcc: "shital.gayakwad@genesis-tech.in", //nilesh.desai@genesis-tech.in
                    subject: subject,
                    content: content,
                  });
                });
                const contentdataString = JSON.stringify(rows, null, 2);
                executeMailHistoryQuery({
                  loginby: "DE",
                  fromrecipient: "erpdatta@datta.co.in",
                  torecipient: `${recipients[0].emailaddress
                    .toString()
                    .trim()}, ${recipients[1].emailaddress
                    .toString()
                    .trim()},${recipients[2].emailaddress.toString().trim()}`,
                  subject: subject,
                  mailcontent: `QA, \n\n Below is a list of instruments that require calibration. \n-- ${contentdataString} --\nBest regards, \n\nDatta Enterprises.`,
                  description: "Calibration - Monthly reminder",
                })
                  .then((result) => {})
                  .catch((error) => {

                  });
              }
            })
            .catch((error) => {});
        }
      })
      .catch((error) => {});
  } catch (e) {

  }
};

async function sendEmail({ from, to, cc, bcc, subject, content, attachments }) {
  try {
    let mailTransporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525,
      auth: {
        user: "erpdatta@datta.co.in",
        pass: "Yae2choo1",
      },
    });
    const info = await mailTransporter.sendMail({
      from: from,
      to: to,
      cc: cc,
      bcc: bcc,
      subject: subject,
      html: content,
      attachments: attachments
    });
    return {
      success: true,
      message: `Email sent: ${info.messageId}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error sending email: ${error.message}`,
    };
  }
}

function generateEmailContent({ table }) {
  const content = `QA,<br> <br> 
                    Below is a list of instruments that require calibration. <br><br>
                    ${table} <br>
                    Best regards, <br> <br>
                    Datta Enterprises.`;
  return content;
}

function extractNameInitials(email) {
  const atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    const name = email.substring(0, atIndex);
    const nameParts = name.split(".");
    if (nameParts.length >= 2) {
      const firstNameInitial = nameParts[0][0].toUpperCase();
      const lastNameInitial = nameParts[nameParts.length - 1][0].toUpperCase();
      return `${firstNameInitial}${lastNameInitial}`;
    }
  }
  return null;
}

async function getRecipients() {
  try {
    const data = await new Promise((resolve, reject) => {
      properties.parse(
        queryPath[37].EVENT_SUBSCRIBER,
        { path: true },
        (error, parsedData) => {
          if (error) {
            reject(error);
          } else {
            resolve(parsedData);
          }
        }
      );
    });

    let query = data.emailaddress.replace(/\n/g, " ");
    query = query.replace(/{recipientas}/g, "fr");
    const result = await new Promise((resolve, reject) => {
      dbConnect.query(query, (error, result2) => {
        if (error) {
          reject(error);
        } else {
          resolve(result2.rows);
        }
      });
    });
    return result;
  } catch (error) {
    throw new AppError(NOT_FOUND, error, 404);
  }
}

function generateTable(rows) {
  const tableHeader = `
        <table style="border: 1px solid black; border-collapse: collapse;">
            <tr>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Instrument Name </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Instrument Type </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Card Number </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Range </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Calibration Due Date </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Last Calibration Date </th>
            </tr>
    `;

  const tableFooter = "</table>";

  const tableRows = rows
    .map(
      (data) => `
        <tr>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.instrumentname.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.instrumenttype.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.cardnumber.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.measuringrange.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${new Date(
              data.duedate.trim()
            ).toLocaleDateString("en-GB")} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${new Date(
              data.startdate.trim()
            ).toLocaleDateString("en-GB")} </td>
        </tr>
    `
    )
    .join("");

  return `${tableHeader}${tableRows}${tableFooter}`;
}

async function getCalibrationSchedule() {
  try {
    const data = await new Promise((resolve, reject) => {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        (error, parsedData) => {
          if (error) {
            reject(error);
          } else {
            resolve(parsedData);
          }
        }
      );
    });
    const result1 = await new Promise((resolve, reject) => {
      dbConnect.query(
        `${data.calibrationMonthReminder}`,
        (error, queryResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(queryResult);
          }
        }
      );
    });

    return result1.rows;
  } catch (error) {
    throw new AppError(NOT_FOUND, error, 404);
  }
}

async function executeQueryAndCheckReminder() {
  try {
    const data = await new Promise((resolve, reject) => {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        (error, parsedData) => {
          if (error) {
            reject(error);
          } else {
            resolve(parsedData);
          }
        }
      );
    });

    const result = await new Promise((resolve, reject) => {
      dbConnect.query(`${data.isReminded}`, (error, queryResult) => {
        if (error) {
          resolve(error);
        } else {
          resolve(queryResult);
        }
      });
    });

    if (result.message == "Send mail.") {
      return "Send mail.";
    } else {
      return result.message;
    }
  } catch (error) {
    return error;
  }
}

const executeMailHistoryQuery = (req) => {
  return new Promise((resolve, reject) => {
    properties.parse(
      queryPath[49].MAIL_HISTORY,
      { path: true },
      function (error, data) {
        if (error) {
          reject(new AppError(NOT_FOUND, error, 404));
        }
        var query = data.insertQuery.replace(/\n/g, " ");
        query = query.replace(/{loginby}/g, req.loginby);
        query = query.replace(/{fromrecipient}/g, req.fromrecipient);
        query = query.replace(/{torecipient}/g, req.torecipient);
        query = query.replace(/{subject}/g, req.subject);
        const escapedRemark = req.mailcontent.replace(/'/g, "''");
        query = query.replace(/{mailcontent}/g, escapedRemark);
        query = query.replace(/{description}/g, req.description);
        var newQuery;
        if (query.query) {
          newQuery = query.query;
        } else {
          newQuery = query;
        }
        dbConnect.query(`${newQuery}`, (error, result) => {
          if (!error) {
            resolve(result.rows);
          } else {
            reject(error);
          }
          dbConnect.end;
        });
      }
    );
  });
};

function generateOrderTable(rows) {
  const tableHeader = `
        <table style="border: 1px solid black; border-collapse: collapse;">
            <tr>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Product </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Product description </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Drawing number </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Instrument description </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Range </th>
                <th style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px; color: black;"> Quantity </th>
            </tr>
    `;

  const tableFooter = "</table>";

  const tableRows = rows
    .map(
      (data) => `
        <tr>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.product.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.productDescription.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.drawingNumber.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.instrumentDescription.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;"> ${data.measuringRange.trim()} </td>
            <td style="text-align: center; border: 1.5px solid black; padding-left: 10px; padding-right: 10px;">${data.quantity.trim()} </td>
        </tr>
    `
    )
    .join("");

  return `${tableHeader}${tableRows}${tableFooter}`;
}

function extractNameFromEmail(email) {
  const match = email.match(/^([^.]+)\.([^.]+)@/);

  if (match && match.length === 3) {
    const capitalizeFirstLetter = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    const firstName = capitalizeFirstLetter(match[1]);
    const lastName = capitalizeFirstLetter(match[2]);

    return firstName + " " + lastName;
  } else {
    return null;
  }
}

function generateOrderEmailContent({ from, to, table }) {
  const content = `${to}, <br>
                    <br> ${table} <br>
                    Best regards, <br><br>
                    ${from}.`;
  return content;
}

async function insertOrders({ content, mailId }) {
  try {
    var result = [];
    var finalresult = new Promise((resolve, reject) => {
      for (let i = 0; i < content.length; i++) {
        properties.parse(
          queryPath[54].PD_PRODUCT_INSTRUMENTORDERS,
          { path: true },
          async function (error, data) {
            if (error) {
              reject(error);
            } else {
              var query = data.insertQuery.replace(/\n/g, " ");
              const item = content[i];
              query = query.replace(/{instrument_id}/g, item.instrumentId);
              query = query.replace(/{quantity}/g, item.quantity);
              query = query.replace(/{mail_id}/g, mailId);
              query = query.replace(
                /{rejectedinstrument_id}/g,
                item.rejectedInstrumentId
              );
              query = query.replace(/{measuringrange}/g, item.measuringRange);
              const newResult = await executeSelectQuery(query);
              result.push(newResult[0]["id"]);
              if (result.length == content.length) {
                resolve("Success");
              }
            }
          }
        );
      }
    });
    return finalresult;
  } catch (error) {
    throw new AppError(NOT_FOUND, error, 404);
  }
}

module.exports = {
  sendReminderOfCalibration,
  sendEmail,
  executeMailHistoryQuery,
  generateOrderTable,
  // capitalizeFirstPart,
  extractNameFromEmail,
  generateOrderEmailContent,
  insertOrders,
  extractNameInitials,
};
