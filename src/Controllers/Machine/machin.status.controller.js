// Author : Shital Gayakwad
// Created Date : 13 April 2023
// Description : ERPX_PPC -> Datta Enterprises Production System

const express = require('express');
const workcentreStatusRouter = express.Router();
const properties = require('properties');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { errorHandler } = require('../../Middlewares/error_handler');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery } = require('../../Utils/file_read');
const { workcentreStatusValidation } = require('../../Validations/machine.validate');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');

// Recent 100 records
workcentreStatusRouter.get('/recent-100-records', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.recentRecords, resp);
        });
    }
}));

// Workcentre status
workcentreStatusRouter.post('/workcentre', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const { error, value } = workcentreStatusValidation.validate({});
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workcentreStatus.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                selectQuery(query, resp);
            });

        }
    }
}));

// Workstation status
workcentreStatusRouter.post('/workstation', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.workstationid == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workstationStatus.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{workstationid}/gim, req.body.workstationid);
                selectQuery(query, resp);
            });
        }
    }
}));

// workcentre periodic status
workcentreStatusRouter.post('/workcentre-periodic', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.from == undefined) {
            throw new AppError(NOT_FOUND, 'From date not found', 404);
        } else if (req.body.to == undefined) {
            throw new AppError(NOT_FOUND, 'To date not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workCentrePeriodicData.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{from}/gim, req.body.from);
                query = query.replace(/{to}/gim, req.body.to);
                selectQuery(query, resp);
            });
        }
    }
}));


//Workstation periodic status
workcentreStatusRouter.post('/workstation-periodic', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.workstationid == undefined) {
            throw new AppError(NOT_FOUND, 'workstationid id not found', 404);
        } else if (req.body.from == undefined) {
            throw new AppError(NOT_FOUND, 'From date not found', 404);
        } else if (req.body.to == undefined) {
            throw new AppError(NOT_FOUND, 'To date not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workstationPeriodicData.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{workstationid}/gim, req.body.workstationid);
                query = query.replace(/{from}/gim, req.body.from);
                query = query.replace(/{to}/gim, req.body.to);
                selectQuery(query, resp);
            });
        }
    }
}));


//Workcentre selected month status
workcentreStatusRouter.post('/workcentre-selected-month-status', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.date == undefined) {
            throw new AppError(NOT_FOUND, 'Date not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.selectedMonthWorkcentre.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{date}/gim, req.body.date);
                selectQuery(query, resp);
            });
        }
    }
}));

//Workstation selected month status 
workcentreStatusRouter.post('/workstation-selected-month-status', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (req.body.workcentreid == undefined) {
        throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
    } else if (req.body.workstationid == undefined) {
        throw new AppError(NOT_FOUND, 'Workstation id not found', 404);
    } else if (req.body.date == undefined) {
        throw new AppError(NOT_FOUND, 'Date not found', 404);
    } else {
        properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.selectedMonthWorkstation.replace(/\n/g, ' ');
            query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
            query = query.replace(/{workstationid}/gim, req.body.workstationid);
            query = query.replace(/{date}/gim, req.body.date);
            selectQuery(query, resp);
        });
    }
}));

// Employee list who worked on perticular workcentre
workcentreStatusRouter.post('/workcentre-employee', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.employee.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                selectQuery(query, resp);
            });
        }
    }
}));

// Workcentre status by employee list
workcentreStatusRouter.post('/workcentre-status-by-employee', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.employeeid == undefined) {
            throw new AppError(NOT_FOUND, 'Employee id not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workcentreStatusByEmployeeId.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{employeeid}/gim, req.body.employeeid);
                selectQuery(query, resp);
            });
        }
    }
}));

//  Employee list who worked on perticular workstation
workcentreStatusRouter.post('/workstation-employee', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.workstationid == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.employeeWorkstation.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{workstationid}/gim, req.body.workstationid);
                selectQuery(query, resp);
            });
        }
    }
}));

// Workstation status by employee list
workcentreStatusRouter.post('/workstation-status-by-employee', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.workcentreid == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.workstationid == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found', 404);
        } else if (req.body.employeeid == undefined) {
            throw new AppError(NOT_FOUND, 'Employee id not found', 404);
        } else {
            properties.parse(queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.workstationStatusByEmployeeId.replace(/\n/g, ' ');
                query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
                query = query.replace(/{workstationid}/gim, req.body.workstationid);
                query = query.replace(/{employeeid}/gim, req.body.employeeid);
                selectQuery(query, resp);
            });
        }
    }
}));

const defaultworkcentreStatusRouter = [AppError, tryCatch, errorHandler];

defaultworkcentreStatusRouter.forEach((router) => {
    workcentreStatusRouter.use(router);
});

module.exports = {
    workcentreStatusRouter
}