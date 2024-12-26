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
const { selectQuery, insertQuery } = require("../../Utils/file_read");
const subscriberRouter = express.Router();

subscriberRouter.get(
  "/subscriberdd",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[36].SUBSCRIBER,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.subscriberDropDown.replace(/\n/g, " ");
          selectQuery(query, resp);
        }
      );
    }
  })
);

subscriberRouter.get(
  "/subscriberdetail",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { subscriberId } = req.query;

    const userData = authorizeToken(req.token);
    if (userData) {
      if (subscriberId == undefined) {
        throw new AppError(NOT_FOUND, "Subscriber Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[36].SUBSCRIBER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.subscriberDetail.replace(/\n/g, " ");
              query = query.replace(/{subscriberId}/gim, subscriberId);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

subscriberRouter.post(
  "/add-subscriber",
  varifyToken,
  tryCatch(async (req, resp) => {
    const subscriberId = req.body.id;
    const emailAddress = req.body.emailAddress;
    const mobileNumber = req.body.mobileNumber;

    const userdata = authorizeToken(req.token);
    // console.log(req.body);
    //const { error, value } = newEventVAlidation.validate({});
    if (userdata) {
      /*  if (subscriberId == undefined) {
        throw new AppError(NOT_FOUND, "Subscriber Id id not found", 404);
      } else if (emailAddress == undefined) {
        throw new AppError(NOT_FOUND, "email Address not found", 404);
      } else if (mobileNumber == undefined) {
        throw new AppError(NOT_FOUND, "Mobile Number not found", 404);
      }*/
      properties.parse(
        queryPath[37].EVENT_SUBSCRIBER,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.addSubscriber.replace(/\n/g, " ");
          query = query.replace(/{subscriberId}/gim, req.body.subscriberId);
          query = query.replace(/{emailAddress}/gim, req.body.emailAddress);
          query = query.replace(/{mobileNumber}/gim, req.body.mobileNumber);
          // console.log(query);
          insertQuery(query, resp);
        }
      );
    }
  })
);
const defaultSubscriberRouter = [
  varifyToken,
  tryCatch,
  authorizeToken,
  AppError,
  errorHandler,
];

defaultSubscriberRouter.forEach((router) => {
  subscriberRouter.use(router);
});

module.exports = {
  subscriberRouter,
};
