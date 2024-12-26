
// Author : Shital Gayakwad
// Created Date : 5 Dec 2023
// Description : Instrument type

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { queryPath } = require("../../Utils/Constants/query.path");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { selectQuery, insertQuery, updateQuery } = require("../../Utils/file_read");
const instrumentTypeRegistration = express.Router();

// Register instrument type
instrumentTypeRegistration.post('/register', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[43].CC_INSTRUMENTTYPE,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertQuery.replace(/\n/g, " ");
                query = query.replace(/{userid}/g, req.body.userid);
                query = query.replace(/{descrption}/g, req.body.descrption);
                insertQuery(query, resp);
            }
        );
    }
}));

// Instrument type data
instrumentTypeRegistration.get('/data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[43].CC_INSTRUMENTTYPE,
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

// Delete instrument type
instrumentTypeRegistration.post('/delete', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[43].CC_INSTRUMENTTYPE,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.deleteQuery.replace(/\n/g, " ");
                query = query.replace(/{id}/g, req.body.id);
                updateQuery(query, resp);
            }
        );
    }
}));

// Register manufacturer
instrumentTypeRegistration.post('/register-manufacturer', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[59].CC_INSTRUMENTMANUFACTURER,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertQuery.replace(/\n/g, " ");
                query = query.replace(/{userid}/g, req.body.userid);
                query = query.replace(/{descrption}/g, req.body.descrption);
                insertQuery(query, resp);
            }
        );
    }
}));

// Manufacturer data
instrumentTypeRegistration.get('/manufacturer-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[59].CC_INSTRUMENTMANUFACTURER,
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

// Delete instrument type
instrumentTypeRegistration.post('/delete-manufacturer', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[59].CC_INSTRUMENTMANUFACTURER,
            { path: true },
            function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.deleteQuery.replace(/\n/g, " ");
                query = query.replace(/{id}/g, req.body.id);
                // console.log(query);
                updateQuery(query, resp);
            }
        );
    }
}));

module.exports = {
    instrumentTypeRegistration
}