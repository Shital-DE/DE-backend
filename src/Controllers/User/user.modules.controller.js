// Author : Shital Gayakwad
// Created Date : 14 Feb 2023
// Description : ERPX_PPC -> User Modules

const express = require('express');
const { errorHandler } = require('../../Middlewares/error_handler');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const modulesrouter = express.Router();
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { userModulesValidation } = require('../../Validations/user.validate');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery } = require('../../Utils/file_read');
const properties = require('properties');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');

// Get user modules after user login
modulesrouter.post('/folders', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token)
    const { error, value } = userModulesValidation.validate({});
    if (userdata) {
        if (req.body.username == undefined) {
            throw new AppError(NOT_FOUND, "Username not found", 404);
        } else if (req.body.password == undefined) {
            throw new AppError(NOT_FOUND, "Password not found", 404);
        } else {
            properties.parse(queryPath[15].ACL_USER_PROGRAM, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.allFolderNames.replace(/\n/g, ' ');
                query = query.replace(/{username}/gim, req.body.username);
                query = query.replace(/{password}/gim, req.body.password);
                selectQuery(query, resp);
            });
        }
    }
}));

modulesrouter.post('/programs', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token)
    const { error, value } = userModulesValidation.validate({});
    if (userdata) {
        if (req.body.folder_id == undefined) {
            throw new AppError(NOT_FOUND, "Folder id not found", 404);
        } else {
            var query = '';
            properties.parse(queryPath[15].ACL_USER_PROGRAM, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                if (req.body.folder_id == 'All') {
                    query = data.selectRoleProgramsMobile.replace(/\n/g, ' ');
                } else {
                    query = data.selectRolePrograms.replace(/\n/g, ' ');
                    query = query.replace(/{folder_id}/gim, req.body.folder_id);
                }
                query = query.replace(/{username}/gim, req.body.username.trim());
                query = query.replace(/{password}/gim, req.body.password);
                selectQuery(query, resp);
            });
        }
    }
}));

const defaultmodulesRouter = [
    tryCatch, errorHandler, AppError
]

defaultmodulesRouter.forEach((router) => {
    modulesrouter.use(router);
})

module.exports = { modulesrouter };