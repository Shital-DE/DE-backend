/*
 * Author: Swaroopa T
 * Date: 18th May, 2023
 * Purpose: Product TDS Config Api Call
 *
 */
const express = require("express");
const {
  productTDSConfigRouter,
} = require("../Controllers/Config/ProductTDSConfig");
const {
  accountForeignconfigRouter,
} = require("../Controllers/Config/AccountForeignconfig");
const configRouter = express.Router();

const defaultconfigRoute = [
  {
    path: "/product-tds", //http://localhost:8082/config/tdsproduct/product-data?productCode=2005826252
    route: productTDSConfigRouter,
  },
  {
    path: "/accountforeign", //http://localhost:8082/config/accountforeign/account-data?accountName=COSMOS ABRASIVES
    route: accountForeignconfigRouter,
  },
];

defaultconfigRoute.forEach((route) => {
  configRouter.use(route.path, route.route);
});

module.exports = {
  configRouter,
};
