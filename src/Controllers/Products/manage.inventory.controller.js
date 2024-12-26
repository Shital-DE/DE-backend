// Author : Shital Gayakwad
// Created Date : 28-11-2024
// Description : Product inventory management

const express = require('express');
const inventoryManagementRouter = express.Router();
const properties = require('properties');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { queryPath } = require('../../Utils/Constants/query.path');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { executeSelectQuery } = require('../../Utils/file_read');

// Inward and issue product stock
inventoryManagementRouter.post('/manage-product-inventory', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[68].MANAGE_INVENTORY, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.inventoryManagementQuery.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{revision_number}/gim, req.body.revision_number);
            query = query.replace(/{createdby}/gim, req.body.createdby);
            query = query.replace(/{new_quantity}/gim, req.body.new_quantity);
            query = query.replace(/{preUOM}/gim, req.body.preUOM);
            query = query.replace(/{postUOM}/gim, req.body.postUOM);
            query = query.replace(/{drcr}/gim, req.body.drcr);
            query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id == undefined? 'null': req.body.parentproduct_id );
            query = query.replace(/{sodetails_id}/gim, req.body.sodetails_id == undefined? 'null': req.body.sodetails_id);
            query = query.replace(/{remark}/gim, req.body.remark == undefined? 'null': req.body.remark);
            var result = await executeSelectQuery(query);
            // console.log();
            if (result.severity == 'ERROR') {
                resp.send([{ 'message': 'No conversion rate found for selected unit of measurement.', }])
            } else {
                resp.send([{'message': 'success', 'id': result[0]['id']} ]);
            }
        });
    }
}));

// Current stock
inventoryManagementRouter.get('/product-current-stock', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[68].MANAGE_INVENTORY, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.currentStock.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.query.product_id);
            var result = await executeSelectQuery(query);
            if (result) {
                resp.send(result);
            } else {
                resp.send([{
                    'currentstock': 0
                }])
            }
        });
    }
}));

// Issued stock
inventoryManagementRouter.get('/issued-stock', varifyToken, tryCatch(async (req, resp) => {

    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[68].MANAGE_INVENTORY, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.alreadyIssuedStockOfSelectedProduct.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.query.product_id);
            query = query.replace(/{revision_number}/gim, req.query.revision_number);
            query = query.replace(/{parentproduct_id}/gim, req.query.parentproduct_id);
            query = query.replace(/{sodetails_id}/gim, req.query.sodetails_id);
            var result = await executeSelectQuery(query);
            if (result) {
                resp.send(result);
            } else {
                resp.send({
                    'total_issued_stock': 0,
                    'issued_stock': []
                });
            }
        });
    }
}))

module.exports = {
    inventoryManagementRouter
}