// Author : Shital Gayakwad
// Created Date : 4 March 2022
// Description : ERPX_PPC ->  Documents(Employee Profile)

const express = require('express');
const empDocsRouter = express.Router();
const { getMongoConnection, closeMongoConnection } = require('../../Config/Database/mongodb_config');
const { errorHandler } = require('../../Middlewares/error_handler');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { empProfileValidation } = require('../../Validations/documents.validation');
const ObjectId = require('mongodb').ObjectId;

// View profile
empDocsRouter.post('/profile', varifyToken, tryCatch(async (req, resp) => {
    const id = req.body.id;

    const { error, value } = empProfileValidation.validate({});
    if (id == undefined) {
        throw new AppError(NOT_FOUND, "Document id not found");
    }
    const db = await getMongoConnection();

    const employeeProfileCollection = db.collection('EmployeeProfile');
    const searchCriteria = { _id: new ObjectId(id) };
    const profileData = await employeeProfileCollection.findOne(searchCriteria);
    resp.send(profileData['data']);
    await closeMongoConnection();
}));

//Pancard photo upload
empDocsRouter.post('/register-pan', varifyToken, tryCatch(async (req, resp) => {
    const db = await getMongoConnection();
    const panCardCollection = db.collection('PanCard');
    const result = await panCardCollection.insertOne(req.body);
    if (result.acknowledged == true) {
        const insertedId = result.insertedId.toString();
        resp.send({
            'message': 'Record inserted successfully.',
            'id': insertedId
        });
    } else {
        resp.send({
            'message': 'Record not inserted.',
            'id': ''
        });
    }
}));

//Aadharcard photo upload
empDocsRouter.post('/register-aadhar', varifyToken, tryCatch(async (req, resp) => {
    const db = await getMongoConnection();
    const aadharcardCollection = db.collection('AadharCard');
    const result = await aadharcardCollection.insertOne(req.body);
    if (result.acknowledged == true) {
        const insertedId = result.insertedId.toString();
        resp.send({
            'message': 'Record inserted successfully.',
            'id': insertedId
        });
    } else {
        resp.send({
            'message': 'Record not inserted.',
            'id': ''
        });
    }
}));

//Employee photo upload
empDocsRouter.post('/register-employee-profile', varifyToken, tryCatch(async (req, resp) => {
    const db = await getMongoConnection();
    const employeeProfileCollection = db.collection('EmployeeProfile');
    const result = await employeeProfileCollection.insertOne(req.body);
    if (result.acknowledged == true) {
        const insertedId = result.insertedId.toString();
        resp.send({
            'message': 'Record inserted successfully.',
            'id': insertedId
        });
    } else {
        resp.send({
            'message': 'Record not inserted.',
            'id': ''
        });
    }
}));

// Update employee profile
empDocsRouter.post('/update-employee-profile', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        const db = await getMongoConnection();
        const employeeProfileCollection = db.collection('EmployeeProfile');
        const id = req.body.id.trim();
        const searchCriteria = { _id: new ObjectId(id) };
        const result = await employeeProfileCollection.updateOne(
            searchCriteria,
            {
                $set: {
                    data: req.body.data.trim()
                }
            }
        );
        if (result.acknowledged == true) {
            resp.send({
                'message': 'Record updated successfully.',
                'id': req.body.id.trim()
            });
        } else {
            resp.send({
                'message': 'Record not updated.',
                'id': req.body.id.trim()
            });
        }

    }
}));

// View aadhar card
empDocsRouter.post('/aadhar', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        const id = req.body.id;
        if (id == undefined) {
            throw new AppError(NOT_FOUND, "Document id not found");
        }
        const db = await getMongoConnection();
        const aadharCollection = db.collection('AadharCard');
        const searchCriteria = { _id: new ObjectId(id) };
        const aadharData = await aadharCollection.findOne(searchCriteria);
        resp.send(aadharData['data']);
        await closeMongoConnection();
    }
}));

// Update aadhar card
empDocsRouter.post('/update-aadharcard', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        const db = await getMongoConnection();
        const aadharCollection = db.collection('AadharCard');
        const id = req.body.id.trim();
        const searchCriteria = { _id: new ObjectId(id) };
        const result = await aadharCollection.updateOne(
            searchCriteria,
            {
                $set: {
                    data: req.body.data.trim()
                }
            }
        );
        if (result.acknowledged == true) {
            resp.send({
                'message': 'Record updated successfully.',
                'id': req.body.id.trim()
            });
        } else {
            resp.send({
                'message': 'Record not updated.',
                'id': req.body.id.trim()
            });
        }

    }
}));

// View pan card
empDocsRouter.post('/pan', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        const id = req.body.id;
        if (id == undefined) {
            throw new AppError(NOT_FOUND, "Document id not found");
        }
        const db = await getMongoConnection();
        const panCollection = db.collection('PanCard');
        const searchCriteria = { _id: new ObjectId(id) };
        const panData = await panCollection.findOne(searchCriteria);
        resp.send(panData['data']);
        await closeMongoConnection();
    }
}));

// Update pan card
empDocsRouter.post('/update-pancard', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        const db = await getMongoConnection();
        const panCollection = db.collection('PanCard');
        const id = req.body.id.trim();
        const searchCriteria = { _id: new ObjectId(id) };
        const result = await panCollection.updateOne(
            searchCriteria,
            {
                $set: {
                    data: req.body.data.trim()
                }
            }
        );
        if (result.acknowledged == true) {
            resp.send({
                'message': 'Record updated successfully.',
                'id': req.body.id.trim()
            });
        } else {
            resp.send({
                'message': 'Record not updated.',
                'id': req.body.id.trim()
            });
        }

    }
}));


const defaultEmpProfileRouter = [tryCatch, authorizeToken, AppError, errorHandler];

defaultEmpProfileRouter.map((router) => {
    empDocsRouter.use(router);
});


module.exports = {
    empDocsRouter
}