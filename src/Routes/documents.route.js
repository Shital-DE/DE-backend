// Author : Shital Gayakwad
// Created Date : 17 Feb 2023
// Description : ERPX_PPC -> Documents Router

const express = require('express');
const { docRouter } = require('../Controllers/Documents/documents.controller');
const { empDocsRouter } = require('../Controllers/Documents/empoyee.docs');
const documentsRouter = express.Router();

const defaultDocumentsRoute = [
    {
        path: '/pdf',
        route: docRouter
    },
    {
        path: '/model',
        route: docRouter
    },
    {
        path: '/doc',
        route: docRouter
    }, {
        path: '/emp',
        route: empDocsRouter
    }
];

defaultDocumentsRoute.forEach((route) => {
    documentsRouter.use(route.path, route.route);
});

module.exports = {
    documentsRouter,
}