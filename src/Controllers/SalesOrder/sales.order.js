// Author : Shital Gayakwad
// Created Date : 15 November 2024
// Description : Product structure

const express = require('express');
const salesOrderRouter = express.Router();
const properties = require('properties');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery,  executeSelectQuery } = require('../../Utils/file_read');

// All sales orders
salesOrderRouter.get('/assembly-all-orders-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[66].SS_SALESORDER, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.assemblyOrdersData.replace(/\n/g, " ");
            query = query.replace(/{fromdate}/gim, req.query.fromdate);
            query = query.replace(/{todate}/gim, req.query.todate);
            selectQuery(query, resp);
        });
    }
}));

// Generate assembly requirement
salesOrderRouter.post('/generate-assembly-component-requirement', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[67].PD_PRODUCT_BILLOFMATERIALOFASSEMBLY, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.generateRequirement.replace(/\n/g, " ");
            query = query.replace(/{childproduct_id}/gim, req.body.childproduct_id);
            query = query.replace(/{revision_number}/gim, req.body.revision_number);
            query = query.replace(/{sodetails_id}/gim, req.body.sodetails_id);
            query = query.replace(/{createdby}/gim, req.body.createdby);
            query = query.replace(/{order_quantity}/gim, req.body.order_quantity);
            const result = await executeSelectQuery(query);
            if (result != null) {
                if (result[0]['insert_assembly_components']['message'] == 'success') {
                    var newquery = data.generateBillOfMaterial.replace(/\n/g, " ");
                    newquery = newquery.replace(/{childproduct_id}/gim, req.body.childproduct_id);
                    newquery = newquery.replace(/{revision_number}/gim, req.body.revision_number);
                    newquery = newquery.replace(/{sodetails_id}/gim, req.body.sodetails_id);
                    newquery = newquery.replace(/{createdby}/gim, req.body.createdby);
                    newquery = newquery.replace(/{order_quantity}/gim, req.body.order_quantity);
                    newquery = newquery.replace(/{from}/gim, req.body.from);
                    newquery = newquery.replace(/{to}/gim, req.body.to);
                    const newresult = await executeSelectQuery(newquery);
                    if (newresult != null) {
                        resp.send(newresult[0]['assembly_bom_preparation']);
                    }
                } else {
                    resp.send(result[0]['insert_assembly_components']);
                }
            }
        });
    }

}));

// Discard generated requirement
salesOrderRouter.delete('/discard-assembly-component-requirement', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[67].PD_PRODUCT_BILLOFMATERIALOFASSEMBLY, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.discardComponentRequirement.replace(/\n/g, " ");
            query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
            query = query.replace(/{sodetails_id}/gim, req.body.sodetails_id);
            const result = await executeSelectQuery(query);
            if (result != null) {
                var newquery = data.deleteBillOfMaterial.replace(/\n/g, " ");
                newquery = newquery.replace(/{childproduct_id}/gim, req.body.parentproduct_id);
                newquery = newquery.replace(/{sodetails_id}/gim, req.body.sodetails_id);
                const newresult = await executeSelectQuery(newquery);
                resp.send(newresult);
            }
        });
    }
}));

// Selected products component requirement
salesOrderRouter.get('/selected-assemblies-component-requirements', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[67].PD_PRODUCT_BILLOFMATERIALOFASSEMBLY, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
             var query = data.assemblySelectedProductBOM.replace(/\n/g, " ");
            query = query.replace(/{fromdate}/gim, req.query.fromdate);
            query = query.replace(/{todate}/gim, req.query.todate);
            selectQuery(query, resp);
        });
    }
}));

// Current sales order for issue
salesOrderRouter.get('/current-sales-orders-for-issue', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[66].SS_SALESORDER, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.currentOrdersForIssueStock, resp);
        });
    }
}));

module.exports = {
    salesOrderRouter
}