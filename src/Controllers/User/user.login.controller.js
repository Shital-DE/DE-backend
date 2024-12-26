// Author : Shital Gayakwad
// Created Date : 31 Dec 2022
// Description : ERPX_PPC -> User Login
//Modified Date : 21 Feb 2023

const express = require("express");
const userlogin = express.Router();
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { errorHandler } = require("../../Middlewares/error_handler");
const properties = require("properties");
const { queryPath } = require("../../Utils/Constants/query.path");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { getToken, authorizeToken } = require("../../Middlewares/generate_auth_token");
const { executeSelectQuery, insertQuery, updateQuery } = require("../../Utils/file_read");
const { varifyToken } = require("../../Middlewares/varify_auth_token");

//Logged in user and get Users data
userlogin.post(
  "/userdata",
  tryCatch(async (req, resp) => {
    // console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    if (username == undefined && password == undefined) {
      resp.send({
        'status code': 404,
        'message': 'User credentials are not found.'
      });
    } else if (username == undefined) {
      resp.send({
        'status code': 404,
        'message': 'Username is not found.'
      });
    } else if (password == undefined) {
      resp.send({
        'status code': 404,
        'message': 'Password is not found.'
      });
    } else {

      properties.parse(
        queryPath[3].HR_EMPLOYEE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.userLogin.replace(/\n/g, " ");
          query = query.replace(/{req.body.username}/g, username);
          query = query.replace(/{req.body.password}/g, password);
          executeSelectQuery(query).then((rows) => {
            getToken({ payload: rows[0].id }).then((token) => {
              resp.send({
                token: token,
                data: rows,
              });
            }).catch((e) => {
              resp.send(e.message);
            });
          }).catch((e) => {
            resp.send(e.message);
          });
        }
      );
    }
  })
);

// Log in history
userlogin.post('/user-log-registration', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    if (req.body.employee_id == undefined) {
      resp.send({
        'status code': 404,
        'message': 'Employee id not found.'
      });
    } else if (req.body.androidid == undefined) {
      resp.send({
        'status code': 404,
        'message': 'Android id not found'
      });
    } else {
      properties.parse(
        queryPath[53].TABLET_LOGIN_LOGS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.insertQuery.replace(/\n/g, " ");
          query = query.replace(/{employee_id}/g, req.body.employee_id);
          query = query.replace(/{androidid}/g, req.body.androidid);
          query = query.replace(/{workcentre_id}/g, req.body.workcentre_id);
          query = query.replace(/{workstation_id}/g, req.body.workstation_id);
          insertQuery(query, resp);
        });
    }
  }
}));

userlogin.put('/log-out', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    if (req.body.id == undefined) {
      resp.send({
        'status code': 404,
        'message': 'Id not found'
      });
    } else {
      properties.parse(
        queryPath[53].TABLET_LOGIN_LOGS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.logOut.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.id);
          updateQuery(query, resp);
        });
    }
  }
}));

userlogin.get(
  "/notification-user-list",
  tryCatch(async (req, resp) => {

    properties.parse(
      queryPath[3].HR_EMPLOYEE,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        var query = data.notification_user_check;
        query = query.replace(/{employee_id}/g, req.query.employee_id);

        executeSelectQuery(query).then((rows) => {
          getToken({ payload: rows[0] }).then((token) => {
            resp.send({
              count: rows[0].count
            });
          }).catch((e) => {
            resp.send(e.message);
          });
        }).catch((e) => {
          resp.send(e.message);
        });

      }
    );

  })
);

const defaultuserLogin = [errorHandler, tryCatch, AppError];
defaultuserLogin.forEach((router) => {
  userlogin.use(router);
});

module.exports = {
  userlogin,
};
