/*
 * Author: Swaroopa T
 * Date: 2nd January 2023
 * Purpose: Cheque Payment Against Payable Api Call
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
const { selectQuery } = require("../../Utils/file_read");
const viewForARAPPayableRouter = express.Router();

viewForARAPPayableRouter.get(
  "/cheque-payment-against-payable",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { documentdate, supplieraccount_id } = req.body;
    //console.log(documentdate, supplieraccount_id);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (documentdate == undefined) {
        throw new AppError(NOT_FOUND, "documentdate Field Not Found", 404);
      }
      if (supplieraccount_id == undefined) {
        throw new AppError(
          NOT_FOUND,
          "supplieraccount_id Field Not Found",
          404
        );
      } else {
        properties.parse(
          queryPath[38].AC_ACCOUNT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.getChequePaymentAgainstPayableData.replace(
                /\n/g,
                ""
              );
              query = query.replace(/{documentdate}/gim, documentdate);
              query = query.replace(
                /{supplieraccount_id}/gim,
                supplieraccount_id
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

const defaultViewForARAPPayableRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultViewForARAPPayableRouter.forEach((router) => {
  viewForARAPPayableRouter.use(router);
});
module.exports = { viewForARAPPayableRouter };
