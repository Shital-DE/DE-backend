/*
// Rohini Mane
// 2 june 2023
*/

const { connection, dev_connection } = require('../Config/Database/postgresdb_config');

const selectDBQuery = async (query) => {
  try {
    const pool = await connection.connect();
    const result = await new Promise((resolve, reject) => {
      pool.query(`${query}`, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);

        }
      });
    });
    pool.release();
    return result;
  } catch (error) {
    throw error;
  }
}


const executeDBQuery = async (query) => {
  let pool;
  try {
    pool = await connection.connect();
    await pool.query(`${query}`)
    return "Success"
  }
  catch (error) {
    return "Fail"
  }
  finally {
    if (pool) {
      pool.release();
    } else {
      throw new Error('Pool release error: ');
    }
  }
}

const selectDevDBQuery = async (query) => {
  try {
    const devpool = await dev_connection.connect();
    const result = await new Promise((resolve, reject) => {
      devpool.query(`${query}`, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);

        }
      });
    });
    devpool.release();
    return result;
  } catch (error) {
    throw error;
  }
}

const executeDevDBQuery = async (query) => {
  let devpool;
  try {
    devpool = await dev_connection.connect();
    await devpool.query(`${query}`)
    return "Success"
  }
  catch (error) {
    return "Fail"
  }
  finally {
    if (devpool) {
      devpool.release();
    }
  }
}
module.exports = {
  selectDBQuery,
  executeDBQuery,
  executeDevDBQuery,
  selectDevDBQuery
}