// Author : Shital Gayakwad
// Created Date : 9 Feb 2024
// Description : Assembly purchase orders

const express = require("express");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const purchaseOrderRouter = express.Router();
const { queryPath } = require("../../../Utils/Constants/query.path");
const {
  poRegister,
  searchProductByCode,
  registerOrder,
  createExcelSheet,
  reservedOrderToSendMail,
} = require("../../../Services/assembly/sales_order/so.service");
const {
  selectQuery,
  executeSelectQuery,
  deleteQuery,
} = require("../../../Utils/file_read");
const properties = require("properties");
const { sendEmail } = require("../../../Services/calibration.service");
const {
  registerStockHistory,
  registerAndUpdateStockQuery,
} = require("../../../Services/assembly/productstock.service");
const { Query } = require("mongoose");

// Upload purchase order
purchaseOrderRouter.post(
  "/upload",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      const data = req.body.data;
      var productList = [],
        orderCount = [];
      try {
        for (const item of data) {
          const productId = await searchProductByCode(item, queryPath);
          if (productId[0]["id"] === "No record found") {
            productList.push(item);
          } else {
            const poid = await poRegister(req.body.userId, item);
            if (poid) {
              const count = await registerOrder({
                userId: req.body.userId.trim(),
                poid: poid[0]["id"].trim(),
                productId: productId[0]["id"].trim(),
                item: item,
              });
              if (count == "1") {
                orderCount.push(count);
              }
            }
          }
        }
        resp.send({
          Success: orderCount.length,
          Fail: productList.length,
          Details: productList,
        });
      } catch (error) {
        resp.send({ Error: error });
      }
    }
  })
);

// All purchase orders
purchaseOrderRouter.get(
  "/all-orders",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[56].AS_PD_PRODUCT_SALESORDERDETAILS,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          selectQuery(data.allPurchaseOrders, resp);
        }
      );
    }
  })
);

// Products in one sales order
purchaseOrderRouter.get(
  "/products-in-one-so",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[56].AS_PD_PRODUCT_SALESORDERDETAILS,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          var query = data.ProductsInOneSO.replace(/\n/g, " ");
          query = query.replace(/{po_id}/g, req.query.poid);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Reserve stock
purchaseOrderRouter.post(
  "/reserve-stock",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          var query = "";
          if (req.body.product_type == "Assembly") {
            query = data.reserveStockOfAssembly.replace(/\n/g, " ");
          } else {
            query = data.reserveStockOfPart.replace(/\n/g, " ");
          }
          query = query.replace(/{po_qty}/g, req.body.poqty);
          query = query.replace(/{product_id}/g, req.body.product_id);
          query = query.replace(/{revisionno}/g, req.body.revisionno);
          query = query.replace(/{createdby}/g, req.body.createdby);
          query = query.replace(/{so_details_id}/g, req.body.so_details_id);
          if (query != "") {
            // console.log(query);
            executeSelectQuery(query)
              .then((result) => {

                if (result[0]["result"] === "No record found") {
                  resp.send({
                    "status code": 200,
                    status: "Product structure not defined.",
                  });
                } else {

                  resp.send({
                    "status code": 200,
                    status: "Product reserved successfully.",
                  });
                }
              })
              .catch((e) => {
                resp.send({
                  "status code": 404,
                  error: "Something went wrong",
                });
              });
          }
        }
      );
    }
  })
);

// Reserved stock
purchaseOrderRouter.get(
  "/reserved-stock",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          var query = data.reservedStock.replace(/\n/g, " ");
          query = query.replace(/{po_id}/g, req.query.poid);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Unreserve stock
purchaseOrderRouter.delete(
  "/unreserve-stock",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          var query = data.unreserveStock.replace(/\n/g, " ");
          query = query.replace(/{product_id}/g, req.body.product_id);
          query = query.replace(/{so_details_id}/g, req.body.so_details_id);
          // console.log(query);
          deleteQuery(query, resp);
        }
      );
    }
  })
);

// To be produce quantity to complete order
purchaseOrderRouter.get(
  "/tobeproduce-quantity-of-selected-products-to-complete-order",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          // console.log(data.tobeProductQuantityToCompleteOrder);
          selectQuery(data.tobeProductQuantityToCompleteOrder, resp);
        }
      );
    }
  })
);

// Share to be produce quantity on mail
purchaseOrderRouter.post(
  "/send-mail-to-share-production-manifest",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      const currentDate = new Date();
      const date = currentDate
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "");
      var filename = `Prod_manifest_${date}.xlsx`;
      reservedOrderToSendMail()
        .then((result) => {
          if (result.length > 0) {
            createExcelSheet({
              orderdata: result,
              data: req.body,
              filename: filename,
            })
              .then(async (excel) => {
                sendEmail({
                  from: "erpdatta@datta.co.in",
                  to: "yuvraj.dongale@datta.co.in",
                  bcc: "shital.gayakwad@genesis-tech.in",
                  subject:
                    "Assembly product stock check and production quantity list",
                  content: `Assembly shop,<br><br>
                            Please find attachment.<br><br>
                            Best regards,<br><br>
                            Datta Enterprises.`,
                  attachments: [
                    {
                      filename: filename,
                      content: excel,
                    },
                  ],
                })
                  .then((result) => {
                    if (result.success == true) {
                      resp.send({
                        "status code": 200,
                        message: "Success",
                      });
                    } else {
                      resp.send({
                        "status code": 404,
                        message: result.message,
                      });
                    }
                  })
                  .catch((e) => {
                    resp.send({
                      "status code": 404,
                      error: e,
                    });
                  });
              })
              .catch((e) => {
                resp.send({
                  "status code": 404,
                  error: e,
                });
              });
          }
        })
        .catch((e) => {
          return e;
        });
    }
  })
);

// Issue selected products stock
purchaseOrderRouter.post(
  "/issue-stock-of-selected-products",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      var idList = [];
      const dataArray = JSON.parse(req.body.data);
      const promises = dataArray.map(async (item) => {
        const query = await registerAndUpdateStockQuery({
          createdby: req.body.createdby,
          product_id: item.productId,
          quantity: item.quantity,
          stockevent: "Issue",
          parentproduct_id: item.parentProductId,
          sodetails_id: item.soDetailsId,
          uom_id: item.productuomId,
          preUOM: item.productuomId,
          postUOM: item.stockhistoryId,
        });
        try {
          const result = await executeSelectQuery(query);
          if (result != null) {
            if (result != null && result.length == 32) {
              var issuedProductQuantityquery = await new Promise(
                (resolve, reject) => {
                  properties.parse(
                    queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
                    { path: true },
                    (error, data) => {
                      if (error) {
                        reject(error);
                        return;
                      }

                      resolve(data.issuedProductQuantity.replace(/\n/g, " "));
                    }
                  );
                }
              );
              issuedProductQuantityquery = issuedProductQuantityquery.replace(
                /{product_id}/g,
                item.productId
              );
              issuedProductQuantityquery = issuedProductQuantityquery.replace(
                /{parentproduct_id}/g,
                item.parentProductId
              );
              issuedProductQuantityquery = issuedProductQuantityquery.replace(
                /{sodetails_id}/g,
                item.soDetailsId
              );
              const issuedProducts = await executeSelectQuery(
                issuedProductQuantityquery
              );
              if (issuedProducts[0] != null) {
                idList.push(issuedProducts[0]);
              }
            }
          }
        } catch (e) {
          resp.send(e);
        }
      });

      await Promise.all(promises);

      if (idList) {
        resp.send({
          "status code": 200,
          message: "Success",
          data: idList,
        });
      }
    }
  })
);

// Clear reserved products
purchaseOrderRouter.delete(
  "/clear-reserved-products",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
        { path: true },
        async function (error, data) {
          if (error) {
            resp.send({
              "status code": 404,
              error: error,
            });
          }
          deleteQuery(data.clearReservedProducts, resp);
        }
      );
    }
  })
);

module.exports = {
  purchaseOrderRouter
}
