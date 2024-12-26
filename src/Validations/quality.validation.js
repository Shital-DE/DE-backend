// Author : Shital Gayakwad
// Created Date : 19 March 2022
// Description : ERPX_PPC -> Quality validation
//Modified Date : 

const Joi = require('joi');

const startInspectionValidation = Joi.object({
    product_id: Joi.string().required(),
    rms_issue_id: Joi.string().required(),
    workcentre_id: Joi.string().required(),
    workstation_id: Joi.string().required(),
    employee_id: Joi.string().required(),
});

const endInspectionValidation = Joi.object({
    inspection_id: Joi.string().required(),
    ok_quantity: Joi.string().required(),
    short_quantity: Joi.string().required(),
    rework_quantity: Joi.string().required(),
    workcentre_id: Joi.string().required(),
    rejected_quantity: Joi.string().required(),
    rejected_reasons: Joi.string().required()
});

const shortQuantityValidation = Joi.object({
    product_id: Joi.string().required(),
    rms_issuse_id: Joi.string().required(),
    issue_quantity: Joi.string().required(),
    ok_quantity: Joi.string().required(),
    rework_quantity: Joi.string().required(),
    rejected_quantity: Joi.string().required(),
    short_quantity: Joi.string().required(),
    employee_id: Joi.string().required()
});

const finalendInspectionValidation = Joi.object({
    product_id: Joi.string().required(),
    rms_issue_id: Joi.string().required(),
    workcentre_id: Joi.string().required()
});

const changeendInspectionFlagValidation = Joi.object({
    product_id: Joi.string().required(),
    rms_issue_id: Joi.string().required(),
    workcentre_id: Joi.string().required()
});

const inspectionstatusValidation = Joi.object({
    product_id: Joi.string().required(),
    rms_issue_id: Joi.string().required(),
});

module.exports = {
    startInspectionValidation,
    endInspectionValidation,
    shortQuantityValidation,
    finalendInspectionValidation,
    changeendInspectionFlagValidation,
    inspectionstatusValidation
}