// Author : Shital Gayakwad
// Created Date : 13 September 2024
// Description : Assembly product route


const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { queryPath } = require("../../../Utils/Constants/query.path");
const { selectQuery, insertQuery, updateQuery, deleteQuery } = require("../../../Utils/file_read");
const assemblyProductRouteRouter = express.Router();

// Selected product's route
assemblyProductRouteRouter.get('/selected-product', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[61].AS_PD_PRODUCT_PRODUCTROUTE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        'error': error,
                    });
                }
                var query = data.productRoute.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.query.product_id);
                query = query.replace(/{revisionno}/g, req.query.revision);
                selectQuery(query, resp);
            }
        );
    }
}));

// Register route
assemblyProductRouteRouter.post('/register-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[61].AS_PD_PRODUCT_PRODUCTROUTE, { path: true }, async function (error, data) {
            if (error) {
                resp.send({ 'status code': 404, 'error': error });
            }
            var query = data.insertQuery.replace(/\n/g, " ");
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{created_by}/gim, req.body.created_by);
            query = query.replace(/{productbillofmaterial_id}/gim, req.body.productbillofmaterial_id);
            query = query.replace(/{workstation_id}/gim, req.body.workstation_id);
            query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
            query = query.replace(/{setup_min}/gim, req.body.setup_min);
            query = query.replace(/{runtime_min}/gim, req.body.runtime_min);
            query = query.replace(/{revision_number}/gim, req.body.revision_number);
            query = query.replace(/{sequencenumber}/gim, req.body.sequencenumber);
            const escapedDescription = req.body.description.replace(/'/g, "''");
            query = query.replace(/{description}/gim, escapedDescription);
            query = query.replace(/{top_bottom_data_aaray0}/gim, req.body.top_bottom_data_aaray[0]);
            query = query.replace(/{top_bottom_data_aaray1}/gim, req.body.top_bottom_data_aaray[1]);
            query = query.replace(/{new_process_id}/gim, req.body.new_process_id);
            insertQuery(query, resp);
        })
    }
}));

// Update route
assemblyProductRouteRouter.put('/update-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[61].AS_PD_PRODUCT_PRODUCTROUTE, { path: true }, async function (error, data) {
            if (error) {
                resp.send({ 'status code': 404, 'error': error });
            }
            var query = data.updateQuery.replace(/\n/g, " ");
            query = query.replace(/{product_route_id}/gim, req.body.product_route_id);
            query = query.replace(/{process_route_id}/gim, req.body.process_route_id);
            query = query.replace(/{new_product_id}/gim, req.body.product_id);
            query = query.replace(/{product_revision}/gim, req.body.product_revision);
            query = query.replace(/{new_sequence}/gim, req.body.new_sequence);
            query = query.replace(/{new_workcentre_id}/gim, req.body.new_workcentre_id);
            query = query.replace(/{new_workstation_id}/gim, req.body.new_workstation_id);
            query = query.replace(/{new_createdby}/gim, req.body.new_createdby);
            query = query.replace(/{new_totalsetuptimemins}/gim, req.body.new_totalsetuptimemins);
            query = query.replace(/{new_totalruntimemins}/gim, req.body.new_totalruntimemins);
            query = query.replace(/{existing_totalsetuptimemins}/gim, req.body.existing_totalsetuptimemins);
            query = query.replace(/{existing_totalruntimemins}/gim, req.body.existing_totalruntimemins);
            const escapedDescription = req.body.new_description.replace(/'/g, "''");
            query = query.replace(/{new_description}/gim, escapedDescription);
            query = query.replace(/{new_process_id}/gim, req.body.new_process_id);
            updateQuery(query, resp);
        })
    }
}));

// Delete route
assemblyProductRouteRouter.delete('/delete-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[61].AS_PD_PRODUCT_PRODUCTROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteQuery.replace(/\n/g, ' ');
            query = query.replace(/{product_route_id}/gim, req.body.product_route_id);
            query = query.replace(/{process_route_id}/gim, req.body.process_route_id);
            query = query.replace(/{setupmin}/gim, req.body.setupmin);
            query = query.replace(/{runmin}/gim, req.body.runmin);
            deleteQuery(query, resp);
        });
    }
}));

// Product route for scheduling
assemblyProductRouteRouter.get('/product-route-all-instructions', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(
            queryPath[61].AS_PD_PRODUCT_PRODUCTROUTE,
            { path: true },
            async function (error, data) {
                if (error) {
                    resp.send({
                        "status code": 404,
                        'error': error,
                    });
                }
                var query = data.productRouteSelectQuery.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.query.product_id);
                query = query.replace(/{revision_number}/g, req.query.revision);
                selectQuery(query, resp);
            }
        );
    }
}));
module.exports = {
    assemblyProductRouteRouter
};