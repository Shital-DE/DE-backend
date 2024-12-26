const express = require('express');
const properties = require('properties');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { executeSelectQuery } = require('../../Utils/file_read');
const { queryPath } = require('../../Utils/Constants/query.path');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const updateUserDetailsController = express.Router();

// All employee data
updateUserDetailsController.get('/employee-list', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            executeSelectQuery(data.allEmployeeDetails).then((result) => {
                var newData = result;
                const endIndex = req.query.index + 50 > newData.length ? newData.length : req.query.index + 50;
                const employeeDetails = newData.slice(req.query.index, endIndex);
                resp.send(employeeDetails);
            }).catch((e) => {
                resp.send({ 'Error': e });
            });
        });
    }
}));

// Update employee
updateUserDetailsController.post('/update-employee-details', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.updateEmployee.replace(/\n/g, ' ');
            query = query.replace(/{createdby}/gim, req.body.createdby);
            query = query.replace(/{birthdate}/gim, req.body.birthdate);
            query = query.replace(/{honorific}/gim, req.body.honorific);
            query = query.replace(/{lastname}/gim, req.body.lastname.toUpperCase());
            query = query.replace(/{firstname}/gim, req.body.firstname.toUpperCase());
            query = query.replace(/{middlename}/gim, req.body.middlename.toUpperCase());
            query = query.replace(/{currentaddress1}/gim, req.body.currentaddress1);
            query = query.replace(/{currentaddress2}/gim, req.body.currentaddress2);
            query = query.replace(/{currentcity_id}/gim, req.body.currentcity_id);
            query = query.replace(/{currentpin}/gim, req.body.currentpin);
            query = query.replace(/{currentstate}/gim, req.body.currentstate);
            query = query.replace(/{permanentaddress1}/gim, req.body.permanentaddress1);
            query = query.replace(/{permanentaddress2}/gim, req.body.permanentaddress2);
            query = query.replace(/{permanentcity_id}/gim, req.body.permanentcity_id);
            query = query.replace(/{permanentpin}/gim, req.body.permanentpin);
            query = query.replace(/{permanentstate}/gim, req.body.permanentstate);
            query = query.replace(/{qualification}/gim, req.body.qualification.toUpperCase());
            query = query.replace(/{dateofjoining}/gim, req.body.dateofjoining);
            query = query.replace(/{dateofleaving}/gim, req.body.dateofleaving);
            query = query.replace(/{epfnumber}/gim, req.body.epfnumber);
            query = query.replace(/{fpfnumber}/gim, req.body.fpfnumber);
            query = query.replace(/{pannumber}/gim, req.body.pannumber.toUpperCase());
            query = query.replace(/{aadharnumber}/gim, req.body.aadharnumber);
            query = query.replace(/{bankaccountnumber}/gim, req.body.bankaccountnumber);
            query = query.replace(/{bankname}/gim, req.body.bankname);
            query = query.replace(/{email}/gim, req.body.email);
            query = query.replace(/{mobile}/gim, req.body.mobile);
            query = query.replace(/{nextofkinname}/gim, req.body.nextofkinname);
            query = query.replace(/{bankifsccode}/gim, req.body.bankifsccode);
            query = query.replace(/{nextofkinphone}/gim, req.body.nextofkinphone);
            query = query.replace(/{nextofkinrelationwithemployee}/gim, req.body.nextofkinrelationwithemployee);
            query = query.replace(/{id}/gim, req.body.id);
            executeSelectQuery(query).then((result) => {
                if (result != null) {
                    resp.send({ "Message": "Success" });
                }
            }).catch((e) => {
                resp.send({ 'Error': e });
            });
        });
    }
}));

module.exports = {
    updateUserDetailsController
};