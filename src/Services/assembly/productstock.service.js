
const properties = require("properties");
const { queryPath } = require("../../Utils/Constants/query.path");

// Register and update stock
function registerAndUpdateStockQuery({ createdby, product_id, quantity, stockevent, parentproduct_id, sodetails_id, uom_id, preUOM, postUOM }) {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[51].AS_PD_PRODUCT_STOCK,
            { path: true },
            function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }
                var query = data.registerAndUpdateStock.replace(/\n/g, " ");
                query = query.replace(/{createdby}/g, createdby);
                query = query.replace(/{productid}/g, product_id);
                query = query.replace(/{quantity}/g, quantity);
                query = query.replace(/{stockevent}/g, stockevent);
                query = query.replace(/{newparentproduct_id}/g, parentproduct_id);
                query = query.replace(/{newsodetails_id}/g, sodetails_id);
                query = query.replace(/{uom_id}/g, uom_id);
                query = query.replace(/{preUOM}/g, preUOM);
                query = query.replace(/{postUOM}/g, postUOM);
                resolve(query);
            }
        );
    });
}

function getAvailableStockQuery(req) {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[51].AS_PD_PRODUCT_STOCK,
            { path: true },
            function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }
                var query = data.getAvailableStock.replace(/\n/g, " ");
                query = query.replace(/{product_id}/g, req.query.productid);
                resolve(query);
            }
        );
    });
}

module.exports = {
    registerAndUpdateStockQuery,
    getAvailableStockQuery
}