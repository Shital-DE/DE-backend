// Author : Shital Gayakwad
// Created Date :30 April 2023
// Description : ERPX_PPC -> Subcontractor

const express = require("express");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { queryPath } = require("../../Utils/Constants/query.path");
const subcontractorRouter = express.Router();
const properties = require("properties");
const { selectQuery, insertQuery } = require("../../Utils/file_read");
const { errorHandler } = require("../../Middlewares/error_handler");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const outsourceService = require("../../Services/outsourceService");

subcontractorRouter.get(
  "/contractor-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[11].VW_CA_ACCOUNT_SUPPLIER,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.allSubcontractor, resp);
        }
      );
    }
  })
);

subcontractorRouter.get(
  "/city",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[12].CM_CITY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.allCities, resp);
        }
      );
    }
  })
);

subcontractorRouter.post(
  "/validate-subcontractor-registration",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "Subcontractor id not found", 404);
      } else {
        properties.parse(
          queryPath[11].VW_CA_ACCOUNT_SUPPLIER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.validateSubContractor.replace(/\n/g, " ");
            query = query.replace(/{id}/gim, req.body.id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

subcontractorRouter.get(
  "/subcontractor-list",
  varifyToken,
  tryCatch(async (req, res) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      const data = await outsourceService.getSubcontractorList();
      if (data != null) {
        res.send({ status: 200, message: "Success", list: data });
      } else {
        res.send({ status: 500, message: "Fail", list: [] });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

subcontractorRouter.post(
  "/register-subcontractor",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.name == undefined) {
        throw new AppError(NOT_FOUND, "Subcontractor name not found", 402);
      } else if (req.body.address1 == undefined) {
        throw new AppError(NOT_FOUND, "Address line 1 not found", 402);
      } else if (req.body.address2 == undefined) {
        throw new AppError(NOT_FOUND, "Address line 2 not found", 402);
      } else if (req.body.subcontractor_id == undefined) {
        throw new AppError(NOT_FOUND, "Subcontractor id not found", 402);
      } else {
        properties.parse(
          queryPath[11].VW_CA_ACCOUNT_SUPPLIER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.registerSubcontractor.replace(/\n/g, " ");
            query = query.replace(/{subcontractor_name}/gim, req.body.name);
            query = query.replace(/{address1}/gim, req.body.address1);
            query = query.replace(/{address2}/gim, req.body.address2);
            query = query.replace(
              /{subcontractor_id}/gim,
              req.body.subcontractor_id
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

// Calibration contractors
subcontractorRouter.get('/calibration-contractors', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[11].VW_CA_ACCOUNT_SUPPLIER, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.calibrationContractors, resp);
        });
    }
}));

const defaultsubcontractorRouter = [tryCatch, errorHandler, AppError];

module.exports = {
  subcontractorRouter,
};
