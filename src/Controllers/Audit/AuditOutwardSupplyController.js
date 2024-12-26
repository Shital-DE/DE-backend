/*
 * Author: Swaroopa T
 * Date: 28th April 2023
 * Purpose: Audit Outward Supply Api Call
 *          ERPX_Audit ->  Outward Supply
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
const auditOutwardSupplyRouter = express.Router();

auditOutwardSupplyRouter.get(
  "/osmaster",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { fromDate, toDate, transType } = req.query;
    //console.log(fromDate, toDate, transType);
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
          queryPath[33].AT_OUTWARDSUPPLY,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.OutwardSupplyMasterData.replace(/\n/g, "");
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

auditOutwardSupplyRouter.get(
  "/osmasterrawdata",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { osid } = req.query;
    //console.log(osid);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (osid == undefined) {
        throw new AppError(NOT_FOUND, "Outward Supply Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[33].AT_OUTWARDSUPPLY,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.OutwardSupplyMasterRawData.replace(/\n/g, "");
              query = query.replace(/{outwardSupplyId}/gim, osid);
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

auditOutwardSupplyRouter.get(
  "/osdetail",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { pid } = req.query;
    //console.log(pid);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (pid == undefined) {
        throw new AppError(
          NOT_FOUND,
          "Outward Supply Detail Id Not Found",
          404
        );
      } else {
        properties.parse(
          queryPath[33].AT_OUTWARDSUPPLY,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.OutwardSupplyDetail.replace(/\n/g, "");
              query = query.replace(/{outwardSupplyDetailId}/gim, pid);
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

auditOutwardSupplyRouter.get(
  "/osdetailrawdata",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { osid } = req.query;
    //console.log(osid);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (osid == undefined) {
        throw new AppError(
          NOT_FOUND,
          "Outward Supply Detail Id Not Found",
          404
        );
      } else {
        properties.parse(
          queryPath[33].AT_OUTWARDSUPPLY,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.OutwardSupplyDetailRawData.replace(/\n/g, "");
              query = query.replace(/{outwardSupplyDetailId}/gim, osid);
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);
const defaultAuditOutwardSupplyRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultAuditOutwardSupplyRouter.forEach((router) => {
  auditOutwardSupplyRouter.use(router);
});
module.exports = { auditOutwardSupplyRouter };
