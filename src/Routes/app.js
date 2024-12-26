// Author : Shital Gayakwad
// Created Date : 3 March 2023
// Description : ERPX_PPC -> Router

const express = require("express");
const { commonRouter } = require("./common.route");
const { documentsRouter } = require("./documents.route");
const { wcwsRouter } = require("./machine_route");
const { productRouter } = require("./products_route");
const { qualityRouter } = require("./quality.router");
const { user } = require("./user.route");

const { operatorRouter } = require("./operator.route");
const { supervisorRouter } = require("./supervisor.route");
const { capacityPlanRouter } = require("./capacity_plan.route");
const { attenRouter } = require("./attendance.route");
const { auditRouter } = require("./audit.route");
const { configRouter } = require("./config.route");
const { messageRouter } = require("./message.route");
const { accountRouter } = require("./account.route");
const { admindashboard } = require("./dashboard.route");

const { errorHandler } = require("../Middlewares/error_handler");
const {
  assemblyShopRouter,
} = require("./AssemblyShopRoute/assembly.shop.route");
const { SORouter } = require("./orders.route");

const router = express.Router();
const defaultAppRoutes = [
  {
    path: "/user",
    route: user,
  },
  {
    path: "/product",
    route: productRouter,
  },
  {
    path: "/documents",
    route: documentsRouter,
  },
  {
    path: "/workcentre",
    route: wcwsRouter,
  },
  {
    path: "/common",
    route: commonRouter,
  },
  {
    path: "/quality",
    route: qualityRouter,
  },
  {
    path: "/operator",
    route: operatorRouter,
  },
  {
    path: "/supervisor",
    route: supervisorRouter,
  },
  {
    path: "/ppc",
    route: capacityPlanRouter,
  },
  {
    path: "/assembly-shop",
    route: assemblyShopRouter,
  },
  {
    path: "/employee",
    route: attenRouter,
  },
  {
    path: "/audit",
    route: auditRouter,
  },
  {
    path: "/config",
    route: configRouter,
  },
  {
    path: "/message",
    route: messageRouter,
  },
  {
    path: "/account",
    route: accountRouter,
  },
  ,
  {
    path: "/dashboard",
    route: admindashboard,
  },
  {
    path: "/orders",
    route: SORouter
  }
];

defaultAppRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.use(errorHandler);

module.exports = {
  router,
};
