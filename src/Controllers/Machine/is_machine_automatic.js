// Author : Shital Gayakwad
// Created Date : 5 March 2023
// Description : ERPX_PPC -> API is to see whether the machine is automatic or manual

const express = require('express');
const machineValidationRouter = express.Router();
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const { errorHandler } = require('../../Middlewares/error_handler');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { isMachineAutoValidation } = require('../../Validations/machine.validate');
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery } = require('../../Utils/file_read');

machineValidationRouter.post('/manual-automatic', varifyToken, tryCatch(async (req, resp) => {
    const workcentre_id = req.body.workcentre_id;
    const workstation_id = req.body.workstation_id;
    const { error, value } = isMachineAutoValidation.validate({});
    const userData = authorizeToken(req.token);
    if (userData) {
        if (workcentre_id == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (workstation_id == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found', 404);
        } else {
            properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.isMachineAutomatic.replace(/\n/g, ' ');
                query = query.replace(/{id}/g, workstation_id);
                query = query.replace(/{wr_workcentre_id}/g, workcentre_id);
                selectQuery(query, resp);
            });
        }
    }
}));

const defaultMachineValidationRouter = [
    tryCatch, errorHandler, AppError,
];

defaultMachineValidationRouter.forEach((router) => {
    machineValidationRouter.use(router);
});

module.exports = {
    machineValidationRouter
}
