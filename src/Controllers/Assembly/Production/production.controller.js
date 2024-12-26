// Author : Shital Gayakwad
// Created Date : 2 October 2024
// Description : Production 

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { queryPath } = require("../../../Utils/Constants/query.path");
const { selectQuery, insertQuery, updateQuery, executeSelectQuery } = require("../../../Utils/file_read");
const productionRouter = express.Router();

// Pending production data
productionRouter.get('/pending-production', varifyToken, tryCatch(async (req, resp) => {
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
                var query = '';
                if (req.query.barcode == '') {
                    query = data.pendingProductionData.replace(/\n/g, ' ');
                } else {
                    query = data.oneBarcodePendingProductionData.replace(/\n/g, ' ');
                    query = query.replace(/{barcode}/gim, req.query.barcode);
                    query = query.replace(/{quantity}/gim, req.query.quantity);
                }
                query = query.replace(/{workstation_id}/gim, req.query.workstationId);
                // console.log(query);
                executeSelectQuery(query).then(async (result) => {
                    if (result != null) {
                        resp.send(result);
                    } else {
                        resp.send([]);
                    }
                });
            });
    }
}));

// Production instruction
productionRouter.post('/production-instructions', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[61].AS_PD_PRODUCT_PRODUCTROUTE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        'error': error,
                    });
                }
                var query = data.singleProductProductionInstructions.replace(/\n/g, " ");
                query = query.replace(/{schedule_id}/g, req.body.schedule_id);
                query = query.replace(/{workstation_id}/g, req.body.workstation_id);
                selectQuery(query, resp);
            }
        );
    }
}));

// Start production
productionRouter.post('/start', varifyToken, tryCatch(async (req, resp) => {
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
                var query = data.startProduction.replace(/\n/g, " ");
                query = query.replace(/{createdby}/g, req.body.createdby);
                query = query.replace(/{product_id}/g, req.body.product_id);
                query = query.replace(/{revisionnumber}/g, req.body.revisionnumber);
                query = query.replace(/{productionschedule_id}/g, req.body.productionschedule_id);
                query = query.replace(/{processroute_id}/g, req.body.processroute_id);
                query = query.replace(/{workstation_id}/g, req.body.workstation_id);
                query = query.replace(/{workcentre_id}/g, req.body.workcentre_id);
                insertQuery(query, resp);
            }
        );
    }
}));

// Initiated production data
productionRouter.post('/initiated-production-data', varifyToken, tryCatch(async (req, resp) => {
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
                var query = data.initiatedProductionQuery.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.body.product_id);
                query = query.replace(/{revisionnumber}/g, req.body.revisionnumber);
                query = query.replace(/{productionschedule_id}/g, req.body.productionschedule_id);
                query = query.replace(/{processroute_id}/g, req.body.processroute_id);
                query = query.replace(/{workstation_id}/g, req.body.workstation_id);
                query = query.replace(/{workcentre_id}/g, req.body.workcentre_id);
                selectQuery(query, resp);
            }
        );
    }
}));

// Produced Quantity
productionRouter.post('/produced-quantity', varifyToken, tryCatch(async (req, resp) => {
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
                var query = data.producedQuantityOfSpacificProduct.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.body.product_id);
                query = query.replace(/{revisionnumber}/g, req.body.revisionnumber);
                query = query.replace(/{productionschedule_id}/g, req.body.productionschedule_id);
                query = query.replace(/{processroute_id}/g, req.body.processroute_id);
                query = query.replace(/{workstation_id}/g, req.body.workstation_id);
                query = query.replace(/{workcentre_id}/g, req.body.workcentre_id);
                selectQuery(query, resp);
            }
        );
    }
}));

// End process
productionRouter.put('/end-process', varifyToken, tryCatch(async (req, resp) => {
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
                var query = data.endProcess.replace(/\n/g, " ");
                query = query.replace(/{producedquantity}/g, req.body.producedquantity);
                query = query.replace(/{rejectedquantity}/g, req.body.rejectedquantity);
                query = query.replace(/{rejectionreason}/g, req.body.rejectionreason);
                query = query.replace(/{id}/g, req.body.id);
                updateQuery(query, resp);
            }
        );
    }
}));

// End production
productionRouter.put('/end-production', varifyToken, tryCatch(async (req, resp) => {
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
                var query = data.endProduction.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.body.product_id);
                query = query.replace(/{revisionnumber}/g, req.body.revisionnumber);
                query = query.replace(/{productionschedule_id}/g, req.body.productionschedule_id);
                query = query.replace(/{processroute_id}/g, req.body.processroute_id);
                query = query.replace(/{workstation_id}/g, req.body.workstation_id);
                query = query.replace(/{workcentre_id}/g, req.body.workcentre_id);
                updateQuery(query, resp);
            }
        );
    }
}));

module.exports = {
    productionRouter
}