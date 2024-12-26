// Author : Shital Gayakwad
// Created Date : 24-10-2024
// Description : Product structure

const express = require('express');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const productStructureRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { insertQuery, selectQuery, executeSelectQuery, updateQuery, deleteQuery } = require('../../Utils/file_read');
const AppError = require('../../Utils/ErrorHandling/appErrors');

// Product tree representation
productStructureRouter.post('/product-structure-tree-representation', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[65].PD_PRODUCT_STRUCTURE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            if (req.body.stucture_table_id == undefined) {
                var query = data.productTreeRepresentation.replace(/\n/g, ' ');
                query = query.replace(/{childproduct_id}/gim, req.body.id);
                query = query.replace(/{revision_number}/gim, req.body.revision_number);
                query = query.replace(/{quantity}/gim, req.body.quantity == undefined ? 1 : req.body.quantity);
                query = query.replace(/{sodetails_id}/gim, req.body.sodetails_id == undefined ? null : req.body.sodetails_id);
                // console.log(1, query);
                selectQuery(query, resp);
            } else {
                var query = data.structureTableOneRecord.replace(/\n/g, ' ');
                query = query.replace(/{id}/gim, req.body.stucture_table_id);
                query = query.replace(/{quantity}/gim, req.body.quantity == undefined ? 1 : req.body.quantity);
                // console.log(2, query);
                selectQuery(query, resp);
            }
        });
    }
}));

// Update product details
productStructureRouter.put('/update-product-details', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[65].PD_PRODUCT_STRUCTURE, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.productStructureHistory.replace(/\n/g, ' ');
            query = query.replace(/{createdby}/gim, req.body.createdby);
            query = query.replace(/{productstructure_id}/gim, req.body.id);
            query = query.replace(/{quantity}/gim, req.body.old_quantity);
            query = query.replace(/{minorderqty}/gim, req.body.old_minimumorderqty);
            query = query.replace(/{reorderlevel}/gim, req.body.old_reorderlevel);
            query = query.replace(/{leadtime}/gim, req.body.old_leadtime);
            const result = await executeSelectQuery(query);
            if (result != null) {
                var query = data.updateQuery.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby);
                query = query.replace(/{id}/gim, req.body.id);
                query = query.replace(/{quantity}/gim, req.body.new_quantity);
                query = query.replace(/{minimumorderqty}/gim, req.body.new_minimumorderqty);
                query = query.replace(/{reorderlevel}/gim, req.body.new_reorderlevel);
                query = query.replace(/{leadtime}/gim, req.body.new_leadtime);
                updateQuery(query, resp);
            }
        });
    }
}));

// Register child products
productStructureRouter.post('/register-product-structure', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[65].PD_PRODUCT_STRUCTURE, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var ids = [];
            if (req.body.selectedProducts == undefined) {
                var query = data.insertQuery.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby);
                query = query.replace(/{childproduct_id}/gim, req.body.childproduct_id);
                query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                query = query.replace(/{level}/gim, req.body.level);
                query = query.replace(/{quantity}/gim, req.body.quantity);
                query = query.replace(/{reorderlevel}/gim, req.body.reorderlevel);
                query = query.replace(/{minimumorderqty}/gim, req.body.minimumorderqty);
                query = query.replace(/{leadtime}/gim, req.body.leadtime);
                query = query.replace(/{revision_number}/gim, req.body.revision_number);
                insertQuery(query, resp);
            } else {
                for (var item of req.body.selectedProducts) {
                    if (item['productTypeId'] == '4028b88151c96d3f0151c96fd3120001') {
                        var dataquery = data.productTreeRepresentation.replace(/\n/g, ' ');
                        dataquery = dataquery.replace(/{childproduct_id}/gim, item.productid);
                        dataquery = dataquery.replace(/{revision_number}/gim, item.revision);
                        var result = await executeSelectQuery(dataquery);
                        if (result[0]['build_product_structure'].length != 0) {
                            var query = data.insertQuery.replace(/\n/g, ' ');
                            query = query.replace(/{createdby}/gim, req.body.createdby);
                            query = query.replace(/{childproduct_id}/gim, item['productid']);
                            query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                            query = query.replace(/{level}/gim, req.body.level);
                            query = query.replace(/{quantity}/gim, 1);
                            query = query.replace(/{reorderlevel}/gim, 0);
                            query = query.replace(/{minimumorderqty}/gim, 0);
                            query = query.replace(/{leadtime}/gim, 0);
                            query = query.replace(/{revision_number}/gim, item['revision']);
                            var newresult = await executeSelectQuery(query);
                            if (newresult != null) {
                                ids.push(newresult);
                            }
                        } else {
                            ids.push(['new']);
                            for (var levelVal of [0, 1]) {
                                var query = data.insertQuery.replace(/\n/g, ' ');
                                query = query.replace(/{createdby}/gim, req.body.createdby);
                                query = query.replace(/{childproduct_id}/gim, item['productid']);
                                query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                                query = query.replace(/{level}/gim, levelVal);
                                query = query.replace(/{quantity}/gim, 1);
                                query = query.replace(/{reorderlevel}/gim, 0);
                                query = query.replace(/{minimumorderqty}/gim, 0);
                                query = query.replace(/{leadtime}/gim, 0);
                                query = query.replace(/{revision_number}/gim, item['revision']);
                                await executeSelectQuery(query);
                            }

                        }
                    } else {
                        var query = data.insertQuery.replace(/\n/g, ' ');
                        query = query.replace(/{createdby}/gim, req.body.createdby);
                        query = query.replace(/{childproduct_id}/gim, item['productid']);
                        query = query.replace(/{parentproduct_id}/gim, req.body.parentproduct_id);
                        query = query.replace(/{level}/gim, req.body.level);
                        query = query.replace(/{quantity}/gim, 1);
                        query = query.replace(/{reorderlevel}/gim, 0);
                        query = query.replace(/{minimumorderqty}/gim, 0);
                        query = query.replace(/{leadtime}/gim, 0);
                        query = query.replace(/{revision_number}/gim, item['revision']);
                        var result = await executeSelectQuery(query);
                        if (result != null) {
                            ids.push(result);
                        }
                    }
                }
                if (req.body.selectedProducts.length = ids.length) {
                    resp.send({ 'Status code': 200, 'Message': 'Success' });
                }
            }
        });
    }
}));

// Delete product from product structure
productStructureRouter.delete('/delete-product-from-product-structure', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[65].PD_PRODUCT_STRUCTURE, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteQuery.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));

module.exports = {
    productStructureRouter
}