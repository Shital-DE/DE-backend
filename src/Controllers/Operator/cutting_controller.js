// Author : Shital Gayakwad
// Created Date : 3 March 2023
// Description : ERPX_PPC -> Operator route

const express = require('express');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { errorHandler } = require('../../Middlewares/error_handler');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const cuttingRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery, insertQuery, updateQuery, executeSelectQuery } = require('../../Utils/file_read');

cuttingRouter.post('/start-cutting', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.startCutting.replace(/\n/g, ' ');
            query = query.replace(/{productid}/gim, req.body.productid);
            query = query.replace(/{seqno}/gim, req.body.process_sequence);
            query = query.replace(/{rmsid}/gim, req.body.rawmaterialissueid);
            query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
            query = query.replace(/{workstationid}/gim, req.body.workstationid);
            query = query.replace(/{employeeid}/gim, req.body.employeeid);
            query = query.replace(/{revision}/gim, req.body.revision_number);
            query = query.replace(/{processroute_id}/gim, req.body.processroute_id);
            insertQuery(query, resp);
        });
    }
}));

cuttingRouter.post('/cutting-status', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.productid == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else if (req.body.rawmaterialissueid == undefined) {
            throw new AppError(NOT_FOUND, 'Raw material issue id found', 404);
        } else if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.cuttingStatus.replace(/\n/g, ' ');
                query = query.replace(/{productid}/gim, req.body.productid);
                query = query.replace(/{rmsid}/gim, req.body.rawmaterialissueid);
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{revision}/gim, req.body.revision);
                selectQuery(query, resp);
            });
        }
    }
}));

cuttingRouter.post('/end-cutting', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.id == undefined) {
            throw new AppError(NOT_FOUND, 'Cutting record id not found', 404);
        } else if (req.body.quantity == undefined) {
            throw new AppError(NOT_FOUND, 'Quantity not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.endCutting.replace(/\n/g, ' ');
                query = query.replace(/{cuttingQty}/gim, req.body.quantity);
                query = query.replace(/{id}/gim, req.body.id);
                updateQuery(query, resp);
            });
        }
    }
}));

cuttingRouter.post('/finish-cutting', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.productid == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else if (req.body.rawmaterialissueid == undefined) {
            throw new AppError(NOT_FOUND, 'Raw material issue id found', 404);
        } else if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.finishCutting.replace(/\n/g, ' ');
                query = query.replace(/{productid}/gim, req.body.productid);
                query = query.replace(/{rmsissueid}/gim, req.body.rawmaterialissueid);
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{revision}/gim, req.body.revision);
                updateQuery(query, resp);
            });
        }
    }
}));

cuttingRouter.post('/cutting-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.productid == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else if (req.body.rawmaterialissueid == undefined) {
            throw new AppError(NOT_FOUND, 'Raw material issue id found', 404);
        } else if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.cuttingStatusLimit1.replace(/\n/g, ' ');
                query = query.replace(/{productid}/gim, req.body.productid);
                query = query.replace(/{rmsid}/gim, req.body.rawmaterialissueid);
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{revision}/gim, req.body.revision);
                selectQuery(query, resp);
            });
        }
    }
}));

cuttingRouter.post('/cutting-quantity', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.productid == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else if (req.body.rawmaterialissueid == undefined) {
            throw new AppError(NOT_FOUND, 'Raw material issue id found', 404);
        } else if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.alreadyCutQuantity.replace(/\n/g, ' ');
                query = query.replace(/{productid}/gim, req.body.productid);
                query = query.replace(/{rmsissueid}/gim, req.body.rawmaterialissueid);
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{revision}/gim, req.body.revision);
                selectQuery(query, resp);
            });
        }
    }
}));

const defaultcuttingRouter = [
    tryCatch, AppError, errorHandler, varifyToken
];

defaultcuttingRouter.forEach((router) => {
    cuttingRouter.use(router);
});

module.exports = {
    cuttingRouter
}