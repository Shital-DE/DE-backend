/* Rohini Mane
/// 07-02-2024
/// Capacity Plan API
*/
const express = require('express');
const empRouter = express.Router();
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');

const { errorHandler } = require('../../Middlewares/error_handler');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const empService = require('../../Services/employeeService');
const properties = require("properties");
const { queryPath } = require("../../Utils/Constants/query.path");

const {
  insertQuery, selectQuery, updateQuery, executeSelectQuery, deleteQuery,
  //selectQuery,
  //  updateQuery
} = require("../../Utils/file_read");

const {
  employeeovertimedatainsertvalidation, getemployeeovertimedatavalidation, updateempOvertimedatavalidation, getproductlistfrompoidvalidation, childemployeeovertimedatainsertvalidation
} = require("../../Validations/operator.validation");
const { executeDBQuery } = require('../../Utils/crud');


empRouter.get('/operator-list', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  //console.log(userData);
  if (userData) {


    const data = await empService.getOperatorList();
    if (data != null) {
      resp.send({
        status: 200, message: "Success", data: data,

      });
    } else {
      resp.send({ status: 500, message: "Fail", data: [] });
    }
  }
}));

empRouter.get('/emp-overtime-ws-list', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  //console.log(userData);
  if (userData) {

    const data = await empService.employeeOvertimeWorkstationlist();
    if (data != null) {
      resp.send({
        status: 200, message: "Success", data: data,
      });
    } else {
      resp.send({ status: 500, message: "Fail", data: [] });
    }
  }
}));

empRouter.post('/emp-overtime-data11', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);

  if (userData) {
    if (!req.body.empid) {
      resp.status(BAD_REQUEST).send({ "status": 400, "message": "'Invalid payload'" });
    } else {
      const data = await empService.empOvertimeData(req.body.empid);
      if (data != null) {
        resp.send({
          status: 200, message: "Success", data: data,
        });
      } else {
        resp.send({ status: 500, message: "Fail", data: [] });
      }
    }
  }
}));

empRouter.get(
  "/po-list",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      properties.parse(
        queryPath[23].CC_SS_CUSTOMER_POS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          //console.log(data.allpolist);
          selectQuery(data.allpolist, resp);
        }
      );
    }
  })
);

empRouter.post(
  "/productlist-from-soid",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    // console.log(userdata);
    // console.log(req.body);
    // const { error, value } = getproductlistfrompoidvalidation.validate({});
    if (userdata) {
      if (req.body.so_id == undefined) {
        throw new AppError(NOT_FOUND, "so_id not found", 403);
      } else {
        properties.parse(
          queryPath[23].CC_SS_CUSTOMER_POS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.productlistfrompo.replace(/\n/g, "");
            query = query.replace(/{so_idd}/gim, req.body.so_id);
            // console.log(query);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

empRouter.post(
  "/insert-overtime-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.loginid == undefined) {
        throw new AppError(NOT_FOUND, "loginid not found", 403);
      } else if (req.body.empid == undefined) {
        throw new AppError(NOT_FOUND, "empid not found", 403);
      } else if (req.body.wsid == undefined) {
        throw new AppError(NOT_FOUND, "wsid not found", 403);
      }
      else if (req.body.remark == undefined) {
        throw new AppError(NOT_FOUND, "remark not found", 403);
      }
      else if (req.body.starttime == undefined) {
        throw new AppError(NOT_FOUND, "starttime not found", 403);
      } else if (req.body.endtime == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      } else {
        properties.parse(
          queryPath[3].HR_EMPLOYEE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.operatorovertimeinsertdata.replace(/\n/g, "");
            query = query.replace(/{loginid}/gim, req.body.loginid);
            query = query.replace(/{empid}/gim, req.body.empid);
            query = query.replace(/{wsid}/gim, req.body.wsid);
            query = query.replace(/{remarkk}/gim, req.body.remark);
            query = query.replace(/{starttime}/gim, req.body.starttime);
            query = query.replace(/{endtime}/gim, req.body.endtime != null ? req.body.endtime : '');
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

empRouter.post(
  "/insert-childovertime-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      var returnidlist = [];
      const dataArray = JSON.parse(req.body.productselectedlist);
      if (req.body.employeeovertimeid == undefined) {
        throw new AppError(NOT_FOUND, "employeeovertimeid not found", 403);
      } else if (req.body.productselectedlist == undefined) {
        throw new AppError(NOT_FOUND, "productselectedlist not found", 403);
      }

      else {
        properties.parse(
          queryPath[3].HR_EMPLOYEE,
          { path: true },
          async function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } const promises = dataArray.map(async (item) => {
              // console.log(data.insertchildoperatorovertimedata);
              var childemployeeovertime = data.insertchildoperatorovertimedata.replace(
                /\n/g,
                ""
              );
              childemployeeovertime = childemployeeovertime.replace(
                /{empovertimeid}/gim,
                req.body.employeeovertimeid
              );
              childemployeeovertime = childemployeeovertime.replace(
                /{poid}/gim,
                item['salesorderid']
              );
              childemployeeovertime = childemployeeovertime.replace(
                /{productid}/gim,
                item['productid']
              );
              childemployeeovertime = childemployeeovertime.replace(
                /{lineitemno}/gim,
                item.lineitemnumber
              );
              childemployeeovertime = childemployeeovertime.replace(
                /{seqno}/gim,
                item['sequence']
              );
              childemployeeovertime = childemployeeovertime.replace(
                /{instruc}/gim,
                item['instruction']
              );
              // console.log(childemployeeovertime);
              try {
                const result = await executeSelectQuery(childemployeeovertime);
                if (result != null && result[0].id.length == 32) {
                  returnidlist.push(result);
                }

              } catch (e) {
                resp.send(e);
              }

            });

            await Promise.all(promises);
            if (dataArray.length == returnidlist.length) {
              resp.send({
                'status code': 200,
                'message': 'Success',
              })
            }
          }
        );
      }
    }
  })
);


empRouter.post(
  "/employee-overtime-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    // console.log(userdata);
    // console.log(req.body);
    //const { error, value } = getemployeeovertimedatavalidation.validate({});
    if (userdata) {
      if (req.body.empid == undefined) {
        throw new AppError(NOT_FOUND, "empid not found", 403);
      } else {
        properties.parse(
          queryPath[3].HR_EMPLOYEE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.operatorovertimedata.replace(/\n/g, "");
            query = query.replace(/{empid}/gim, req.body.empid);
            //console.log(query);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

empRouter.post(
  "/details-employee-overtime-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    //  const { error, value } = getemployeeovertimedatavalidation.validate({});
    if (userdata) {
      if (req.body.viewdetailsid == undefined) {
        throw new AppError(NOT_FOUND, "viewdetailsid not found", 403);
      } else {
        properties.parse(
          queryPath[3].HR_EMPLOYEE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.selectEODdata.replace(/\n/g, "");
            query = query.replace(/{tableid}/gim, req.body.viewdetailsid);
            //console.log(query);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

empRouter.post(
  "/update-overtime-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    /// const { error, value } = updateempOvertimedatavalidation.validate({});
    if (userdata) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "id not found", 403);
      } else if (req.body.empid == undefined) {
        throw new AppError(NOT_FOUND, "empid not found", 403);
      } else if (req.body.endtime == undefined) {
        throw new AppError(NOT_FOUND, "endtime not found", 403);
      }
      else {
        properties.parse(
          queryPath[3].HR_EMPLOYEE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.updateoperatorovertimedata.replace(/\n/g, "");
            query = query.replace(/{id}/gim, req.body.id);
            query = query.replace(/{empid}/gim, req.body.empid);
            query = query.replace(/{endtime}/gim, req.body.endtime);
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

empRouter.post(
  "/deleteovertimedata",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.employeeovertimeid == undefined) {
        throw new AppError(NOT_FOUND, "employeeovertimeid not found", 403);
      }
      else {
        properties.parse(
          queryPath[3].HR_EMPLOYEE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleterecordOvertimeData.replace(/\n/g, "");
            query = query.replace(/{EOD_id}/gim, req.body.employeeovertimeid);

            // console.log(query);
            deleteQuery(query, resp);
          }
        );
      }
    }
  })
);

const defaultCPRouter = [
  errorHandler, tryCatch, AppError
]
defaultCPRouter.forEach((router) => {
  empRouter.use(router);
});


module.exports = { empRouter }