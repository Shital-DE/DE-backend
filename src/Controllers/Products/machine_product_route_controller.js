// Author : Shital Gayakwad
// Created Date : 2 Sept 2023
// Description : Product route controller

const express = require('express');
const productMachineRouteRouter = express.Router();
const properties = require('properties');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const { queryPath } = require('../../Utils/Constants/query.path');
const { insertQuery } = require('../../Utils/file_read');

// Insert product machine route
productMachineRouteRouter.post('/product-machine-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.product_id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } if (req.body.product_revision == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } if (req.body.workcentre_id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } if (req.body.workstation_id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else {
            properties.parse(queryPath[30].PD_PRODUCT_PRODUCTROUTE_LAST, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertRecord.replace(/\n/g, ' ');
                query = query.replace(/{product_id}/gim, req.body.product_id);
                query = query.replace(/{product_revision}/gim, req.body.product_revision);
                query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
                query = query.replace(/{workstation_id}/gim, req.body.workstation_id);
                insertQuery(query, resp);
            });
        }
    }
}));

module.exports = {
    productMachineRouteRouter
}