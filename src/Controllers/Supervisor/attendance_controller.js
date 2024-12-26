/*
///@ Rohini Mane
/// 24 May 2023 modified
*/

const express = require("express");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const attendanceRouter = express.Router();
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { errorHandler } = require("../../Middlewares/error_handler");
const { NOT_FOUND, UNAUTHORIZED, OK, BAD_REQUEST } = require('../../Utils/Constants/errorCodes');
const attendance = require("..//..//Services/attendanceService");
const fs = require("fs");

attendanceRouter.post("/attendance", async (req, resp) => {
  const token = JSON.parse(
    fs.readFileSync(
      "/home/administrator/workspace.nodejs/ERPX/src/cams_jwt.json",
      "utf8"
    )
  );
  if (req.body["RealTime"] && payloadCheck(req.body["RealTime"])) {
    if (token.authtoken === req.body["RealTime"]["AuthToken"]) {
      let result = await attendance.getAttendanceData(
        req.body,
        req.query.stgid
      );
      resp.send({ status: result });
    } else {
      resp.send({ status: "API_RESPONSE_INVALID_AUTHTOKEN" });
    }
  } else {
    resp.send({ status: "API_RESPONSE_INVALID_REQUEST_DATA" });
  }
});

function payloadCheck(payload) {
  // expected parameter names
  const expectedParameters = ["AuthToken", "PunchLog"];

  // Check if all expected parameters are present in the payload
  for (const param of expectedParameters) {
    if (!(param in payload)) {
      return false; // Missing parameter
    }
  }
  return true; // Payload is valid
}

attendanceRouter.post("/get-employee-attendancelog", varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    let result = await attendance.getEmployeeLog(req.body);
    // resp.send({ status: result });
    resp.status(OK).send({ "status": 200, "message": "Success", "data": result });
  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

attendanceRouter.get("/get-allemployee-dailylog", varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    let result = await attendance.getAllEmployeeDailyLog();
    // resp.send({ status: result });
    resp.status(OK).send({ "status": 200, "message": "Success", "data": result });
  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

attendanceRouter.get("/get-attendance-employeelist", varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    let result = await attendance.attendanceEmployeeList();
    // resp.send({ status: result });
    resp.status(OK).send({ "status": 200, "message": "Success", "data": result });
  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

const defaultRouter = [tryCatch, errorHandler, AppError];

defaultRouter.forEach((router) => {
  attendanceRouter.use(router);
});

module.exports = { attendanceRouter };
