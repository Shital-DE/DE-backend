const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { queryPath } = require("../../Utils/Constants/query.path");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { executeSelectQuery } = require("../../Utils/file_read");
const properties = require('properties');

async function getUOMId( req) {
    return new Promise((resolve, reject) => {
        properties.parse(queryPath[4].PD_PRODUCT, { path: true }, async function (error, data) {
            try {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                let queryString = data.selectedProductUOM.replace(/\n/g, ' ');
                queryString = queryString.replace(/{product_id}/gim, req.body.product_id);
                const result = await executeSelectQuery(queryString);
                if (result[0]) {
                    const uom_id = result[0]['uom_id'];
                    resolve(uom_id); 
                    
                } else {
                    throw new AppError(NOT_FOUND, "Unit of measurement id not found", 404);
                }
            } catch (err) {
                reject(err); 
                
            }
        });
    });
}

module.exports = {
    getUOMId
}

