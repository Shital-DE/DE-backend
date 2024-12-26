/* Rohini Mane
/// created 07/02/2024
///
*/
const { queryPath } = require("../Utils/Constants/query.path");
const properties = require("properties");
const { selectDBQuery, executeDBQuery } = require("../Utils/crud");
const AppError = require("../Utils/ErrorHandling/appErrors");
const { NOT_FOUND, UNAUTHORIZED } = require("../Utils/Constants/errorCodes");
const { v4: uuidv4 } = require("uuid");
const { executeSelectQuery } = require("../Utils/file_read");
const ExcelJS = require('exceljs');
const { sendEmail } = require("./calibration.service");
const dbConnect = require("../Config/Database/postgresql_config");

const getOperatorList = async function () {
  try {
    const query = await new Promise((resolve, reject) => {
      properties.parse(
        queryPath[3].HR_EMPLOYEE,
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

    const operatorquery = query.operatorList.replace(/\n/g, '');
    const operator_list = await selectDBQuery(operatorquery);
    return operator_list;
  } catch (error) {
    throw error;
  }
};

const employeeOvertimeWorkstationlist = async function () {
  try {
    const query = await new Promise((resolve, reject) => {
      properties.parse(
        queryPath[5].WR_WORKCENTRE_WORKSTATION,
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

    const operatorwsquery = query.employeeOvertimeWorkstationlist.replace(/\n/g, '');
    const operator_ws_list = await selectDBQuery(operatorwsquery);
    return operator_ws_list;
  } catch (error) {
    throw error;
  }
};


const empOvertimeData = async function (empid) {
  try {
      const query = await new Promise((resolve, reject) => {
      properties.parse(
       queryPath[3].HR_EMPLOYEE,
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

    var parentQuery = query.operatorovertimedata.replace(/\n/g, ' ');
    parentQuery = parentQuery.replace(/{empid}/gim, fromDate); 
    const parentList = await selectDBQuery(parentQuery);

    return parentList;
  } catch (error) {
    throw (error);
  }
}

async function createExcelSheet_Overtime({ data, filename }) {

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(filename);

      // Assuming data.header is an array of header values
      worksheet.addRow();
      const headerRow = worksheet.addRow(['EmployeeName', 'Workstation', 'StartTime', 'EndTime', 'WorkRemark', 'WorkDetails', 'Overtime_Hours','Overtime_Min']);   
      worksheet.addRow();
        // Style header cells
       headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '90EE90' }
        };
        cell.font = { bold: true };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    });

        // Add data rows
        data.forEach(item => {
            const values = Object.values(item);
            const modifiedValues = values.filter((_, index) => index !== 0);// && index !== 8);
            worksheet.addRow(modifiedValues).eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
            });
        });
      
       worksheet.columns.forEach((column, index) => {
        if (index === 0) {
            column.width =25;
        }else if (index === 1) {
            column.width = 25;
        } 
        else if (index === 2) {
            column.width = 25;
        } else if (index === 3) {
            column.width = 25;
        } else if (index === 4) {
            column.width = 60;
        } 
        else if (index === 5) {
            column.width = 80;
        } 
        else if (index === 6) {
            column.width = 10;
        }
        else if (index === 7) {
            column.width = 10;
        }
        else if (index === 8) {
            column.width = 10;
        }
       });
      
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
            row.height = 20;
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {      
        throw error; // Propagate the error
    }
}

const mailsendofemployeeOvertimeData = async function sendEmoployeeOvertimeData() {
       const currentDate = new Date();
        const date = currentDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '');
        var filename = `Monthly_Employee_Overtime_Data_${date}.xlsx`;
  try {
    const recipients = await getAccountRecipients();
    // console.log(recipients[0]['emailaddress']);
    const subject = 'Employee Overtime Data';      
      monthlyemployeeOvertimeData().then((result) => {                  
                        if (result.length > 0) {
                            createExcelSheet_Overtime({ data: result, filename: filename }).then(async excel => {
                               await sendEmail({
                                    from: 'erpdatta@datta.co.in',
                                    to: 'nilesh.desai@genesis-tech.in',
                                   // to: recipients[0]['emailaddress'],
                                    bcc: 'nilesh.desai@genesis-tech.in',
                                    subject: 'Testing mail of Employee Overtime Data',
                                    content: `Account Dept,<br><br>
                                    Please find attachment.<br><br>
                                    Best regards,<br><br>
                                    Datta Enterprises.`,
                                    attachments: [{
                                        filename: filename,
                                        content: excel
                                    }]
                               })
                                //  .then((result) => {                                  
                                //   if (result.success == true) {                                  
                                //         resp.send({
                                //             'status code': 200,
                                //             'message': 'Success'
                                //         });
                                //     } else {
                                //         resp.send({
                                //             'status code': 404,
                                //             'message': result.message
                                //         });
                                //     }
                                // }
                                // ).catch((e) => {                                  
                                //     resp.send({
                                //         'status code': 404,
                                //         'error': e
                                //     });
                                // });
                            }).catch((e) => {
                                // console.log("catch error 11  -->"+e);
                                resp.send({
                                    'status code': 404,
                                    'error': e
                                });
                            });
                        }            
                    }).catch((e) => {
                        return e;
                    });
    } catch (e) {
        // console.log(e);
    }
};

async function monthlyemployeeOvertimeData() {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[3].HR_EMPLOYEE,
            { path: true },
            async function (error, data) {
                if (error) {
                    reject({
                        'status code': 404,
                        'error': error
                    });
                }
              executeSelectQuery(data.monthlyovertimedata).then((result) => {
                    if (result.length != 0) {
                        resolve(result);
                    }
                }).catch((e) => {
                    reject({
                        'status code': 404,
                        'error': e
                    });
                });
            }
        );
    }
  );
}

async function getAccountRecipients() {
    try {
        const data = await new Promise((resolve, reject) => {
            properties.parse(queryPath[37].EVENT_SUBSCRIBER, { path: true }, (error, parsedData) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(parsedData);
                }
            });
        });

        let query = data.accountTo.replace(/\n/g, " ");
      query = query.replace(/{recipientas}/g, 'to');      
      const result = await selectDBQuery(query);      
      return result;
    } catch (error) {
      throw new AppError(NOT_FOUND, error, 404);
      
    }
}





module.exports = { getOperatorList,employeeOvertimeWorkstationlist,empOvertimeData,createExcelSheet_Overtime, mailsendofemployeeOvertimeData, monthlyemployeeOvertimeData};
