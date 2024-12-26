
// Author : Shital Gayakwad
// Created Date : 6 July 2023
// Description : Assembly shop router

const express = require('express');
const { workLogEntry } = require('../../AssemblyShop/worklogentry.controller');
const { processRegistrationRouter } = require('../../AssemblyShop/process.registration');
const { stockinward } = require('../../AssemblyShop/stockinward.controller');
const { productRegistration } = require('../../Controllers/Assembly/Product_Resource_Management/product.registration');
const { productStructure } = require('../../Controllers/Assembly/Product_Resource_Management/product.structure');
const { productStock } = require('../../Controllers/Assembly/Product_Resource_Management/product.stock');
const { purchaseOrderRouter } = require('../../Controllers/Assembly/Sales_order/so.controller');
const { assemblyProductRouteRouter } = require('../../Controllers/Assembly/Product_Resource_Management/as.product.route');
const { productionPlanningControlRouter } = require('../../Controllers/Assembly/production_planning_control/production.schedule');
const { productionRouter } = require('../../Controllers/Assembly/Production/production.controller');
const { productionStatusRouter } = require('../../Controllers/Assembly/production_planning_control/production.status');
const assemblyShopRouter = express.Router();

const defaultAssemblyShopRouter = [
    {
        path: '/work-log-entry',
        route: workLogEntry
    },
    {
        path: '/process',
        route: processRegistrationRouter
    },
    {
        path: '/stockinward',
        route: stockinward
    },
    {
        path: '/product-registration',
        route: productRegistration
    },
    {
        path: '/product-structure',
        route: productStructure
    },
    {
        path: '/stock',
        route: productStock
    },
    {
        path: '/sales-order',
        route: purchaseOrderRouter
    },
    {
        path: '/product-route',
        route: assemblyProductRouteRouter
    },
    {
        path: '/production-planning-control',
        route: productionPlanningControlRouter
    },
    {
        path: '/production',
        route: productionRouter
    },
    {
        path: '/production-status',
        route: productionStatusRouter
    }
];

defaultAssemblyShopRouter.forEach((router) => {
    assemblyShopRouter.use(router.path, router.route);
});

module.exports = {
    assemblyShopRouter
}
