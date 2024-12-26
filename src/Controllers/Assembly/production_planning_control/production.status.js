// Author : Shital Gayakwad
// Created Date : 5 October 2024
// Description : Production status


const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { selectQuery } = require("../../../Utils/file_read");
const { queryPath } = require("../../../Utils/Constants/query.path");
const productionStatusRouter = express.Router();

// Recent 100 records
productionStatusRouter.get('/recent-100-records', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[63].AS_PRODUCTION_STATUS,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        'error': error,
                    });
                }
                selectQuery(data.productionRecent100Entries, resp);
            }
        );
    }
}));

// Workstation status
productionStatusRouter.get('/workstation-status', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[63].AS_PRODUCTION_STATUS,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        'error': error,
                    });
                }
                var query = data.workstationStatus.replace(/\n/g, " ");
                query = query.replace(/{workstation_id}/g, req.query.workstation_id);
                selectQuery(query, resp);
            }
        );
    }
}));



module.exports = {
    productionStatusRouter
}