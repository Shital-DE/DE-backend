
// Author : Shital Gayakwad
// Created Date : 2 March 2023
// Description : ERPX_PPC -> Machine Route

const express = require('express');
const { machineNameRouter } = require('../Controllers/Machine/android_id_controller');
const { machineValidationRouter } = require('../Controllers/Machine/is_machine_automatic');
const { workcentreRouter } = require('../Controllers/Machine/workcentre_controller');
const { workstationRouter } = require('../Controllers/Machine/workstation_controller');
const { workcentreStatusRouter } = require('../Controllers/Machine/machin.status.controller');
const wcwsRouter = express.Router();

const defaultwcwsRouter = [
    {
        path: '/workstation',
        route: machineNameRouter
    },
    {
        path: '/machine-auto',
        route: machineValidationRouter
    },
    {
        path: '/wc',
        route: workcentreRouter
    },
    {
        path: '/selected-ws',
        route: workstationRouter
    },
    {
        path: '/machine-status',
        route: workcentreStatusRouter
    }
]

defaultwcwsRouter.forEach((router) => {

    wcwsRouter.use(router.path, router.route);
});

module.exports = {
    wcwsRouter
};