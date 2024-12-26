
const express = require('express');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { selectQuery } = require('../../Utils/file_read');
const { registerWcValidation } = require('../../Validations/machine.validate');
const workcentreRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');

const wc = require('../../Services/workstationService');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { errorHandler } = require('../../Middlewares/error_handler');


workcentreRouter.get('/all-wc-list', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[6].WR_WORKCENTRE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.getAllWorkcentres, resp);
        });
    }
}));

workcentreRouter.get('/is-in-house', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[6].WR_WORKCENTRE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.isinHouseWorkcentres, resp);
        });
    }
}));

workcentreRouter.post('/register-wc', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const { error, value } = registerWcValidation.validate({});
    if (userData) {
        if (req.body.workcentre_code == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre name not found', 404);
        } else if (req.body.shiftpattern_id == undefined) {
            throw new AppError(NOT_FOUND, 'Shift pattern id not found', 404);
        } else if (req.body.company_id == undefined) {
            throw new AppError(NOT_FOUND, 'Compnay id not found', 404);
        } else if (req.body.company_code == undefined) {
            throw new AppError(NOT_FOUND, 'Company name not found', 404);
        } else if (req.body.defaultmin == undefined) {
            throw new AppError(NOT_FOUND, 'Default minutes not found', 404);
        } else if (req.body.isinhouse == undefined) {
            throw new AppError(NOT_FOUND, 'Is in house or not?', 404);
        } else {
            properties.parse(queryPath[6].WR_WORKCENTRE, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertData.replace(/\n/g, ' ');
                query = query.replace(/{workCentre}/g, req.body.workcentre_code);
                query = query.replace(/{shiftPatternId}/g, req.body.shiftpattern_id);
                query = query.replace(/{companyId}/g, req.body.company_id);
                query = query.replace(/{companyCode}/g, req.body.company_code);
                query = query.replace(/{defaultmin}/g, req.body.defaultmin);
                query = query.replace(/{isinhouse}/g, req.body.isinhouse);
                console.log(query);
                insertQuery(query.isinHouseWorkcentres, resp);
            });
        }
    }
}));

workcentreRouter.get('/cp_workcentre', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {

        const data = await wc.getWorkcentreList();
        if (data != null) {
            resp.send({ "status": 200, "message": "Success", "data": data });
        }
        else {
            resp.send({ "status": 500, "message": "Fail", "data": [] });
        }
    } else {
        throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
    }
}));

workcentreRouter.get('/deleted-false-wc', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {

        properties.parse(queryPath[6].WR_WORKCENTRE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.deletedFalseWc, resp);
        });
    }
}));

const defaultworkcentreRouter = [
    varifyToken, tryCatch, errorHandler, AppError
];

defaultworkcentreRouter.forEach((router) => {

    workcentreRouter.use(router);
});

module.exports = {
    workcentreRouter
}