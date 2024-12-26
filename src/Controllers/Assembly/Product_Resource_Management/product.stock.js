// Author : Shital Gayakwad
// Created Date : 31 Jan 2024
// Description : Assembly product stock

const express = require("express");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { executeSelectQuery, selectQuery, updateQuery, deleteQuery, insertQuery } = require("../../../Utils/file_read");
const { queryPath } = require("../../../Utils/Constants/query.path");
const productStock = express.Router();
const properties = require("properties");
const { registerAndUpdateStockQuery, getAvailableStockQuery } = require("../../../Services/assembly/productstock.service");


// Inward and issue stock
productStock.post('/register', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        const query = await registerAndUpdateStockQuery({
            createdby: req.body.createdby,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
            stockevent: req.body.stockevent,
            sodetails_id: req.body.so_details_id,
            uom_id: req.body.uom_id,
            parentproduct_id: req.body.parentproduct_id,
            preUOM: req.body.preUOM,
            postUOM: req.body.postUOM
        });
        executeSelectQuery(query).then(async (result) => {
            if (result != null) {
                resp.send('Success');
            }
        });
    }
}));

// Available stock of one product
productStock.get('/available-stock-of-one-product', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        const query = await getAvailableStockQuery(req);
        executeSelectQuery(query).then(async (result) => {
            resp.send(result);
        }).catch((e) => {
            resp.send(e);
        }
        );
    }
}));

// Sales orders
productStock.get('/sales-orders-for-stock-issue', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[56].AS_PD_PRODUCT_SALESORDERDETAILS,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        'status code': 404,
                        'error': error
                    });
                }
                selectQuery(data.allSalesOrderWithAllDetails, resp);
            }
        );
    }
}));

// Issued stock
productStock.get('/all-stock-issued-products', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[52].AS_PD_PRODUCT_STOCKHISTORY,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        error: error,
                    });
                }
                selectQuery(data.issuedStock, resp);
            }
        );
    }
}));

// cancel issued stock
productStock.post('/cancel-issued-stock', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[51].AS_PD_PRODUCT_STOCK,
            { path: true },
            function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }
                var query = data.updateStock.replace(/\n/g, " ");
                query = query.replace(/{createdby}/g, req.body.createdby);
                query = query.replace(/{currentstock}/g, req.body.quantity);
                query = query.replace(/{id}/g, req.body.stock_table_id);
                executeSelectQuery(query).then(async (result) => {
                    if (result) {
                        properties.parse(
                            queryPath[52].AS_PD_PRODUCT_STOCKHISTORY,
                            { path: true },
                            async function (error, data) {
                                if (error) {
                                    resp.send({
                                        "status code": 404,
                                        error: error,
                                    });
                                }
                                var query = data.deleteHistory.replace(/\n/g, " ");
                                query = query.replace(/{id}/g, req.body.stock_history_id);
                                deleteQuery(query, resp);
                            }
                        );
                    } else {
                        resp.send({ 'Error': 'Error while inwarding stock' })
                    }

                }).catch((e) => {
                    resp.send(e);
                }
                );
            }
        );
    }
}));

// Inspected products for stock inward
productStock.get('/inspected-products-for-stock-inward', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[63].AS_PRODUCTION_STATUS,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        'error': error,
                    });
                }
                selectQuery(data.inspectedProductsListForStockInward, resp);
            }
        );
    }
}));

// Inward stock
productStock.post('/inward-stock', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[51].AS_PD_PRODUCT_STOCK,
            { path: true },
            function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }
                var query = data.inwardStock.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.body['data']['product_id']);
                query = query.replace(/{createdby}/g, req.body['userId']);
                query = query.replace(/{quantity}/g, req.body['data']['producedquantity']);
                executeSelectQuery(query).then(async (result) => {
                    if (result) {
                        properties.parse(
                            queryPath[52].AS_PD_PRODUCT_STOCKHISTORY,
                            { path: true },
                            async function (error, data) {
                                if (error) {
                                    resp.send({
                                        "status code": 404,
                                        error: error,
                                    });
                                }
                                var query = data.inwardStockHistoryQuery.replace(/\n/g, " ");
                                query = query.replace(/{createdby}/g, req.body['userId']);
                                query = query.replace(/{productstock_id}/g, result[0]['id']);
                                query = query.replace(/{parentproduct_id}/g, req.body['data']['parentproduct_id']);
                                query = query.replace(/{sodetails_id}/g, req.body['data']['so_details_id']);
                                query = query.replace(/{quantity}/g, req.body['data']['producedquantity']);
                                query = query.replace(/{uom_id}/g, req.body['data']['uom_id']);
                                query = query.replace(/{productionschedule_id}/g, req.body['data']['productionschedule_id']);
                                insertQuery(query, resp);
                            }
                        );
                        // console.log(result[0]['id']);
                    }
                }).catch((error) => {
                    resp.send({ 'Error': error });
                })
            });
    }
}));

module.exports = {
    productStock
};