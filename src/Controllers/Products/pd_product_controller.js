// Author : Shital Gayakwad
// Created Date : 30 Dec 2022
// Description : ERPX_PPC -> All Products 
//Modified Date : 19 Feb 2023

const express = require('express');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const allProductRouter = express.Router();
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { oneProductValidation, asproductValidation } = require('../../Validations/product.validation');
const { errorHandler } = require('../../Middlewares/error_handler');
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery, insertQuery } = require('../../Utils/file_read');
const { NOT_FOUND, UNAUTHORIZED } = require('../../Utils/Constants/errorCodes');

//All Products Data
allProductRouter.get('/get-all-products', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.allProductQuery, resp);
        });
    } else {
        throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
    }
}));

//One products data
allProductRouter.get('/get-one-product', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { error, value } = oneProductValidation.validate({});
    if (userdata) {
        if (req.body.id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found.', 404);
        }
        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            query = query.oneProductQuery.replace(/oneProductQueryid/gim, req.body.id);
            selectQuery(query, resp);
        });
    }

}));

allProductRouter.post('/productMasterData', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else {
            properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.productMasterData.replace(/\n/g, ' ');
                query = query.replace(/{productid}/g, req.body.id);

                selectQuery(query, resp);
            });
        }
    }
}));



allProductRouter.get('/allproductsList', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {


        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.allProductlist, resp);
        });
    } else {
        throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
    }
}));


allProductRouter.post('/AssemblyProductData', varifyToken, tryCatch(async (req, resp) => {

    const userdata = authorizeToken(req.token);
    const { error, value } = asproductValidation.validate({});
    if (userdata) {

        if (req.body.id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found.', 404);
        }
        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            query = query.asproductdata.replace(/{product_id}/gim, req.body.id);

            selectQuery(query, resp);
        });
    }

}))

allProductRouter.post('/insertproductdata', varifyToken, tryCatch(async (req, resp) => {

    const userdata = authorizeToken(req.token);


    if (userdata) {

        if (req.body.productid == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found.', 404);
        }
        else if (req.body.product == undefined) {
            throw new AppError(NOT_FOUND, 'product not found.', 404);
        }
        else if (req.body.description == undefined) {
            throw new AppError(NOT_FOUND, 'description not found.', 404);
        }
        else if (req.body.producttypeid == undefined) {
            throw new AppError(NOT_FOUND, 'producttypeid not found.', 404);
        }
        else if (req.body.producttypename == undefined) {
            throw new AppError(NOT_FOUND, 'producttypename not found.', 404);
        }
        else if (req.body.category == undefined) {
            throw new AppError(NOT_FOUND, 'category not found.', 404);
        }
        else if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'createdby not found.', 404);
        }
        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.insertproductinmaster.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.body.productid);
            query = query.replace(/{productcode}/gim, req.body.product);
            query = query.replace(/{description}/gim, req.body.description);
            query = query.replace(/{producttypeid}/gim, req.body.producttypeid);
            query = query.replace(/{producttypename}/gim, req.body.producttypename);
            query = query.replace(/{category}/gim, req.body.category);
            query = query.replace(/{createdby}/gim, req.body.createdby);

            insertQuery(query, resp);
        });
    }

}))

// Register measuring instrument
allProductRouter.post('/register-instruments', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.code == undefined) {
            throw new AppError(NOT_FOUND, 'Product code not found', 404);
        } else if (req.body.storagelocation == undefined) {
            throw new AppError(NOT_FOUND, 'Storage location not found', 404);
        } else if (req.body.racknumber == undefined) {
            throw new AppError(NOT_FOUND, 'Rack number not found', 404);
        } else if (req.body.description == undefined) {
            throw new AppError(NOT_FOUND, 'Description not found', 404);
        } else {
            properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerInstruments.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby);
                query = query.replace(/{code}/gim, req.body.code);
                query = query.replace(/{storagelocation}/gim, req.body.storagelocation);
                query = query.replace(/{racknumber}/gim, req.body.racknumber);
                query = query.replace(/{description}/gim, req.body.description);
                insertQuery(query, resp);
            });
        }
    }
}));

// Instruments return id
allProductRouter.post('/instrument-return-id', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.code == undefined) {
            throw new AppError(NOT_FOUND, 'Product code not found', 404);
        } else {
            properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.instrumentReturnId.replace(/\n/g, ' ');
                query = query.replace(/{code}/gim, req.body.code);
                selectQuery(query, resp);
            });
        }
    }
}));

// Product list for product structure
allProductRouter.get('/product-list-for-fill-assembly-structure', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.productListForFillProductStructure, resp);
        });
    }
}));

const defaultallProductRouter = [
    errorHandler, authorizeToken, tryCatch, AppError
]

defaultallProductRouter.forEach((router) => {
    allProductRouter.use(router);
})

module.exports = { allProductRouter };