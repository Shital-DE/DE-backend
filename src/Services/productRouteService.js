/** Rohini Mane
    20-sept-2023
*/
const { queryPath } = require("../Utils/Constants/query.path");
const properties = require('properties');
const { selectDBQuery, executeDBQuery } = require('../Utils/crud');

const getfilledProductList = async () => {
  try {
    const query = await getProductRouteProperties();

    const data = await selectDBQuery(query.filledRouteProductList);
    if (data.length != 0) {
      return data;
    } else {
      return "Empty";
    }
  } catch (error) {
    throw (error);
  }
}

//========================================//
async function getProductRouteProperties() {
  return new Promise((resolve, reject) => {
    properties.parse(queryPath[29].PRODUCT_AND_PROCESS_PROUTE, { path: true }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}


module.exports = {
  getfilledProductList,
}