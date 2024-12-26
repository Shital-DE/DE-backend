// Author : Shital Gayakwad
// Created Date : 30 April 2023
// Description : ERPX_PPC -> Supervisor route

const express = require("express");
const {
  subcontractorRouter,
} = require("../Controllers/Supervisor/subcontractor_controller");
const {
  outsourceRouter,
} = require("../Controllers/Supervisor/outsource_controller");
const { emailRouter } = require("../Controllers/Supervisor/email_controller");
const { stockRouter } = require("../Controllers/Stock/stock.controller");
const { empRouter } = require("../Controllers/Supervisor/employee_controller");
const supervisorRouter = express.Router();

const defaultSupervisorRouter = [
  {
    path: "/subcontractor",
    route: subcontractorRouter,
  },
  {
    path: "/outsource",
    route: outsourceRouter,
  },
  {
    path: "/mail",
    route: emailRouter,
  },
  {
    path: "/stock",
    route: stockRouter,
  },
  {
    path: "/emp",
    route: empRouter,
  },
];

defaultSupervisorRouter.forEach((router) => {
  supervisorRouter.use(router.path, router.route);
});

module.exports = {
  supervisorRouter,
};
