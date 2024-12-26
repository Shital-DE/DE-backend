
const Joi = require('joi');

//Android id
const androidIdValidation = Joi.object({
    androidId: Joi.string().required(),
});

// Automatic or not
const isMachineAutoValidation = Joi.object({
    workcentre_id: Joi.string().required(),
    workstation_id: Joi.string().required(),
});

// Workstation by wc id
const workstationBywcIdValidate = Joi.object({
    workcentre_id: Joi.string().required(),
});

//Tablet is assigned or not
const tabletIsAssignedOrNotValidation = Joi.object({
    workstation_id: Joi.string().required(),
});

//Workcentre registration
const registerWcValidation = Joi.object({
    workcentre_code: Joi.string().required(),
    shiftpattern_id: Joi.string().required(),
    company_id: Joi.string().required(),
    company_code: Joi.string().required(),
    defaultmin: Joi.number().required(),
    isinhouse: Joi.string().required(),
});

//Workstation registration
const registerWsValidation = Joi.object({
    createdby: Joi.string().required(),
    wr_workcentre_id: Joi.string().required(),
    shiftpattern_id: Joi.string().required(),
    code: Joi.string().required(),
    workstationgroup_code: Joi.string().required(),
    isinhouse: Joi.string().required()
});

//Machine Status Validation
const workcentreStatusValidation = Joi.object({
    workcentre_id: Joi.string().required()
});


module.exports = {
    androidIdValidation,
    isMachineAutoValidation,
    workstationBywcIdValidate,
    tabletIsAssignedOrNotValidation,
    registerWcValidation,
    registerWsValidation,
    workcentreStatusValidation
}