// Author : Swarupa T
// Created Date :
// Description : ERPX_Audit -> Expence Detail

const express = require("express");
const {
  expenseDetailRouter,
} = require("../Controllers/Account/ExpenseDetailController");

const {
  onlinePaymentStatusQueueRouter,
} = require("../Controllers/Account/OnlinePaymentQueueController");

const {
  viewForARAPPayableRouter,
} = require("../Controllers/Account/ViewForARAPPayableController");

const {
  advanceAccountRouter,
} = require("../Controllers/Account/AdvanceAccountController");

const accountRouter = express.Router();

const defaultAccountRouter = [
  {
    path: "/petty-expense", //http://localhost:8082/account/expenceacc/expencedetail
    route: expenseDetailRouter,
  },
  {
    path: "/onlinePayment", //http://localhost:8082/account/onlinePayment/onlinePaymentQueue?fromDate=2022-11-01&toDate=2022-11-24&onlinepaymentstatus=SUCCESS
    route: onlinePaymentStatusQueueRouter,
  },
  {
    path: "/arapPayable", //http://localhost:8082/account/arapPayable/cheque-payment-against-payable
    route: viewForARAPPayableRouter,
  },
  {
    path: "/advacc", //http://localhost:8082/account/advaccountdata/account-data?accountScheduleId=402881eb553953350155395adf1f0004
    route: advanceAccountRouter,
  },
];

defaultAccountRouter.forEach((route) => {
  accountRouter.use(route.path, route.route);
});

module.exports = {
  accountRouter,
};
