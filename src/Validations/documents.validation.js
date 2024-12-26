// Author : Shital Gayakwad
// Created Date : 18 Feb 2023
// Description : ERPX_PPC -> Document Validation

const Joi = require('joi');

const pdfValidation = Joi.object({
    id: Joi.string().required(),
});

const modelValidation = Joi.object({
    id: Joi.string().required(),
});

const docValidation = Joi.object({
    id: Joi.string().required()
});

const empProfileValidation = Joi.object({
    id: Joi.string().required(),
});
module.exports = {
    pdfValidation,
    modelValidation,
    docValidation,
    empProfileValidation
}