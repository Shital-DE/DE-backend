const axios = require('axios');
const { json } = require('express');
const { selectDBQuery, executeDBQuery, executeDevDBQuery, selectDevDBQuery } = require('../Utils/crud');
const { queryPath } = require('../Utils/Constants/query.path');
const properties = require('properties');
const fs = require('fs');
const logger = require("../../log/infoLogger");


async function fetchAPIResult(body) {
  try {
    const apiResponse = await axios.post('http://192.168.0.55:3213/v1/industry40/getProductionStatus',
      { "slipid": body.rmsissue_id, "productid": body.product_id, "processid": body.process_id })
    if (apiResponse.status == 200) {
      await saveLog(body, apiResponse.data);
    }
    return apiResponse;

  } catch (e) {
    throw e;
  }

}


async function saveLog(body, response) {
  try {
    if (response.code == 200) {

      const query = await getQueriesfromProperties();

      var checkLogQuery = query.check_previous_log.replace(/\n/g, ' ');
      checkLogQuery = checkLogQuery.replace(/{product_id}/gim, body.product_id);
      checkLogQuery = checkLogQuery.replace(/{process_id}/gim, body.process_id);
      checkLogQuery = checkLogQuery.replace(/{rmsissue_id}/gim, body.rmsissue_id);

      let queryCount = await selectDevDBQuery(checkLogQuery);

      if (queryCount[0].count > 0) {
        var updateLogQuery = query.update_process_log.replace(/\n/g, ' ');
        updateLogQuery = updateLogQuery.replace(/{product_id}/gim, body.product_id);
        updateLogQuery = updateLogQuery.replace(/{process_id}/gim, body.process_id);
        updateLogQuery = updateLogQuery.replace(/{rmsissue_id}/gim, body.rmsissue_id);
        updateLogQuery = updateLogQuery.replace(/{log_details}/gim, JSON.stringify(response.data));

        const ress = await executeDevDBQuery(updateLogQuery);
      } else {
        var logQuery = query.insert_process_log.replace(/\n/g, ' ');
        logQuery = logQuery.replace(/{product_id}/gim, body.product_id);
        logQuery = logQuery.replace(/{process_id}/gim, body.process_id);
        logQuery = logQuery.replace(/{rmsissue_id}/gim, body.rmsissue_id);
        logQuery = logQuery.replace(/{quantity}/gim, response.data.length);
        logQuery = logQuery.replace(/{productiontime}/gim, response.productiontime);
        logQuery = logQuery.replace(/{idletime}/gim, response.idletime);
        logQuery = logQuery.replace(/{energyconsumed}/gim, response.energyconsumed);
        logQuery = logQuery.replace(/{log_details}/gim, JSON.stringify(response.data));

        const result = await executeDevDBQuery(logQuery);
      }
    }
  } catch (e) {
    throw e;
  }
}

async function product_process_log() {
  try {
    const query = await getQueriesfromProperties();
    const data = await selectDBQuery(query.product_process_log);

    for (const element of data) {

      if (element.process_id !== '') {
        await fetchAPIResult(element);
      } else {
        element.process_id = 'noprocess'
        await fetchAPIResult(element);
      }
    }
    return 'success';
  } catch (error) {
    logger.info(`ETL_Process_Log- ${Date(Date.now()).toString()} ${error}`);
    return 'fail';
  }
}


////////////////////// Total_workstation_current_log ///////////////////
function formatDate(date) {
  const day = String(date.getDate());// .padStart(2, '0');
  const month = String(date.getMonth() + 1); //.padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;

}

function formatDateToString(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const totalcurrenttagid = async function () {
  const today = new Date();
  const todayFormatted = new Date(formatDate(today));
  try {
    const query = await getQueriesfromProperties();

    const oldDate = await selectDevDBQuery(query.checkinglastRecordDate);

    if (oldDate != '') {
      const oldDate1 = oldDate[0]['logdate'];
      let date = new Date(formatDate(oldDate1));

      let oldformattedDate = formatDateToString(date);

      while (date < todayFormatted) {

        date.setDate(date.getDate() + 1);

        day = String(date.getDate()).padStart(2, '0');
        month = String(date.getMonth() + 1).padStart(2, '0');
        year = date.getFullYear();
        oldformattedDate = `${day}/${month}/${year}`;

        const response = await selectDBQuery(query.total_current_workstation_tagid);

        for (let i = 0; i < response.length; i++) {
          const element = response[i];
          if (element.total_current_tagid != '' && element.workstation_id != '' && oldformattedDate != '') {
            const currentdatavalues = await fetchtotalCurrentResult(element.workstation_id, element.total_current_tagid, oldformattedDate);

            if (currentdatavalues != '') {
              await insert_WS_current_saveLog(element.workstation_id, formatDate(date), currentdatavalues);
            }
          }
        }
      }

    }
    else {
      const response = await selectDBQuery(query.total_current_workstation_tagid);
      for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if (element.total_current_tagid != '' && element.workstation_id != '' && todayFormatted != '') {
          const currentdatavalues = await fetchtotalCurrentResult(element.workstation_id, element.total_current_tagid, todayFormatted);
          if (currentdatavalues != '') {
            await insert_WS_current_saveLog(element.workstation_id, todayFormatted, currentdatavalues);
          } 

        }
      }

    }
    return 'success';
  }
  catch (e) {
    logger.info('current log failed', e);
    return 'fail';
  }
}

async function fetchtotalCurrentResult(workstation_id, totalCurrentTagid, oldformattedDate) {
  try {
    const apiResponse = await axios.post(`${process.env.IND4_SERVER_URL}`,
      {
        "email": `${process.env.IND4_EMAIL_USER}`,
        "password": `${process.env.IND4_EMAIL_PASSWORD}`,
        "start_time": `${oldformattedDate} 00:00:02`,
        "end_time": `${oldformattedDate} 23:59:00`,
        "query_data": [
          {
            "id": totalCurrentTagid,
            "query": "coarse_data",
            "method": "data",
            "interval": "hour"
          }
        ]
      })

    const dataArray = apiResponse.data.data[`${totalCurrentTagid}`].data;

    return dataArray;
  } catch (e) {
    logger.info(`fetchtotalCurrentResult`, e);
  }
}

async function insert_WS_current_saveLog(wsid, actualdate, response) {
  try {
    const query = await getQueriesfromProperties();

    var checkLogQuery = query.insert_current_workstation_log.replace(/\n/g, ' ');
    checkLogQuery = checkLogQuery.replace(/{wsid}/gim, wsid);
    checkLogQuery = checkLogQuery.replace(/{actualDate}/gim, actualdate);
    checkLogQuery = checkLogQuery.replace(/{loggs_details}/gim, JSON.stringify(response));

    const result = await executeDevDBQuery(checkLogQuery);
    if (result == 'Success') {
      logger.info('ws_current_log saved successfully');
    } else {
      logger.info('ws_current_log failed to save');
    }
  } catch (e) {
    logger.info('ws_current_log failed');
  }
}


//========================================//
async function getQueriesfromProperties() {
  return new Promise((resolve, reject) => {
    properties.parse(queryPath[57].PRODUCTION_LOG, { path: true }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}


module.exports = { product_process_log, totalcurrenttagid }
