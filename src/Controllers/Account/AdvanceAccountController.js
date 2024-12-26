/*
 * Author: Swaroopa T
 * Date: 15th Dec 2022
 * Purpose: If not Exist Create Advance Account Api Call
 *
 */
const express = require("express");
const properties = require("properties");
const { errorHandler } = require("../../Middlewares/error_handler");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { queryPath } = require("../../Utils/Constants/query.path");
const { selectQuery, insertQuery } = require("../../Utils/file_read");
const account = require("../../Services/advanceAccount");

const advanceAccountRouter = express.Router();

advanceAccountRouter.get(
  "/account-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { accountScheduleId } = req.query;
    // console.log("Account Schedule Id - " + accountScheduleId);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (accountScheduleId == undefined) {
        throw new AppError(NOT_FOUND, "Account Schedule Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[38].AC_ACCOUNT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.getAdvAccountData.replace(/\n/g, "");
              query = query.replace(
                /{accountScheduleId}/gim,
                accountScheduleId
              );
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);
advanceAccountRouter.post(
  "/addaccount-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const accountId = req.body.accountId;
    // console.log("Account Id POST - " + accountId);
    const accountScheduleId = req.body.accountScheduleId;
    // console.log("Account Schedule Id POST - " + accountScheduleId);

    const userData = authorizeToken(req.token);
    if (userData) {
      if (accountId == undefined) {
        throw new AppError(NOT_FOUND, "Account Id Not Found", 404);
      } else if (accountScheduleId == undefined) {
        throw new AppError(NOT_FOUND, "Account Schedule Id Not Found", 404);
      } else {
        let result = await account.getAdvAccountData(
          accountId,
          accountScheduleId
        );
        //resp.send({ status: result });
        resp.send({ status: "Adv-Account API Called" });
      }
    }
    // let result = await account.getAdvAccountData(accountId, accountScheduleId);
  })
);

/*
advanceAccountRouter.post(
  "/addaccount-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    let result = await account.getAdvAccountData(req.body);
    console.log(req.body);
    resp.send({ status: result });
  })
);
/*
advanceAccountRouter.post(
  "/addaccount-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { account_id } = req.body;
    console.log("Account Id - " + account_id);
    const { accountScheduleId } = req.body;
    const userData = authorizeToken(req.token);
    if (userData) {
      if (account_id == undefined) {
        throw new AppError(NOT_FOUND, "Account Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[14].AC_ACCOUNT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.shadowAccount.replace(/\n/g, "");
              query = query.replace(/{account_id}/gim, account_id);
              query = query.replace(
                /{accountScheduleId}/gim,
                accountScheduleId
              );
              //console.log(queryPath[14].AC_ACCOUNT);
              console.log(req.body);
              //insertQuery(query, resp);
            }
          }
        );
      }
    }
  })
);
*/

const defaultAdvanceAccountRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultAdvanceAccountRouter.forEach((router) => {
  advanceAccountRouter.use(router);
});
module.exports = { advanceAccountRouter };

/*
For Customer Account Schedule Id = '402881eb553953350155395b40990005'
For Suppier Account Schedule Id    = '402881eb553953350155395adf1f0004' 
*/
