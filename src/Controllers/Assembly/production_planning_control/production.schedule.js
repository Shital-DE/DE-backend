// Author : Shital Gayakwad
// Created Date : 5 September 2024
// Description : Production schedule

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { queryPath } = require("../../../Utils/Constants/query.path");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { selectQuery, executeSelectQuery, updateQuery, deleteQuery } = require("../../../Utils/file_read");
const productionPlanningControlRouter = express.Router();

// Production schedule data
productionPlanningControlRouter.get('/production-planning-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[55].AS_PD_PRODUCT_SALESORDERS,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        error: error,
                    });
                }
                selectQuery(data.productionPlanningSelectQuery, resp);
            }
        );
    }
}));

// Schedule production
productionPlanningControlRouter.post('/schedule-product-for-production', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        var idList = [];
        properties.parse(
            queryPath[62].AS_PRODUCTION_SCHEDULE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        error: error,
                    });
                }
                var query = data.insertQuery.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby);
                query = query.replace(/{childproduct_id}/gim, req.body.childproduct_id);
                query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                query = query.replace(/{so_details_id}/gim, req.body.so_details_id);
                query = query.replace(/{orderquantity}/gim, req.body.orderquantity);
                query = query.replace(/{scheduledquantity}/gim, req.body.scheduledquantity);
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
                                var childquery = data.scheduleProduction.replace(/\n/g, " ");
                                const promises = req.body.stock_history_id_list.map(async (item) => {
                                    let currentQuery = childquery;
                                    currentQuery = currentQuery.replace(/{createdby}/gim, req.body.createdby);
                                    currentQuery = currentQuery.replace(/{productionschedule_id}/gim, result[0]['id']);
                                    currentQuery = currentQuery.replace(/{id}/gim, item.stock_history_id);
                                    currentQuery = currentQuery.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                                    currentQuery = currentQuery.replace(/{so_details_id}/gim, req.body.so_details_id);
                                    currentQuery = currentQuery.replace(/{quantity}/gim, (req.body.scheduledquantity * item.child_quantity));
                                    return executeSelectQuery(currentQuery).then((childResult) => {
                                        if (childResult) {
                                            return childResult;
                                        }
                                    }).catch((childError) => {
                                        console.error('Error with child query:', childError);
                                    });
                                });
                                const results = await Promise.all(promises);
                                idList = results.filter(result => result !== undefined);
                                if (idList) {
                                    resp.send({ status: 200, 'message': 'Success' });
                                }
                            }
                        );
                    }
                }).catch((e) => {
                    resp.send({
                        "status code": 404,
                        error: e,
                    });
                })
            }
        );
    }
}));

// Schedule status
productionPlanningControlRouter.get('/scheduled-status', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[62].AS_PRODUCTION_SCHEDULE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        error: error,
                    });
                }
                selectQuery(data.scheduledStatus, resp);
            });
    }
}));

// Cancel schedulled production
productionPlanningControlRouter.put('/cancel-scheduled-production-of-single-product', varifyToken, tryCatch(async (req, resp) => {
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
                var query = data.scheduleCancellation.replace(/\n/g, ' ');
                query = query.replace(/{productionschedule_id}/gim, req.body.schedule_id);
                executeSelectQuery(query).then(async (result) => {
                    if (result) {
                        properties.parse(
                            queryPath[62].AS_PRODUCTION_SCHEDULE,
                            { path: true },
                            async function (error, data) {
                                if (error) {
                                    resp.send({
                                        "status code": 404,
                                        error: error,
                                    });
                                }
                                var query = data.deleteQuery.replace(/\n/g, ' ');
                                query = query.replace(/{id}/gim, req.body.schedule_id);
                                deleteQuery(query, resp);
                            });
                    }
                });
            });
    }
}));

// Assign barcode
productionPlanningControlRouter.put('/assign-barcode', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[62].AS_PRODUCTION_SCHEDULE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        error: error,
                    });
                }
                var query = data.assignBarcode.replace(/\n/g, ' ');
                query = query.replace(/{id}/gim, req.body.id);
                query = query.replace(/{barcode}/gim, req.body.barcodetext);
                updateQuery(query, resp);
            });
    }
}));

// Next barcode 
productionPlanningControlRouter.post('/next-barcode', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[62].AS_PRODUCTION_SCHEDULE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        error: error,
                    });
                }
                var query = data.nextbarocde.replace(/\n/g, ' ');
                query = query.replace(/{childproduct_id}/gim, req.body.childproduct_id);
                query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                query = query.replace(/{so_details_id}/gim, req.body.so_details_id);
                selectQuery(query, resp);
            });
    }
}));


module.exports = {
    productionPlanningControlRouter
};