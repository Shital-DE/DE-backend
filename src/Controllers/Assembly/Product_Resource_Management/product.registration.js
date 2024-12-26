// Author : Shital Gayakwad
// Created Date : 17 Oct 2023
// Description : Assembly product registration

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { queryPath } = require("../../../Utils/Constants/query.path");
const { selectQuery, insertQuery } = require("../../../Utils/file_read");
const productRegistration = express.Router();

// Product type
productRegistration.get(
  "/product-type",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[41].AS_PRODUCTTYPE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.producttype, resp);
        }
      );
    }
  })
);

// Product registration
productRegistration.post(
  "/register-product",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[40].AS_PD_PRODUCT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.registerProduct.replace(/\n/g, " ");
          query = query.replace(/{createdby}/g, req.body.createdby.trim());
          query = query.replace(/{code}/g, req.body.code.trim());
          query = query.replace(/{description}/g, req.body.description.trim());
          query = query.replace(/{producttype}/g, req.body.producttype.trim());
          query = query.replace(/{revisionno}/g, req.body.revisionno.trim());
          query = query.replace(/{unit_of_measurement}/g, req.body.unit_of_measurement.trim());
          query = query.replace(/{company}/g, req.body.company.trim());
          insertQuery(query, resp);
        }
      );
    }
  })
);

// Unit of measurement data
productRegistration.get('/unit-of-measurement-data', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[40].AS_PD_PRODUCT,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        selectQuery(data.unitOfMeasurementData, resp);
      }
    );
  }
}));

// Company data
productRegistration.get('/company', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[40].AS_PD_PRODUCT,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        selectQuery(data.as_company, resp);
      }
    );
  }
}));

module.exports = {
  productRegistration,
};
