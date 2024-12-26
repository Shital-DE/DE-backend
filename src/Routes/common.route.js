// Author : Shital Gayakwad
// Created Date : 14 March 2023
// Description : ERPX_PPC -> Common Route

const express = require('express');
const { eveRouter } = require('../Controllers/common_controller');
const commonRouter = express.Router();

const defaultwcwsRouter = [
    {
        path: '/data',
        route: eveRouter
    }
];

defaultwcwsRouter.forEach((route) => {
    commonRouter.use(route.path, route.route)
});

module.exports = {
    commonRouter
}