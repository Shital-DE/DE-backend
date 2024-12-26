// Author : Shital Gayakwad
// Created Date : 3 March 2023
// Description : ERPX_PPC -> Operator route

const express = require('express');
const { cuttingRouter } = require('../Controllers/Operator/cutting_controller');
const { operatorcontrollerrouter } = require('../Controllers/Operator/operator_controller');
const operatorRouter = express.Router();

const defaultOperatorRouter = [
    {
        path: '/cutting',
        route: cuttingRouter
    },
    {
        path: '/operator-screen',
        route: operatorcontrollerrouter
    },
];

defaultOperatorRouter.forEach((router) => {
    operatorRouter.use(router.path, router.route);
});

module.exports = {
    operatorRouter
}