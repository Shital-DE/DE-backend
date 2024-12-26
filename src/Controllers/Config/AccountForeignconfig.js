/*
 * Author: Swaroopa T
 * Date: 18th May, 2023
 * Purpose: Account Foreign Config Api Call
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
const { selectQuery, updateQuery } = require("../../Utils/file_read");
const accountForeignconfigRouter = express.Router();

accountForeignconfigRouter.get(
  "/account-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { accountName } = req.query;
    //console.log(accountName);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (accountName == undefined) {
        throw new AppError(NOT_FOUND, "Account Name Not Found", 404);
      } else {
        properties.parse(
          queryPath[4].PD_PRODUCT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.getAccountForeignData.replace(/\n/g, "");
              query = query.replace(/{accountName}/gim, accountName);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

accountForeignconfigRouter.put(
  "/setaccount-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { accId } = req.query;
    //console.log(accId);
    const { isForeignCompany } = req.body;
    //console.log(isForeignCompany);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (accId == undefined) {
        throw new AppError(NOT_FOUND, "Account Id Not Found", 404);
      }
      if (isForeignCompany == undefined) {
        throw new AppError(NOT_FOUND, "isForeignCompany Field Not Found", 404);
      } else {
        properties.parse(
          queryPath[4].PD_PRODUCT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.updateAccountForeignData.replace(/\n/g, "");
              query = query.replace(/{accId}/gim, accId);
              query = query.replace(/{isForeignCompany}/gim, isForeignCompany);
              //console.log(query);
              updateQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

const defaultAccountForeignconfigRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultAccountForeignconfigRouter.forEach((router) => {
  accountForeignconfigRouter.use(router);
});
module.exports = { accountForeignconfigRouter };
