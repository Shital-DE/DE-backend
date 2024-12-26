// Author : Shital Gayakwad
// Created Date : 13 July 2023
// Description : Assembly shop router

const express = require('express');
const { varifyToken } = require('../Middlewares/varify_auth_token');
const { tryCatch } = require('../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../Middlewares/generate_auth_token');
const AppError = require('../Utils/ErrorHandling/appErrors');
const { NOT_FOUND } = require('../Utils/Constants/errorCodes');
const processRegistrationRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../Utils/Constants/query.path');
const { insertQuery } = require('../Utils/file_read');

processRegistrationRouter.post('/register-process', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.process == undefined) {
            throw new AppError(NOT_FOUND, 'Process not found', 404);
        } else if (req.body.inhouse == undefined) {
            throw new AppError(NOT_FOUND, 'Is in house not found', 404);
        } else if (req.body.main_process == undefined) {
            throw new AppError(NOT_FOUND, 'Main process not found', 404);
        } else if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else {
            properties.parse(queryPath[20].CC_PROCESS_ASSEMBLYSHOP, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerProcess.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby);
                query = query.replace(/{isinhouse}/gim, req.body.inhouse);
                query = query.replace(/{ismainprocess}/gim, req.body.main_process);
                query = query.replace(/{process}/gim, req.body.process);
                insertQuery(query, resp);
            });
        }
    }
}));

module.exports = {
    processRegistrationRouter
}