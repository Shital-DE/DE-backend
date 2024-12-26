/*
 * Author: Swaroopa T
 * Date: 25th November 2022
 * Purpose: Online Payment Queue Api Call
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
const onlinePaymentStatusQueueRouter = express.Router();

onlinePaymentStatusQueueRouter.get(
  "/onlinePaymentQueue",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { fromDate, toDate, onlinepaymentstatus } = req.query;
    //console.log(fromDate, toDate, onlinepaymentstatus);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (fromDate == undefined) {
        throw new AppError(NOT_FOUND, "From Date Not Found", 404);
      }
      if (toDate == undefined) {
        throw new AppError(NOT_FOUND, "To Date Not Found", 404);
      }
      if (onlinepaymentstatus == undefined) {
        throw new AppError(NOT_FOUND, "Online Payment Status Not Found", 404);
      } else {
        properties.parse(
          queryPath[34].CC_ONLINEPAYMENTSTATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.GetOnlinePaymentStatusData.replace(/\n/g, "");
              query = query.replace(/{fromDate}/gim, fromDate);
              query = query.replace(/{toDate}/gim, toDate);
              query = query.replace(
                /{onlinepaymentstatus}/gim,
                onlinepaymentstatus
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

const defaultOnlinePaymentStatusQueueRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultOnlinePaymentStatusQueueRouter.forEach((router) => {
  onlinePaymentStatusQueueRouter.use(router);
});
module.exports = { onlinePaymentStatusQueueRouter };
