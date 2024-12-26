// Author : Shital Gayakwad
// Created Date : 16 Feb 2023
// Description : ERPX_PPC -> Error Handling

const express = require('express');
const AppError = require("../Utils/ErrorHandling/appErrors");

const errorHandlerRouter = express.Router();

errorHandlerRouter.use(AppError);

const errorHandler = (error, req, res, next) => {
    if (error.name === "ValidationError") {
        return res.status(400).send({
            type: "ValidationError",
            message: error.message
        });
    }

    if (error.name === "ReferenceError") {
        return res.status(404).send({
            type: "ReferenceError",
            message: error.message
        });
    }

    if (error.name === "Error") {
        return res.status(404).send({
            type: "Error",
            message: error.message
        });
    }

    if (error.name === "AppError") {
        return res.status(404).send({
            type: "AppError",
            message: error.message
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).send({
            errorMessage: error.message,
            errorCode: error.errorCode
        });
    }

    return res.status(500).send('Something went wrong');
}

module.exports = { errorHandler };