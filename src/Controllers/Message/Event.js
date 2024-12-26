/*
 * Author: Swaroopa T
 * Date: 25th November 2022
 * Purpose: Expence Detail Api Call
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
const eventRouter = express.Router();

eventRouter.get(
  "/eventdd",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[35].EVENT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.eventDropDown.replace(/\n/g, " ");
          selectQuery(query, resp);
        }
      );
    }
  })
);

eventRouter.get(
  "/eventdetail",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { eventId } = req.query;
    const userData = authorizeToken(req.token);
    if (userData) {
      if (eventId == undefined) {
        throw new AppError(NOT_FOUND, "Event Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[35].EVENT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.eventDetail.replace(/\n/g, " ");
              query = query.replace(/{eventId}/gim, eventId);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);
const defaultEventRouter = [
  varifyToken,
  tryCatch,
  authorizeToken,
  AppError,
  errorHandler,
];

defaultEventRouter.forEach((router) => {
  eventRouter.use(router);
});

module.exports = {
  eventRouter,
};
