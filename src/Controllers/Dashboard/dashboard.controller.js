


const express = require('express');

const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');

const AppError = require('../../Utils/ErrorHandling/appErrors');

const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const properties = require('properties');

const { queryPath } = require('../../Utils/Constants/query.path');

const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { selectQuery } = require('../../Utils/file_read');


const admindashboardcontrollerrouter = express.Router();

admindashboardcontrollerrouter.get('/get-workstation-list', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true },function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.dashboardWorkstationList//.replace(/\n/g, ' ');
            // query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
            // console.log(query);
            // selectQuery(query, resp);
            // console.log(query);
            selectQuery(query, resp);           
        }
      )
    }
}))

admindashboardcontrollerrouter.post('/workstation-TotalCurrent-Tagid', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);   
    if (userdata) {
        properties.parse(queryPath[58].IND4_WORKSTATION_TAGID, { path: true },function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.ind4workstationtagid.replace(/\n/g, ' ');
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            // console.log(query);
            selectQuery(query, resp);
        }
      )
    }
}))

admindashboardcontrollerrouter.post('/industry4-workstation-tags', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);  

    if (userdata) {
        properties.parse(queryPath[58].IND4_WORKSTATION_TAGID, { path: true },function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.allind4WorkstionTagid.replace(/\n/g, ' ');
            // console.log(query);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            // console.log(query);
            selectQuery(query, resp);
        }
      )
    }
}))

admindashboardcontrollerrouter.get('/get-automaticWorkcentreList', varifyToken, tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
        properties.parse(queryPath[5].WR_WORKCENTRE_WORKSTATION, { path: true },function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.automaticWorkcentreList  
            // console.log(query);
            selectQuery(query, resp);           
        }
      )
    }
}))



module.exports = { admindashboardcontrollerrouter }