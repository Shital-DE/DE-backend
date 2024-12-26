const express = require('express');
const { varifyToken } = require('../Middlewares/varify_auth_token');
const { authorizeToken } = require('../Middlewares/generate_auth_token');
const { tryCatch } = require('../Utils/ErrorHandling/tryCatch');
const stockinward = express.Router();
const properties = require('properties');
const { queryPath } = require('../Utils/Constants/query.path');
const { selectQuery, insertQuery, updateQuery } = require('../Utils/file_read');
const AppError = require('../Utils/ErrorHandling/appErrors');
const { NOT_FOUND } = require('../Utils/Constants/errorCodes');


stockinward.get('/getstockdata', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[27].AS_PD_PRODUCT_STOCK, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }

            selectQuery(data.getstockproduct, resp);
        });
    }
})); //stocklog

stockinward.post('/stocklog', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);

    if (userData) {
        if (req.body.productid == undefined) {
            throw new AppError(NOT_FOUND, 'product_id not found', 404);
        } else if (req.body.productcode == undefined) {
            throw new AppError(NOT_FOUND, 'productcode not found', 404);
        } else if (req.body.employeeid == undefined) {
            throw new AppError(NOT_FOUND, 'employee_id not found', 404);
        } else if (req.body.stocktype == undefined) {
            throw new AppError(NOT_FOUND, 'stocktype found', 404);
        } else if (req.body.value == undefined) {
            throw new AppError(NOT_FOUND, 'stockvalue not found', 404);
        }
        else {
            properties.parse(queryPath[27].AS_PD_PRODUCT_STOCK, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.stockloginsert.replace(/\n/g, ' ');
                query = query.replace(/{product_id}/gim, req.body.productid);
                query = query.replace(/{code}/gim, req.body.productcode.trim());
                query = query.replace(/{employee_id}/gim, req.body.employeeid);
                query = query.replace(/{stock_type}/gim, req.body.stocktype);
                query = query.replace(/{quantity}/gim, req.body.value);
                insertQuery(query, resp);
            });
        }
    }
}));


stockinward.post('/updatestock', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee id not found', 404);
        }
        else if (req.body.balance == undefined) {
            throw new AppError(NOT_FOUND, 'balance not found', 404);
        }
        else {
            properties.parse(queryPath[27].AS_PD_PRODUCT_STOCK, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.updatestock.replace(/\n/g, ' ');
                query = query.replace(/{as_pd_product_stock_id}/gim, req.body.id);
                query = query.replace(/{balancevalue}/gim, req.body.balance);

                updateQuery(query, resp);

            });
        }
    }
}));










module.exports = {
    stockinward
}
