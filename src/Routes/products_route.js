// Author : Shital Gayakwad
// Created Date : 17 Feb 2023
// Description : ERPX_PPC -> Product Router

const express = require('express');
const { allProductRouter } = require('../Controllers/Products/pd_product_controller');
const { productRouteRouter } = require('../Controllers/Products/productRoute.controller');
const { productMachineRouteRouter } = require('../Controllers/Products/machine_product_route_controller');
const { productStructureRouter } = require('../Controllers/Products/pd_product_structure_controller');
const { inventoryManagementRouter } = require('../Controllers/Products/manage.inventory.controller');
const productRouter = express.Router();

const defaultRoutes = [
    {
        path: '/all-products',
        route: allProductRouter
    },
    {
        path: '/one-product',
        route: allProductRouter
    },
    {
        path: '/product-route',
        route: productRouteRouter
    },
    {
        path: '/product-route-via-machine',
        route: productMachineRouteRouter
    },
    {
        path: '/product-structure',
        route: productStructureRouter
    },
    {
        path: '/product-inventory-management',
        route: inventoryManagementRouter
    }
]

defaultRoutes.forEach((route) => {
    productRouter.use(route.path, route.route);
});


module.exports = {
    productRouter
}