// Author : Shital Gayakwad
// Created Date : 19 March 2022
// Description : ERPX_PPC -> Quality router
//Modified Date :

const express = require('express');
const { qualitycontrollerRouter } = require('../Controllers/Supervisor/quality_controller');
const { instrumentRegistration } = require('../Controllers/QualityCalibration/instruments.registration.controller');
const { instrumentTypeRegistration } = require('../Controllers/QualityCalibration/instrumenttype.controller');
const { calibrationRouter } = require('../Controllers/QualityCalibration/calibration.controller');
const qualityRouter = express.Router();

const defaultQARouter = [
    {
        path: '/inspection',
        route: qualitycontrollerRouter
    },
    {
        path: '/instruments',
        route: instrumentRegistration
    },
    {
        path: '/instrument-type',
        route: instrumentTypeRegistration
    },
    {
        path: '/calibration',
        route: calibrationRouter
    }
];

defaultQARouter.forEach((router) => {
    qualityRouter.use(router.path, router.route);
});

module.exports = {
    qualityRouter
}