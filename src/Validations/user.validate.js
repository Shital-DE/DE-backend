// Author : Shital Gayakwad
// Created Date : 15 Feb 2023
// Description : ERPX_PPC -> User Validation

const Joi = require('joi');

const userLogin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const userModulesValidation = Joi.object({
    oxusers_name: Joi.string().required()
});

module.exports = {
    userLogin,
    userModulesValidation
}