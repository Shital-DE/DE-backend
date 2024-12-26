// Author : Shital Gayakwad
// Created Date : 6 July 2023
// Description : Assembly shop work log

const express = require('express');
const { tryCatch } = require('../Utils/ErrorHandling/tryCatch');
const workLogEntry = express.Router();
const properties = require('properties');
const { queryPath } = require('../Utils/Constants/query.path');
const { selectQuery, insertQuery, updateQuery } = require('../Utils/file_read');
const AppError = require('../Utils/ErrorHandling/appErrors');
const { NOT_FOUND } = require('../Utils/Constants/errorCodes');
const { varifyToken } = require('../Middlewares/varify_auth_token');
const { authorizeToken } = require('../Middlewares/generate_auth_token');

// Assembly process list
workLogEntry.get('/assembly-processes', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[20].CC_PROCESS_ASSEMBLYSHOP, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.assemblyProcesses, resp);
        });
    }
}));

// Start employee work -> Assembly
workLogEntry.post('/start-work', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.employee_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee id not found', 404);
        } else if (req.body.process_id == undefined) {
            throw new AppError(NOT_FOUND, 'Process id not found', 404);
        } else {
            properties.parse(queryPath[21].AS_WORKSTATION_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertRecord.replace(/\n/g, ' ');
                query = query.replace(/{employee_id}/gim, req.body.employee_id);
                query = query.replace(/{process_id}/gim, req.body.process_id);
                query = query.replace(/{createdby}/gim, req.body.createdby);
                insertQuery(query, resp);
            });
        }
    }
}));

// Employee work status
workLogEntry.post('/work-log-status', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.employee_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee id not found', 404);
        } else {
            properties.parse(queryPath[21].AS_WORKSTATION_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.statusOfWorklogEntry.replace(/\n/g, ' ');
                query = query.replace(/{employee_id}/gim, req.body.employee_id);
                selectQuery(query, resp);
            });
        }
    }
}));

// End work or complete work
workLogEntry.post('/end-work', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.worklogstatusId == undefined) {
            throw new AppError(NOT_FOUND, 'Work Log status id not found', 404);
        } else if (req.body.quantity == undefined) {
            throw new AppError(NOT_FOUND, 'Quantity not found', 404);
        } else {
            properties.parse(queryPath[21].AS_WORKSTATION_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.endWork.replace(/\n/g, ' ');
                query = query.replace(/{produced_qty}/gim, req.body.quantity);
                query = query.replace(/{worklogstatusId}/gim, req.body.worklogstatusId);
                updateQuery(query, resp);
            });
        }
    }
}));

// Employee's pending work
workLogEntry.get('/pending-work', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);

    if (userData) {
        properties.parse(queryPath[21].AS_WORKSTATION_STATUS, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.pendingWork, resp);
        });
    }
}));

module.exports = {
    workLogEntry
}
