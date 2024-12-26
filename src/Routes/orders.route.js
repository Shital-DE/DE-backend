// Author : Shital Gayakwad
// Created Date : 15 November 2024
// Description : Product structure

const express = require('express');
const { salesOrderRouter } = require('../Controllers/SalesOrder/sales.order');
const SORouter = express.Router();

const defaultSORouter = [
    {
        path: '/sales-orders',
        route: salesOrderRouter
    },
];

defaultSORouter.forEach((router) => {
    SORouter.use(router.path, router.route);
});

module.exports = {
    SORouter
}