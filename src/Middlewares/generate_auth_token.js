// Author : Shital Gayakwad
// Created Date : 16 Feb 2023
// Description : ERPX_PPC -> Generate user authentication token

const express = require("express");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/ErrorHandling/appErrors");
const { errorHandler } = require("./error_handler");
const { CONFLICT, UNAUTHORIZED } = require("../Utils/Constants/errorCodes.js");
const userTokenGenerateRouter = express.Router();
const secretKey = process.env.AUTH_KEY;

const getToken = ({ payload }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, (error, token) => {
      if (!error) {
        resolve(token);
      } else {
        reject(error);
      }
    });
  });
};

function authorizeToken(token) {
  let userdata;
  jwt.verify(token, secretKey, (error, authData) => {
    if (error) {
      throw new AppError(UNAUTHORIZED, "User is unauthorized", 401);
    } else {
      userdata = authData;
    }
  });
  return userdata;
}

userTokenGenerateRouter.use(AppError);
userTokenGenerateRouter.use(errorHandler);

module.exports = {
  getToken,
  authorizeToken,
};
