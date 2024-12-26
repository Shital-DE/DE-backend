/*
///@ Rohini Mane
/// 30 Jun 2023 
*/
const { queryPath } = require('../Utils/Constants/query.path');
const properties = require('properties');
const { selectDBQuery, executeDBQuery } = require('../Utils/crud');
// const { NOT_FOUND, UNAUTHORIZED } = require('../Utils/Constants/errorCodes');
// const connection = require('../Config/Database/postgresdb_config');
// const AppError = require('../Utils/ErrorHandling/appErrors');
// const { tryCatch } = require('../Utils/ErrorHandling/tryCatch');


//----New---------//
const getWorkcentreList = async function () {
  try {
    const query = await new Promise((resolve, reject) => {
      properties.parse(queryPath[6].WR_WORKCENTRE, { path: true }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const list = await selectDBQuery(query.getCPWorkcentre);

    return list;

  } catch (error) {
    throw (error);
  }
}

module.exports = { getWorkcentreList }