// Author : Shital Gayakwad
// Created Date : 17 Feb 2023
// Description : ERPX_PPC -> Product Validation

const Joi = require('joi');

const oneProductValidation = Joi.object({
    id: Joi.string().required(),
});

const asproductValidation = Joi.object({
    id: Joi.string().required(),
});




module.exports = {
    oneProductValidation,asproductValidation
}