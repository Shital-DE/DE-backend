/*
// Rohini Mane
// 24 May 2023
*/

const express = require('express');
const { attendanceRouter } = require('..//Controllers/Supervisor/attendance_controller');
const attenRouter = express.Router();

const defaultRoutes = [
  {
    path: '/daily',
    route: attendanceRouter
  }
]

defaultRoutes.forEach((route) => {
  attenRouter.use(route.path, route.route);
});


module.exports = {
  attenRouter
}