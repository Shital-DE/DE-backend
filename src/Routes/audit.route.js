// Author : Swarupa T
// Created Date :
// Description : ERPX_Audit ->  Audit General Ledger And Audit Outward Supply Detail

const express = require("express");
const {
  auditGeneralLedgerRouter,
} = require("../Controllers/Audit/AuditGeneralLedgerController");
const {
  auditOutwardSupplyRouter,
} = require("../Controllers/Audit/AuditOutwardSupplyController");
const auditRouter = express.Router();

const defaultauditRoute = [
  {
    path: "/generalledger", //http://localhost:8082/audit/generalledger/auditgeneralledger?fromDate=04/01/2022&toDate=03/31/2023&transType=S03
    route: auditGeneralLedgerRouter,
  },
  {
    path: "/outwardsupply", //http://localhost:8082/audit/outwardsupply/osmaster?fromDate=04/01/2022&toDate=03/31/2023&transType=S03
    route: auditOutwardSupplyRouter,
  },
];

defaultauditRoute.forEach((route) => {
  auditRouter.use(route.path, route.route);
});

module.exports = {
  auditRouter,
};
