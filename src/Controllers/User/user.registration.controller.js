// Author : Shital Gayakwad
// Created Date :4 May 2023
// Description : ERPX_PPC -> Employee registration controller 

const express = require('express');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { errorHandler } = require('../../Middlewares/error_handler');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const userRegistrationRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery, insertQuery, updateQuery } = require('../../Utils/file_read');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');

// State
userRegistrationRouter.get('/state', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[13].CM_STATE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.state, resp);
        });
    }
}));

userRegistrationRouter.get('/employee-type', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[14].COMMON, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.employeeType, resp);
        });
    }
}));

userRegistrationRouter.get('/employee-department', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[14].COMMON, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.department, resp);
        });
    }
}));

userRegistrationRouter.get('/employee-designation', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[14].COMMON, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.designation, resp);
        });
    }
}));

userRegistrationRouter.post('/employee-id', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.employeeId.replace(/\n/g, ' ');
            query = query.replace(/{empDeptCode}/gim, req.body.empDepartment);
            query = query.replace(/{empTypeCode}/gim, req.body.empType);
            selectQuery(query, resp);
        });
    }
}));

userRegistrationRouter.post('/register-employee', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Logged in user id not found', 404);
        } else if (req.body.empPersonalInfo.selectedHonorific == undefined) {
            throw new AppError(NOT_FOUND, 'Honorific not found', 404);
        } else if (req.body.empPersonalInfo.firstName == undefined) {
            throw new AppError(NOT_FOUND, 'First name not found', 404);
        } else if (req.body.empPersonalInfo.middleName == undefined) {
            throw new AppError(NOT_FOUND, 'Middle name not found', 404);
        } else if (req.body.empPersonalInfo.lastName == undefined) {
            throw new AppError(NOT_FOUND, 'Last name not found', 404);
        } else if (req.body.empPersonalInfo.dateOfBirth == undefined) {
            throw new AppError(NOT_FOUND, 'Date of birth not found', 404);
        } else if (req.body.empPersonalInfo.qualification == undefined) {
            throw new AppError(NOT_FOUND, 'Qualification not found', 404);
        } else if (req.body.empPersonalInfo.mobileNumber == undefined) {
            throw new AppError(NOT_FOUND, 'Mobile number not found', 404);
        } else if (req.body.empPersonalInfo.relativeName == undefined) {
            throw new AppError(NOT_FOUND, 'Relative name not found', 404);
        } else if (req.body.empPersonalInfo.relationWith == undefined) {
            throw new AppError(NOT_FOUND, 'Relation with relative not found', 404);
        } else if (req.body.empPersonalInfo.relativeMobileNumber == undefined) {
            throw new AppError(NOT_FOUND, 'Relative mobile number not found', 404);
        } else if (req.body.empAddress.current_add1 == undefined) {
            throw new AppError(NOT_FOUND, 'Current address line 1 not found', 404);
        } else if (req.body.empAddress.current_city_id == undefined) {
            throw new AppError(NOT_FOUND, 'Current city id not found', 404);
        } else if (req.body.empAddress.current_pin_code == undefined) {
            throw new AppError(NOT_FOUND, 'Current pin code not found', 404);
        } else if (req.body.empAddress.current_state_id == undefined) {
            throw new AppError(NOT_FOUND, 'Current state id not found', 404);
        } else if (req.body.empAddress.per_add1 == undefined) {
            throw new AppError(NOT_FOUND, 'Permanent address line 1 not found', 404);
        } else if (req.body.empAddress.per_city_id == undefined) {
            throw new AppError(NOT_FOUND, 'Permanent city id not found', 404);
        } else if (req.body.empAddress.per_pin_code == undefined) {
            throw new AppError(NOT_FOUND, 'Permanent pin code not found', 404);
        } else if (req.body.empAddress.per_state_id == undefined) {
            throw new AppError(NOT_FOUND, 'Permanent state id not found', 404);
        } else if (req.body.empDocuments.bank_ac_number == undefined) {
            throw new AppError(NOT_FOUND, 'Bank account number not found', 404);
        } else if (req.body.empDocuments.bank_name == undefined) {
            throw new AppError(NOT_FOUND, 'Bank name not found', 404);
        } else if (req.body.empDocuments.pancard_number == undefined) {
            throw new AppError(NOT_FOUND, 'Pan card number not found', 404);
        } else if (req.body.empDocuments.aadharcard_number == undefined) {
            throw new AppError(NOT_FOUND, 'Aadhar card number not found', 404);
        } else if (req.body.empDocuments.email_id == undefined) {
            throw new AppError(NOT_FOUND, 'Email id not found', 404);
        } else if (req.body.empDocuments.date_of_joining == undefined) {
            throw new AppError(NOT_FOUND, 'Date of joining not found', 404);
        } else if (req.body.empEmployment.employee_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee id not found', 404);
        } else if (req.body.empEmployment.type_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee type id not found', 404);
        } else if (req.body.empEmployment.dept_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee department id not found', 404);
        } else if (req.body.empEmployment.desig_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee designation id not found', 404);
        } else if (req.body.empEmployment.cmpny_id == undefined) {
            throw new AppError(NOT_FOUND, 'Employee company id not found', 404);
        } else {
            properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.userRegister.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                query = query.replace(/{code}/gim, req.body.empEmployment.employee_id.trim());
                query = query.replace(/{employeetype_id}/gim, req.body.empEmployment.type_id.trim());
                query = query.replace(/{employeedepartment_id}/gim, req.body.empEmployment.dept_id.trim());
                query = query.replace(/{employeedesignation_id}/gim, req.body.empEmployment.desig_id.trim());
                query = query.replace(/{birthdate}/gim, req.body.empPersonalInfo.dateOfBirth.trim());
                query = query.replace(/{honorific}/gim, req.body.empPersonalInfo.selectedHonorific.trim());
                query = query.replace(/{lastName}/gim, req.body.empPersonalInfo.lastName.trim().toUpperCase());
                query = query.replace(/{firstname}/gim, req.body.empPersonalInfo.firstName.trim().toUpperCase());
                query = query.replace(/{middleName}/gim, req.body.empPersonalInfo.middleName.trim().toUpperCase());
                query = query.replace(/{currentAddressLine1}/gim, req.body.empAddress.current_add1.trim());
                query = query.replace(/{currentAddressLine2}/gim, req.body.empAddress.current_add2.trim());
                query = query.replace(/{currentCity}/gim, req.body.empAddress.current_city_id.trim());
                query = query.replace(/{currentPinCode}/gim, req.body.empAddress.current_pin_code.trim());
                query = query.replace(/{currentState}/gim, req.body.empAddress.per_state_id.trim());
                query = query.replace(/{permanentAddressLine1}/gim, req.body.empAddress.per_add1.trim());
                query = query.replace(/{permanentAddressLine2}/gim, req.body.empAddress.per_add2.trim());
                query = query.replace(/{permanentCity}/gim, req.body.empAddress.per_city_id.trim());
                query = query.replace(/{permanentPinCode}/gim, req.body.empAddress.per_pin_code.trim());
                query = query.replace(/{permanentState}/gim, req.body.empAddress.per_state_id.trim());
                query = query.replace(/{qualification}/gim, req.body.empPersonalInfo.qualification.trim().toUpperCase());
                query = query.replace(/{joiningDate}/gim, req.body.empDocuments.date_of_joining.trim());
                query = query.replace(/{employeePfNumber}/gim, req.body.empDocuments.emp_pf_number.trim().toUpperCase());
                query = query.replace(/{familyPfNumber}/gim, req.body.empDocuments.family_pf_number.trim().toUpperCase());
                query = query.replace(/{panCardNumber}/gim, req.body.empDocuments.pancard_number.trim().toUpperCase());
                query = query.replace(/{adharcardNumber}/gim, req.body.empDocuments.aadharcard_number.trim());
                query = query.replace(/{bnkAcNumber}/gim, req.body.empDocuments.bank_ac_number.trim().toUpperCase());
                query = query.replace(/{bankname}/gim, req.body.empDocuments.bank_name.trim().toUpperCase());
                query = query.replace(/{emailAddress}/gim, req.body.empDocuments.email_id.trim());
                query = query.replace(/{mobileNumber}/gim, req.body.empPersonalInfo.mobileNumber.trim());
                query = query.replace(/{company}/gim, req.body.empEmployment.cmpny_id.trim());
                query = query.replace(/{familyMember}/gim, req.body.empPersonalInfo.relativeName.trim());
                query = query.replace(/{bankIFSCCode}/gim, req.body.empDocuments.emp_pf_number.trim().toUpperCase());
                query = query.replace(/{relative_mob_num}/gim, req.body.empPersonalInfo.relativeMobileNumber.trim());
                query = query.replace(/{relationWithFamilyMember}/gim, req.body.empPersonalInfo.relationWith.trim());
                insertQuery(query, resp);
            });
        }

    }
}));

userRegistrationRouter.post('/register-documents-ids', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.insertDocumentsIds.replace(/\n/g, ' ');
            query = query.replace(/{empid}/gim, req.body.id.trim());
            query = query.replace(/{empprofilemdocid}/gim, req.body.profile.trim());
            query = query.replace(/{adharcardmdocid}/gim, req.body.adharcard.trim());
            query = query.replace(/{pancardmdocid}/gim, req.body.pancard.trim());
            updateQuery(query, resp);
        });
    }
}));

// Employee credentials
userRegistrationRouter.post('/create-user-credentials', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.username == undefined) {
            throw new AppError(NOT_FOUND, 'Username not found', 404);
        } else if (req.body.password == undefined) {
            throw new AppError(NOT_FOUND, 'Password not found', 404);
        } else if (req.body.mobileno == undefined) {
            throw new AppError(NOT_FOUND, 'Mobile not found', 404);
        } else {
            properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.createUserCredentials.replace(/\n/g, ' ');
                query = query.replace(/{id}/gim, req.body.empId.trim());
                query = query.replace(/{employeeusername}/gim, req.body.username.trim());
                query = query.replace(/{employeeuserpassword}/gim, req.body.pass.trim());
                updateQuery(query, resp);
            });
        }
    }
}));

const defaultuserRegistrationRouter = [tryCatch, AppError, errorHandler, varifyToken];

defaultuserRegistrationRouter.forEach((router) => {
    userRegistrationRouter.use(router);
});


module.exports = {
    userRegistrationRouter
}