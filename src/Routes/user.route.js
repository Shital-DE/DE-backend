// Author : Shital Gayakwad
// Created Date : 16 Feb 2023
// Description : ERPX_PPC -> User Route

const express = require("express");
const { userlogin } = require("../Controllers/User/user.login.controller");
const {
  modulesrouter,
} = require("../Controllers/User/user.modules.controller");
const { errorHandler } = require("../Middlewares/error_handler");
const {
  userRegistrationRouter,
} = require("../Controllers/User/user.registration.controller");
const { userRouter } = require("../Controllers/User/user.controller");
const { updateUserDetailsController } = require("../Controllers/User/update.userdetails");
const user = express.Router();

const defaultuserRouter = [
  {
    path: "/login",
    route: userlogin,
  },
  {
    path: "/authorization",
    route: modulesrouter,
  },
  {
    path: "/employee_registration",
    route: userRegistrationRouter,
  },
  {
    path: "/user-pgm-assign",
    route: userRouter,
  },
  {
    path: "/update-employee-details",
    route: updateUserDetailsController
  }
];

defaultuserRouter.forEach((router) => {
  user.use(router.path, router.route);
});

user.use(errorHandler);

module.exports = {
  user,
};
