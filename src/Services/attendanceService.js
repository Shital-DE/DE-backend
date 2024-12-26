/*
///@ Rohini Mane
/// 24 May 2023 modified
/// 10 Nov 2023 modified
*/
const { queryPath } = require("../Utils/Constants/query.path");
const properties = require("properties");
const { selectDBQuery, executeDBQuery } = require("../Utils/crud");
const axios = require("axios");
const whatsapp_no = process.env.WHATSAPP_NUMBER;
const instance_id = process.env.INSTANCE_ID;
const temperature_value = process.env.ATTENDANCE_TEMPERATURE;
const fs = require("fs");

const getAttendanceData = async function attendance(body, id) {
  const stgid = id; //request.query.stgid;
  const rawdata = body; //request.body;

  const isCorrect = isPayloadValid(body["RealTime"]["PunchLog"]);
  if (isCorrect) {
    var result = await getAttendance(rawdata);
    if (result == "done" || result == "exist") {
      return "done";
    } else {
      return "API_RESPONSE_INVALID_REQUEST_DATA";
    }
  } else {
    return "API_RESPONSE_INVALID_REQUEST_DATA";
  }
};
//=======new====================//
function isPayloadValid(payload) {
  // expected parameter names // exclude "FaceMask"
  const expectedParameters = [
    "InputType",
    "LogTime",
    "Temperature",
    "Type",
    "UserId",
  ];

  // Check if all expected parameters are present in the payload
  for (const param of expectedParameters) {
    if (!(param in payload)) {
      return false; // Missing parameter
    }
  }
  return true; // Payload is valid
}

//======================//
async function getAttendance(rawdata) {
  try {
    if (rawdata.RealTime?.PunchLog) {
      const { Type, Temperature, InputType, UserId, LogTime } =
        rawdata.RealTime.PunchLog;

      const arr = LogTime.split(" ");
      const Log = arr[0] + " " + arr[1];

      try {
        //===check existing record=====//
        const existingAttendance = await findExistingAttendance(
          UserId,
          Type,
          Temperature,
          InputType,
          Log
        );
        if (existingAttendance) {
          //=======Skip=====//
          return "exist";
        } else {
          //=======Log File=====//
          //attendanceLog(rawdata, Type, Temperature, InputType, UserId, LogTime);

          //=======Save Data=====//
          const result = await insertAttendance(
            UserId,
            Type,
            Temperature,
            InputType,
            Log
          );

          if (result == "Success") {
            if (Temperature > temperature_value) {
              const employee = await getEmployee(UserId);
              await sendTemperatureWarning(employee[0]);
            }
            return "done";
          } else {
            return "API_RESPONSE_INVALID_REQUEST_DATA";
          }
        }
      } catch (error) {
        logger.error("check existing record", error);
        throw error;
      }
    }
  } catch (error) {
    logger.error("Check Payload", error);
    throw error;
  }
}

async function findExistingAttendance(
  UserId,
  Type,
  Temperature,
  InputType,
  Log
) {
  try {
    const query = await getQueriesfromProperties();
    var dataQuery = query.checkExistingAttendance.replace(/\n/g, " ");
    dataQuery = dataQuery.replace(/{userid}/gim, UserId);
    dataQuery = dataQuery.replace(/{operation_type}/gim, Type);
    dataQuery = dataQuery.replace(/{temperature}/gim, Temperature);
    dataQuery = dataQuery.replace(/{input_type}/gim, InputType);
    dataQuery = dataQuery.replace(/{logtime}/gim, Log);

    const data = await selectDBQuery(dataQuery);
    return data.length !== 0;
  } catch (e) {
    logger.error("find Existing Attendance", e);
  }
}

async function insertAttendance(UserId, Type, Temperature, InputType, Log) {
  try {
    const query = await getQueriesfromProperties();

    var dataQuery = query.insertAttendance.replace(/\n/g, " ");
    dataQuery = dataQuery.replace(/{userid}/gim, UserId);
    dataQuery = dataQuery.replace(/{operation_type}/gim, Type);
    dataQuery = dataQuery.replace(/{temperature}/gim, Temperature);
    dataQuery = dataQuery.replace(/{input_type}/gim, InputType);
    dataQuery = dataQuery.replace(/{logtime}/gim, Log);

    const data = await executeDBQuery(dataQuery);
    return data;
  } catch (e) {
    logger.error("insert Attendance", e);
  }
}

async function getEmployee(UserId) {
  try {
    const query = await getQueriesfromProperties();

    var dataQuery = query.dataEmployee.replace(/\n/g, " ");
    dataQuery = dataQuery.replace(/{userid}/gim, UserId);

    const data = await selectDBQuery(dataQuery);

    return data;
  } catch (e) {
    logger.error("Get Emp", e);
  }
}

async function sendTemperatureWarning(employee) {
  try {
    const { userid, employee_name } = employee;
    // const message = `Demo Test Temperature Warning!\n UserId: 111 \n Employee Name: test`;
    const message = `Temperature Warning!\n UserId: ${userid} \n Employee Name: ${employee_name}`;
    const url = `https://wawatext.com/api/send.php?number='${whatsapp_no}'&type=text&message='${message}'&instance_id=647AC5F48A6B4&access_token=8833b92c1d42631ef29ba1f641b3fe94`;
    const response = await axios.get(url);
  } catch (e) {
    logger.error("send Temperature Warning", e);
  }
}

const getEmployeeLog = async function (body) {
  try {
    const query = await getQueriesfromProperties();

    var emp_log = query.employee_log.replace(/\n/g, " ");
    emp_log = emp_log.replace(/{userid}/gim,body.userid);
    emp_log = emp_log.replace(/{fromdate}/gim,body.fromdate);
    emp_log = emp_log.replace(/{todate}/gim,body.todate);

    const logList = await selectDBQuery(emp_log);
    return logList;
  } catch (error) {
    throw error;
  }
};

const getAllEmployeeDailyLog = async function () {
  try {
    const query = await getQueriesfromProperties();

    const logList = await selectDBQuery(query.all_employee_dailylog);
    return logList;
  } catch (error) {
    throw error;
  }
};

const attendanceEmployeeList = async function () {
  try {
    const query = await getQueriesfromProperties();

    const data = await selectDBQuery(query.employee_list);

    return data;
  } catch (e) {
    throw e;
  }
}

async function getQueriesfromProperties() {
  return new Promise((resolve, reject) => {
    properties.parse(
      queryPath[19].ATTENDANCE,
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

module.exports = { getAttendanceData, getEmployeeLog, getAllEmployeeDailyLog, attendanceEmployeeList };
