/*
 * Author: Swaroopa
 * Date:
 * Purpose:
 *
 */
require("dotenv").config();
const { router } = require("./src/Routes/app");
const { errorHandler } = require("./src/Middlewares/error_handler");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const {
  sendReminderOfCalibration,
} = require("./src/Services/calibration.service");
const cron = require('node-cron');
const script = require("./src/Services/dataTransferETL");
const logger = require("./log/infoLogger");


const app = express();
var corsOptions = {
  origin: "*",
};
const port = process.env.PORT;

app.use(cors(corsOptions));
// Initialise server.js
app.use(express.json({ limit: "50mb" }));

app.use("/", router);
app.use(errorHandler);

//Read the key and certificate files.
//---/home/administrator/workspace.nodejs/ERPX/src/Services/conf/cert.pem
//---/usr/java/jakarta-tomcat/conf/privkey.pem
let privateKey, certificate, chain, fullchain;

// try {
//   privateKey = fs.readFileSync(
//     "/usr/java/jakarta-tomcat/conf/privkey.pem",
//     "utf8"
//   );
//   certificate = fs.readFileSync(
//     "/usr/java/jakarta-tomcat/conf/cert.pem",
//     "utf8"
//   );
//   chain = fs.readFileSync("/usr/java/jakarta-tomcat/conf/chain.pem", "utf8");
//   fullchain = fs.readFileSync(
//     "/usr/java/jakarta-tomcat/conf/fullchain.pem",
//     "utf8"
//   );
// } catch (error) {
//   // logger.error(error);
// }
try {
  privateKey = fs.readFileSync(
    "D:/2024/Node/datta/de_backend/src/Services/conf/privkey.pem",
    "utf8"
  );
  certificate = fs.readFileSync(
    "D:/2024/Node/datta/de_backend/src/Services/conf/cert.pem",
    "utf8"
  );
  chain = fs.readFileSync("D:/2024/Node/datta/de_backend/src/Services/conf/chain.pem", "utf8");
  fullchain = fs.readFileSync(
    "D:/2024/Node/datta/de_backend/src/Services/conf/fullchain.pem",
    "utf8"
  );
} catch (error) {
  // logger.error(error);
}

//create a credentials object.
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: fullchain,
};

//Create an HTTPS service with the express app and the credentials.
const httpsServer = https.createServer(credentials, app);

const now = new Date();
const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
let timeUntilTarget = targetTime.getTime() - now.getTime();

if (timeUntilTarget <= 0) {
  timeUntilTarget += 24 * 60 * 60 * 1000;
}

const executeAtTargetTime = () => {
  sendReminderOfCalibration();
  const nextDayTargetTime = new Date(targetTime.getTime() + 24 * 60 * 60 * 1000);
  const nextDayTimeUntilTarget = nextDayTargetTime.getTime() - now.getTime();
  setTimeout(executeAtTargetTime, nextDayTimeUntilTarget);
};

setTimeout(executeAtTargetTime, timeUntilTarget);

//--------Cron Task-----------//
function stopScheduledTask(taskjob) {
  taskjob.stop(); // Stop the scheduled task
}
const taskjob = cron.schedule('05 12 * * *', async () => {
  try {
    var result = await script.totalcurrenttagid();

    if (result == 'success') {
      logger.info(`${Date(Date.now()).toString()} :sss cron1 executed successfully`, 'utf-8');
    }

    stopScheduledTask(taskjob);
  } catch (e) {
    logger.info(e);
  }
},
  {
    scheduled: true,
    timezone: "Asia/Kolkata"
  }
);

//-------------------//

const scriptLog = cron.schedule('10 12 * * *', () => {
  try {
    var result = script.product_process_log();

    if (result == 'success') {
      logger.info(`${Date(Date.now()).toString()} : cron2 executed successfully`, 'utf-8');
    }

  } catch (e) {
    logger.info(e);
  }
},
  {
    scheduled: true,
    timezone: "Asia/Kolkata"
  }
);

httpsServer.listen(port, () => {
  console.log('ERPX server listening on port', port);
});

