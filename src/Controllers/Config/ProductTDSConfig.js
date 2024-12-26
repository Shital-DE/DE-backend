/*
 * Author: Swaroopa T
 * Date: 18th May, 2023
 * Purpose: Product TDS Config Api Call
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
const productTDSConfigRouter = express.Router();

productTDSConfigRouter.get(
  "/product-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { productCode } = req.query;
    //console.log(productCode);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (productCode == undefined) {
        throw new AppError(NOT_FOUND, "Product Code Not Found", 404);
      } else {
        properties.parse(
          queryPath[4].PD_PRODUCT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.getProductTdsData.replace(/\n/g, "");
              query = query.replace(/{productCode}/gim, productCode);
              //console.log(query);
              selectQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

productTDSConfigRouter.put(
  "/setproduct-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const { productId } = req.query;
    //console.log(productId);
    const { hasTds } = req.body;
    // console.log(hasTds);
    const userData = authorizeToken(req.token);
    if (userData) {
      if (productId == undefined) {
        throw new AppError(NOT_FOUND, "Product Id Not Found", 404);
      }
      if (hasTds == undefined) {
        throw new AppError(NOT_FOUND, "hasTds Field Not Found", 404);
      } else {
        properties.parse(
          queryPath[4].PD_PRODUCT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.updateProductTdsData.replace(/\n/g, "");
              query = query.replace(/{hasTds}/gim, hasTds);
              query = query.replace(/{productId}/gim, productId);
              // console.log(query);
              updateQuery(query, resp);
            }
          }
        );
      }
    }
  })
);

const defaultProductTDSConfigRouter = [
  errorHandler,
  authorizeToken,
  tryCatch,
  AppError,
];
defaultProductTDSConfigRouter.forEach((router) => {
  productTDSConfigRouter.use(router);
});
module.exports = { productTDSConfigRouter };
