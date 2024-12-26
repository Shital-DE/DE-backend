// Author : Shital Gayakwad
// Created Date : 18 July 2023
// Description : Product route controller

const express = require('express');
const productRouteRouter = express.Router();
const properties = require('properties');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { queryPath } = require('../../Utils/Constants/query.path');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const { selectQuery, insertQuery, updateQuery, deleteQuery, executeSelectQuery } = require('../../Utils/file_read');
const productRouteService = require('../../Services/productRouteService');

// Product route
productRouteRouter.post('/route-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.product_id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else {
            if (req.body.product_revision == undefined) {
                properties.parse(queryPath[22].PD_PRODUCT_PRODUCTROUTE, { path: true }, function (error, data) {
                    if (error) {
                        throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.productRoute.replace(/\n/g, ' ');
                    query = query.replace(/{product_id}/gim, req.body.product_id);
                    selectQuery(query, resp);
                });

            } else {
                properties.parse(queryPath[22].PD_PRODUCT_PRODUCTROUTE, { path: true }, function (error, data) {
                    if (error) {
                        throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.productRouteWithRevision.replace(/\n/g, ' ');
                    query = query.replace(/{product_id}/gim, req.body.product_id);
                    query = query.replace(/{revision_number}/gim, req.body.product_revision);
                    selectQuery(query, resp);
                });
            }
        }
    }
}));

// Product Revision
productRouteRouter.post('/product-revision', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.product_id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else {
            properties.parse(queryPath[23].CC_SS_CUSTOMER_POS, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.productRevision.replace(/\n/g, ' ');
                query = query.replace(/{product_id}/gim, req.body.product_id);
                selectQuery(query, resp);
            });
        }
    }
}));

// Product bill of material id 
productRouteRouter.post('/product-bill-of-material-id', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);

    if (userData) {
        properties.parse(queryPath[24].PD_PRODUCT_PRODUCTBILLOFMATERIAL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.billOfMaterialId.replace(/\n/g, ' ');
            query = query.replace(/{pd_product_id}/gim, req.body.product_id);
            selectQuery(query, resp);
        });
    }
}));

// Insert product route to database
productRouteRouter.post('/create-product-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[22].PD_PRODUCT_PRODUCTROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.insertProductRoute.replace(/\n/g, ' ');
            query = query.replace(/{createdby}/gim, req.body.createdby);
            query = query.replace(/{productbillofmaterial_id}/gim, req.body.productbillofmaterial_id);
            query = query.replace(/{workstation_id}/gim, req.body.workstation_id);
            query = query.replace(/{totalsetuptimemins}/gim, req.body.totalsetuptimemins);
            query = query.replace(/{totalruntimemins}/gim, req.body.totalruntimemins);
            query = query.replace(/{sequencenumber}/gim, req.body.sequencenumber);
            query = query.replace(/{revision_number}/gim, req.body.revision_number.trim());
            insertQuery(query, resp);
        });
    }
}));

// Process route
productRouteRouter.post('/create-process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[25].PD_PRODUCT_PRODUCTPROCESSROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.registerProcessRoute.replace(/\n/g, ' ');
            query = query.replace(/{createdby}/gim, req.body.createdby);
            query = query.replace(/{productroute_id}/gim, req.body.productroute_id);
            query = query.replace(/{setuptimemins}/gim, req.body.setuptimemins);
            query = query.replace(/{runtimemins}/gim, req.body.runtimemins);
            query = query.replace(/{pd_product_id}/gim, req.body.pd_product_id);
            query = query.replace(/{processsequencenumber}/gim, req.body.processsequencenumber);
            query = query.replace(/{revision_number}/gim, req.body.revision_number.trim());
            query = query.replace(/{instruction}/gim, req.body.instruction.trim());
            insertQuery(query, resp);
        });
    }
}));

// Process route
productRouteRouter.post('/process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[25].PD_PRODUCT_PRODUCTPROCESSROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.processRoute.replace(/\n/g, ' ');
            query = query.replace(/{pd_product_id}/gim, req.body.product_id);
            query = query.replace(/{revision_number}/gim, req.body.product_revision);
            selectQuery(query, resp);
        });
    }
}));

// Update product route
productRouteRouter.put('/update-product-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[22].PD_PRODUCT_PRODUCTROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.updateRoute.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            query = query.replace(/{sequencenumber}/gim, req.body.sequence);
            query = query.replace(/{workstation_id}/gim, req.body.workstation);
            query = query.replace(/{totalruntimemins}/gim, req.body.runtime);
            query = query.replace(/{totalsetuptimemins}/gim, req.body.setup);
            updateQuery(query, resp);
        });
    }
}));

// Delete product route
productRouteRouter.delete('/delete-product-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[22].PD_PRODUCT_PRODUCTROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteRoute.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));

//Update product process route
productRouteRouter.put('/update-process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[25].PD_PRODUCT_PRODUCTPROCESSROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.updateProcessRoute.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            query = query.replace(/{setuptimemins}/gim, req.body.setuptimemins);
            query = query.replace(/{runtimemins}/gim, req.body.runtimemins);
            query = query.replace(/{processsequencenumber}/gim, req.body.processsequencenumber);
            query = query.replace(/{instruction}/gim, req.body.instruction);
            updateQuery(query, resp);
        });
    }
}));

// Delete Process route
productRouteRouter.delete('/delete-process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[25].PD_PRODUCT_PRODUCTPROCESSROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteProcessRoute.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));

// Get instructions
productRouteRouter.post('/production-instructions', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[25].PD_PRODUCT_PRODUCTPROCESSROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.instructions.replace(/\n/g, ' ');
            query = query.replace(/{productroute_id}/gim, req.body.productroute_id);
            selectQuery(query, resp);
        });
    }
}));

// Get instruction with mongodb id
productRouteRouter.post('/production-instruction-documents', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[25].PD_PRODUCT_PRODUCTPROCESSROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.instructionWithDocuments.replace(/\n/g, ' ');
            query = query.replace(/{processroute_id}/gim, req.body.processroute_id);
            query = query.replace(/{sequence}/gim, req.body.sequence);
            selectQuery(query, resp);
        });
    }
}));

// New version 
// Register product-process-route
productRouteRouter.post('/register-product-process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.product_id == undefined) {
            throw new AppError(NOT_FOUND, 'Product id not found', 404);
        } else if (req.body.created_by == undefined) {
            throw new AppError(NOT_FOUND, 'User id not found', 404);
        } else if (req.body.productbillofmaterial_id == undefined) {
            throw new AppError(NOT_FOUND, 'Bill of material id not found', 404);
        } else if (req.body.workstation_id == undefined) {
            throw new AppError(NOT_FOUND, 'Workstation id not found', 404);
        } else if (req.body.workcentre_id == undefined) {
            throw new AppError(NOT_FOUND, 'Workcentre id not found', 404);
        } else if (req.body.setup_min == undefined) {
            throw new AppError(NOT_FOUND, 'Setup minutes not found', 404);
        } else if (req.body.runtime_min == undefined) {
            throw new AppError(NOT_FOUND, 'Runtime minutes not found', 404);
        } else if (req.body.revision_number == undefined) {
            throw new AppError(NOT_FOUND, 'Product revision not found', 404);
        } else if (req.body.sequencenumber == undefined) {
            throw new AppError(NOT_FOUND, 'Sequence number not found', 404);
        } else if (req.body.description == undefined) {
            throw new AppError(NOT_FOUND, 'Description not found', 404);
        } else {
            properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.insertQuery.replace(/\n/g, ' ');
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
            });
        }
    }
}));

// Get product and process route data to show to user
productRouteRouter.post('/product-and-process-route-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.selectQuery.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{revision_number}/gim, req.body.revision_number);
            selectQuery(query, resp);
        });
    }
}));

// Delete product and process route
productRouteRouter.delete('/delete-product-and-process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, function (error, data) {
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

// Update product and process route
productRouteRouter.put('/update-product-and-process-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.updateRouteQuery.replace(/\n/g, ' ');
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
            query = query.replace(/{new_description}/gim, req.body.new_description);
            query = query.replace(/{new_process_id}/gim, req.body.new_process_id);
            updateQuery(query, resp);
        });
    }
}));


// Already filled product route
productRouteRouter.get('/filled-product-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        const data = await productRouteService.getfilledProductList();
        resp.send({ "status": 200, "message": "Success", "data": data, "count": data.length });
    } else {
        throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
    }
}));

// Default product route
productRouteRouter.post('/fill-default-product-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.defaultProductRoute.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{revision_number}/gim, req.body.revision_number);
            query = query.replace(/{created_by}/gim, req.body.created_by);
            const result = await executeSelectQuery(query);
            if (result) {
                resp.send(result);
             }
        });
    } else {
        throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
    }

}));

// One wprkstation product route
productRouteRouter.get('/one-workstation-product-route', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, async function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.oneWorkcentreProductRoute.replace(/\n/g, ' ');
            query = query.replace(/{product_id}/gim, req.query.product_id);
            query = query.replace(/{revision_number}/gim, req.query.revision);
            query = query.replace(/{workcentre_id}/gim, req.query.workcentre_id);
            selectQuery(query, resp);
           
        });
    } else {
        throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
    }
}));

module.exports = {
    productRouteRouter
};

