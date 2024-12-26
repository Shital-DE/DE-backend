const express = require('express');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const { errorHandler } = require('../../Middlewares/error_handler');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { selectQuery, insertQuery } = require('../../Utils/file_read');
const { workstationBywcIdValidate, registerWsValidation } = require('../../Validations/machine.validate');
const workstationRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');

workstationRouter.post('/ws-by-wc_id', varifyToken, tryCatch(async (req, resp) => {
    const workcentreId = req.body.workcentre_id;
    const { error, value } = workstationBywcIdValidate.validate({});
    const userData = authorizeToken(req.token);
    if (userData) {
        if (workcentreId == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else {
            properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workstationsBywordkcentreId.replace(/\n/g, ' ');
                query = query.replace(/{wr_workcentre_id}/g, workcentreId);
                selectQuery(query, resp);
            });
        }
    }
}));

workstationRouter.post('/register-ws', varifyToken, tryCatch(async (req, resp) => {
    const { error, value } = registerWsValidation.validate({});
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Employee name not found', 404);
        } else if (req.body.wr_workcentre_id == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.shiftpattern_id == undefined) {
            throw new AppError(NOT_FOUND, 'Shift pattern id not found', 404);
        } else if (req.body.code == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre name not found', 404);
        } else if (req.body.workstationgroup_code == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation group code not found', 404);
        } else if (req.body.isinhouse == undefined) {
            throw new AppError(NOT_FOUND, 'Is in house or not?', 404);
        } else {
            const payload = new Map();
            properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerWorkstation.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/g, req.body.createdby);
                query = query.replace(/{wr_workcentre_id}/g, req.body.wr_workcentre_id);
                query = query.replace(/{shiftpattern_id}/g, req.body.shiftpattern_id);
                query = query.replace(/{code}/g, req.body.code);
                query = query.replace(/{workstationgroup_code}/g, req.body.workstationgroup_code);
                query = query.replace(/{isinhouse}/g, req.body.isinhouse);
                insertQuery(query, resp);
            });
        }
    }
}));

// Assembly assigned workstations 
workstationRouter.get('/assembly-assigned-workstations', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.assemblyAssignedWorkstations.replace(/\n/g, ' ');
            query = query.replace(/{android_id}/g, req.query.android_id);
            selectQuery(query, resp);
        });
    }
}));

// Assembly workstations
workstationRouter.get('/assembly-workstations', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.assemblyWorkstations, resp);
        });
    }
}));

const defaultworkstationRouter = [
    varifyToken, tryCatch, errorHandler, AppError
]

defaultworkstationRouter.forEach((router) => {
    workstationRouter.use(router);
});

module.exports = {
    workstationRouter
}