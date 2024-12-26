// Author : Shital Gayakwad
// Created Date : 28 Nov 2023
// Description : Stock
// Modified Date :

const express = require("express");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const stockRouter = express.Router();
const properties = require("properties");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { queryPath } = require("../../Utils/Constants/query.path");
const {
  insertQuery,
  selectQuery,
  updateQuery,
} = require("../../Utils/file_read");

// Register stock
stockRouter.post(
  "/register-stock",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[42].PD_PRODUCT_PRODUCTSTOCK,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.registerStock.replace(/\n/g, " ");
          query = query.replace(/{pd_product_id}/gim, req.body.product_id);
          query = query.replace(/{stockqty}/gim, req.body.stockqty);
          query = query.replace(/{boxnumber}/gim, req.body.boxnumber);
          query = query.replace(/{updatedby}/gim, req.body.user_id);
          query = query.replace(/{revision}/gim, req.body.revision);
          insertQuery(query, resp);
        }
      );
    }
  })
);

// Available stock
stockRouter.get(
  "/available-stock",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[42].PD_PRODUCT_PRODUCTSTOCK,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.availableStock, resp);
        }
      );
    }
  })
);

stockRouter.post(
  "/decrease-stock",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[42].PD_PRODUCT_PRODUCTSTOCK,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.decreaseStock.replace(/\n/g, " ");
          query = query.replace(/{stock_quantity}/gim, req.body.stock_quantity);
          query = query.replace(/{product_id}/gim, req.body.product_id);
          query = query.replace(/{revision_value}/gim, req.body.revision_value);
          updateQuery(query, resp);
        }
      );
    }
  })
);

module.exports = {
  stockRouter,
};
