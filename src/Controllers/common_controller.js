// Author : Shital Gayakwad
// Created Date : 14 March 2023
// Description : ERPX_PPC -> Common controller
// Modified Date : 13 March 2023
// Modified Description = current-database-time api

const express = require('express');
const { errorHandler } = require('../Middlewares/error_handler');
const { authorizeToken } = require('../Middlewares/generate_auth_token');
const { varifyToken } = require('../Middlewares/varify_auth_token');
const AppError = require('../Utils/ErrorHandling/appErrors');
const { tryCatch } = require('../Utils/ErrorHandling/tryCatch');
const { selectQuery } = require('../Utils/file_read');
const eveRouter = express.Router();
const { queryPath } = require('../Utils/Constants/query.path');
const properties = require('properties');
const { NOT_FOUND } = require('../Utils/Constants/errorCodes');
const { sendEmail } = require('../Services/calibration.service');

eveRouter.get('/shift-pattern', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[1].CC_SHIFTPATTERN, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.shiftpattern, resp);
        });
    }
}));

eveRouter.get('/company-name', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[0].CC_COMPANY, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.company, resp);
        });
    }
}));

eveRouter.get('/current-database-time', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[8].DATABASE_CURRENT_TIME, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.now, resp);
        });
    }
}));

eveRouter.get('/processes', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[31].CC_PROCESS, { path: true }, function (error, query) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(query.selectQuery, resp);
        });
    }
}));

// Send bulk mail
eveRouter.post('/send-bulk-mail', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        var retursuccesslist = [];
        for (let i = 0; i < req.body.tabledata.length; i++) {
            const from = 'erpdatta@datta.co.in';
            const mailcontent = generateEmailContent({ toname: req.body.tabledata[i][1] });
            const response = await sendEmail({
                from: from,
                to: req.body.tabledata[i][5],
                subject: "Test mail from ERP",
                content: mailcontent
            });
            if (response.success == true) {
                retursuccesslist.push(response.success);
            } else {
                resp.send('The email sending process has failed');
            }
            if (req.body.tabledata.length == retursuccesslist.length) {
                resp.send({
                    'status code': 200,
                    'message': 'Success',
                })
            }
        }
    }
}));


function generateEmailContent({ toname }) {
    const content = `Dear ${toname},<br> <br> 
                    This mail for testing purpose from ERP Database. <br><br>
                     <br>
                    Best regards, <br> <br> 
                    Datta Enterprises`;
    return content;
}

// Fiscal year
eveRouter.get('/fiscal-year', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[64].CC_CALENDAR, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.fiscalYear, resp);
        });
    }
}));

// Unit of measurement
eveRouter.get('/unit-of-measurement-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[14].COMMON, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.uom, resp);
        });
    }
}));

// Product type
eveRouter.get('/product-type-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[14].COMMON, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.producttype, resp);
        });
    }
}));


const defaultCommonRouter = [tryCatch, AppError, errorHandler, varifyToken];

defaultCommonRouter.forEach((router) => {
    eveRouter.use(router);
});

module.exports = {
    eveRouter
}


