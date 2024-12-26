/*
 * Author: Swaroopa T
 * Date: 28th April 2023
 * Purpose: Audit General Ledger Api Call
 *          ERPX_Audit ->  General Ledger
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
const { selectQuery } = require("../../Utils/file_read");
const auditGeneralLedgerRouter = express.Router();

auditGeneralLedgerRouter.get(
  "/generalledgerdata",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { fromDate, toDate, transType } = req.query;
    // console.log(
    //   "From Date - " + fromDate,
    //   " To Date - " + toDate,
    //   " Trans Type - " + transType
    // );
    const userData = authorizeToken(req.token);
    if (userData) {
      if (fromDate == undefined) {
        throw new AppError(NOT_FOUND, "From Date Not Found", 404);
      }
      if (toDate == undefined) {
        throw new AppError(NOT_FOUND, "To Date Not Found", 404);
      }
      if (transType == undefined) {
        throw new AppError(NOT_FOUND, "Transaction Type Not Found", 404);
      } else {
        properties.parse(
          queryPath[32].AT_GENERALLEDGER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              //console.log(data);
              var query = data.GeneralLedgerData.replace(/\n/g, "");
              query = query.replace(/{transactiontype_code}/gim, transType);
              query = query.replace(/{fromDate}/gim, fromDate);
              query = query.replace(/{toDate}/gim, toDate);
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
        //console.log(queryPath[11].AT_GENERALLEDGER);
      }
      //console.log(userData);
    }
  })
);

auditGeneralLedgerRouter.get(
  "/generalledgerrawdata",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { GeneralLedgerId } = req.query;
    //console.log(GeneralLedgerId);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (GeneralLedgerId == undefined) {
        throw new AppError(NOT_FOUND, "General Ledger Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[32].AT_GENERALLEDGER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.GeneralLedgerRawData.replace(/\n/g, "");
              query = query.replace(/{generalLedgerId}/gim, GeneralLedgerId);
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);
const defaultAuditGeneralLedgerRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultAuditGeneralLedgerRouter.forEach((router) => {
  auditGeneralLedgerRouter.use(router);
});
module.exports = { auditGeneralLedgerRouter };
