
// Author : Shital Gayakwad
// Created Date : 3 March 2023
// Description : ERPX_PPC -> android id controller

const express = require('express');
const { errorHandler } = require('../../Middlewares/error_handler');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { androidIdValidation, tabletIsAssignedOrNotValidation } = require('../../Validations/machine.validate');
const machineNameRouter = express.Router();
const { selectQuery, updateQuery, deleteQuery } = require('../../Utils/file_read');
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');

//For fetching machine name on appbar
machineNameRouter.post('/machine-name', varifyToken, tryCatch(async (req, resp) => {
    const androidId = req.body.androidId;
    const userdata = authorizeToken(req.token);
    const { error, value } = androidIdValidation.validate({});
    if (userdata) {
        if (androidId == undefined) {
            throw new AppError(NOT_FOUND, 'Android id not found', 404);
        }
        properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.androidId.replace(/\n/g, ' ');
            query = query.replace(/{androidid}/gim, androidId.trim());
            selectQuery(query, resp);
        });
    }
}
));

//For checking machine is automatic or manual
machineNameRouter.post('/assigned-or-not', varifyToken, tryCatch(async (req, resp) => {
    const workstationId = req.body.workstation_id;
    const userData = authorizeToken(req.token);
    const { error, value } = tabletIsAssignedOrNotValidation.validate({});
    if (userData) {
        if (workstationId == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found');
        } else {
            properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.checkTabIsAlreadyRegisteredOrNot.replace(/\n/g, ' ');
                query = query.replace(/{id}/gim, workstationId);
                selectQuery(query, resp);
            });
        }
    }
}));

//For getting list of all workstation for checking which machine has assigned tablet
machineNameRouter.get('/assigned-tablets', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.allWorkstationsWithAndroidId.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

//For tablet registration
machineNameRouter.put('/register-tab', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const id = req.body.id;
    const android_id = req.body.android_id;
    if (userData) {
        if (id == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found');
        } else if (android_id == undefined) {
            throw new AppError(NOT_FOUND, 'Android id not found');
        } else {
            properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.tabletRegistrationAPI.replace(/\n/g, ' ');
                query = query.replace(/{stationId}/g, id);
                query = query.replace(/{androidid}/g, android_id);
                updateQuery(query, resp);
            });
        }
    }
}));

//Delete Assigned Tab
machineNameRouter.delete('/delete-tab', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.id == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found');
        }
        else {
            properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.deleteAndroidId.replace(/\n/g, ' ');
                query = query.replace(/{stationId}/g, req.body.id);
                deleteQuery(query, resp);
            });
        }
    }
}));

const defaultmachineNameRouter = [
    varifyToken, tryCatch, errorHandler, AppError
];

defaultmachineNameRouter.forEach((router) => {
    machineNameRouter.use(router);
});

module.exports = {
    machineNameRouter
}