const express = require("express");
const properties = require("properties");
const { errorHandler } = require("../../Middlewares/error_handler");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { queryPath } = require("../../Utils/Constants/query.path");
const {
  updateQuery,
  deleteQuery,
  insertQuery,
} = require("../../Utils/file_read");
const { newEventVAlidation } = require("../../Validations/message.validation");
const eventsubscriberRouter = express.Router();

eventsubscriberRouter.put(
  "/updateRecipeiants",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const id = req.body.id;
    // console.log(req.body);
    const updated_Recipieants = req.body.recipieants;
    if (userData) {
      if (id == undefined) {
        throw new AppError(NOT_FOUND, " id not found");
      } else if (updated_Recipieants == undefined) {
        throw new AppError(NOT_FOUND, "updated_Recipieants id not found");
      } else {
        properties.parse(
          queryPath[37].EVENT_SUBSCRIBER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.updateRecipients.replace(/\n/g, " ");
              query = query.replace(/{id}/g, id);
              query = query.replace(
                /{updatedRecipiants}/g,
                updated_Recipieants
              );
              updateQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

eventsubscriberRouter.delete(
  "/Deletesubscriber/:id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const subscriberId = req.params.id;
    // console.log(subscriberId);
    const userdata = authorizeToken(req.token);
    const { error, value } = newEventVAlidation.validate({});
    if (userdata) {
      if (subscriberId == undefined) {
        throw new AppError(NOT_FOUND, "eventid id not found", 404);
      }
      properties.parse(
        queryPath[37].EVENT_SUBSCRIBER,
        { path: true },
        function (error, data) {
          // console.log(data);
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.DeleteSubcriberDetail.replace(/\n/g, " ");
          query = query.replace(/{id}/gim, subscriberId);
          // console.log(query);
          deleteQuery(query, resp);
        }
      );
    }
  })
);

eventsubscriberRouter.post(
  "/events",
  varifyToken,
  tryCatch(async (req, resp) => {
    const event_id = req.body.id;
    const event_name = req.body.name;
    const userdata = authorizeToken(req.token);
    // console.log(req.body);
    const { error, value } = newEventVAlidation.validate({});
    if (userdata) {
      if (event_id == undefined) {
        throw new AppError(NOT_FOUND, "eventid id not found", 404);
      } else if (event_name == undefined) {
        throw new AppError(NOT_FOUND, "event name  not found", 404);
      }
      properties.parse(
        queryPath[37].EVENT_SUBSCRIBER,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.AddEvents.replace(/\n/g, " ");
          query = query.replace(/{event_id}/gim, req.body.id);
          query = query.replace(/{event_name}/gim, req.body.name);
          // console.log(query);
          insertQuery(query, resp);
        }
      );
    }
  })
);

eventsubscriberRouter.post(
  "/event-subscriber",
  varifyToken,
  tryCatch(async (req, resp) => {
    const eventId = req.body.eventId;
    const subscriberId = req.body.subscriberId;
    const recipientas = req.body.recipientas;
    const id = req.body.id;
    const userdata = authorizeToken(req.token);
    // console.log(req.body);

    const { error, value } = newEventVAlidation.validate({});
    if (userdata) {
      if (eventId == undefined) {
        throw new AppError(NOT_FOUND, "eventid should not be null", 404);
      } else if (subscriberId == undefined) {
        throw new AppError(NOT_FOUND, "subscriberId should not be null", 404);
      } else if (recipientas == undefined) {
        throw new AppError(NOT_FOUND, "recipientas should not be null", 404);
      } else if (id == undefined) {
        throw new AppError(NOT_FOUND, "ID should not be null", 404);
      }
      properties.parse(
        queryPath[37].EVENT_SUBSCRIBER,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.addEventSubscriber.replace(/\n/g, " ");
          query = query.replace(/{id}/gim, req.body.id);
          query = query.replace(/{eventId}/gim, req.body.eventId);
          query = query.replace(/{subscriberId}/gim, req.body.subscriberId);
          query = query.replace(/{recipientas}/gim, req.body.recipientas);
          // console.log(query);
          insertQuery(query, resp);
        }
      );
    }
  })
);
const defauleventsubscriberRouter = [
  varifyToken,
  tryCatch,
  authorizeToken,
  AppError,
  errorHandler,
];

defauleventsubscriberRouter.forEach((router) => {
  eventsubscriberRouter.use(router);
});

module.exports = {
  eventsubscriberRouter,
};
