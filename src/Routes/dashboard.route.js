


const express = require('express');
const { admindashboardcontrollerrouter } = require('../Controllers/Dashboard/dashboard.controller');
const admindashboard = express.Router();

const defaultRoutes = [
    {
        path: '/admin-dashboard',
        route: admindashboardcontrollerrouter
    } 
   
]
defaultRoutes.forEach((route) => {
admindashboard.use(route.path, route.route);
});

module.exports = {
    admindashboard
}