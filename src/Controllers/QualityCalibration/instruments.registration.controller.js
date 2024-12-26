
// Author : Shital Gayakwad
// Created Date : 16 Nov 2023
// Description : Quality instruments registration

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const instrumentRegistration = express.Router();
const { queryPath } = require("../../Utils/Constants/query.path");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { insertQuery, selectQuery, deleteQuery } = require("../../Utils/file_read");

// All measuring instruments from pdf product
instrumentRegistration.get('/measuring-instruments', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[4].PD_PRODUCT,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                selectQuery(data.measuringInstruments, resp);
            }
        );
    }
}));

// Register measuring instruments
instrumentRegistration.post('/register', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[44].PD_PRODUCT_MEASURINGINSTRUMENT,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertQuery.replace(/\n/g, " ");
                query = query.replace(/{createdby}/g, req.body.createdby);
                query = query.replace(/{instrumenttype_id}/g, req.body.instrumenttype_id);
                query = query.replace(/{product_id}/g, req.body.product_id);
                const updatedInstrumentName = req.body.instrumentname.replace(/'/g, "''");
                query = query.replace(/{instrumentname}/g, updatedInstrumentName.trim());
                const updatedDescription = req.body.description.replace(/'/g, "''");
                query = query.replace(/{description}/g, updatedDescription.trim());
                const updatedSubcategory = req.body.subcategory.replace(/'/g, "''");
                query = query.replace(/{subcategory}/g, updatedSubcategory.trim());
                insertQuery(query, resp);
            }
        );
    }
}));

// All instruments
instrumentRegistration.get('/get-all-instruments', varifyToken, tryCatch((req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[44].PD_PRODUCT_MEASURINGINSTRUMENT,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                selectQuery(data.selectQuery, resp);
            }
        );
    }
}));

module.exports = {
    instrumentRegistration
}

