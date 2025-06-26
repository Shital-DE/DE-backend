// Author : Shital Gayakwad
// Created Date : 5 March 2023
// Description : ERPX_PPC -> Queries executer

const fs = require("fs");
const readline = require("readline");
const dbConnect = require("../Config/Database/postgresql_config");
const { tryCatch } = require("./ErrorHandling/tryCatch");
const AppError = require("./ErrorHandling/appErrors");
const { NOTFOUND } = require("dns");
const { NOT_FOUND } = require("./Constants/errorCodes");
const { connection } = require("../Config/Database/postgresdb_config");

// Select query
async function selectQuery(query, resp) {
  try {
    const pool = await connection.connect();
    const data = new Promise((resolve, reject) => {
      pool.query(query, (error, result) => {
        if (!error) {
          resolve(result.rows);
        } else {
          resolve(error.message);
        }
      });
    });
    pool.release();
    resp.send(await data);
  } catch (e) {}
}

async function updateQuery(query, resp) {
  tryCatch(
    dbConnect.query(`${query}`, (error, result) => {
      if (!error) {
        if (result.rowCount >= 1) {
          resp.send("Updated successfully");
        } else if (result.command == "DO") {
          resp.send("Updated successfully");
        }
      } else {
        resp.send({ error: error.message });
      }
      dbConnect.end;
    })
  );
}

async function insertQuery(query, resp) {
  var newQuery;
  if (query.query) {
    newQuery = query.query;
  } else {
    newQuery = query;
  }
  tryCatch(
    dbConnect.query(`${newQuery}`, (error, result) => {
      if (!error) {
        if (query.query) {
          resp.send({ Status: "Inserted successfully", id: query.id });
        } else if (result.rows.length !== 0 && result.rows[0].id) {
          resp.send(result.rows[0].id);
        } else if (result.rowCount >= 1) {
          resp.send("Inserted successfully");
        } else if (result.command == "DO") {
          resp.send("Inserted successfully");
        }
      } else {
        resp.send(error.message);
      }
      dbConnect.end;
    })
  );
}

async function insertMultipleRecords(query) {
  tryCatch(
    dbConnect.query(`${query}`, (error, result) => {
      if (!error) {
        return "All records inserted";
      } else {
        resp.send({ error: error.message });
      }
      dbConnect.end;
    })
  );
}

async function deleteQuery(query, resp) {
  tryCatch(
    dbConnect.query(`${query}`, (error, result) => {
      if (!error) {
        if (result.rowCount >= 1) {
          resp.send("Deleted successfully");
        } else if (result.command == "DO") {
          resp.send("Deleted successfully");
        }
      } else {
        resp.send({ error: error.message });
      }
      dbConnect.end;
    })
  );
}

async function postreadQuery(
  filename,
  startLine,
  endLine,
  payload,
  queryIndex,
  resp
) {
  const fileStream = fs.createReadStream(filename);
  let currentLine = 0;
  let lines = [];
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", async (input) => {
    currentLine++;
    if (currentLine >= startLine && currentLine <= endLine) {
      lines.push(input);
    }
  });
  if (currentLine > endLine) {
    rl.close();
  }
  rl.on("close", async () => {
    const filedata = lines.join("\n");
    var query = filedata.slice(queryIndex);
    for (let [key, value] of payload) {
      const placeholder = key;
      const regex = new RegExp(placeholder, "gim");
      query = query.replace(regex, value);
    }

    await dbConnect.query(`${query}`, (error, result) => {
      if (!error) {
        resp.send(result.rows);
      } else {
        throw new AppError(NOT_FOUND, "Data not found.", 404);
      }
      dbConnect.end;
    });
  });
}

async function getreadQuery(filename, startLine, endLine, queryIndex, resp) {
  const fileStream = fs.createReadStream(filename);
  let currentLine = 0;
  let lines = [];
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", async (input) => {
    currentLine++;
    if (currentLine >= startLine && currentLine <= endLine) {
      lines.push(input);
    }
  });
  if (currentLine > endLine) {
    rl.close();
  }
  rl.on("close", async () => {
    const filedata = lines.join("\n");
    var query = filedata.slice(queryIndex);

    await dbConnect.query(`${query}`, (error, result) => {
      if (!error) {
        resp.send(result.rows);
      } else {
        throw new AppError(NOT_FOUND, "Data not found.", 404);
      }
      dbConnect.end;
    });
  });
}

async function putreadQuery(
  filename,
  startLine,
  endLine,
  payload,
  queryIndex,
  resp
) {
  const fileStream = fs.createReadStream(filename);
  let currentLine = 0;
  let lines = [];
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", async (input) => {
    currentLine++;
    if (currentLine >= startLine && currentLine <= endLine) {
      lines.push(input);
    }
  });
  if (currentLine > endLine) {
    rl.close();
  }
  rl.on("close", async () => {
    const filedata = lines.join("\n");
    var query = filedata.slice(queryIndex);
    for (let [key, value] of payload) {
      const placeholder = key;
      const regex = new RegExp(placeholder, "gim");
      query = query.replace(regex, value);
    }

    await dbConnect.query(`${query}`, (error, result) => {
      if (!error) {
        if (result != null) {
          resp.send("success");
        }
      } else {
        throw new AppError(NOT_FOUND, "Data not found.", 404);
      }
      dbConnect.end;
    });
  });
}

const executeSelectQuery = async (query) => {
  var response;
  try {
    const pool = await connection.connect();
    response = new Promise((resolve, reject) => {
      var noticeMessage;
      const noticeListener = (notice) => {
        if (notice.message.length === 32) {
          noticeMessage = notice.message;
        } else if (notice.message.length === 1) {
          noticeMessage = notice.message;
        }
      };
      pool.on("notice", noticeListener);
      pool.query(query, (error, result) => {
        pool.off("notice", noticeListener);
        if (error) {
          resolve(error);
        } else {
          if (result.length > 1) {
            if (result[0].command == "INSERT" && result[0].rowCount >= 1) {
              resolve({
                Message: "Success",
                "Row count":
                  result[0].rowCount + " rows inserted successfully.",
              });
            } else if (
              result[1].command == "SELECT" &&
              result[1].rowCount >= 1
            ) {
              resolve({
                Error: result[1].rows[0]["message"],
              });
            } else {
              resolve(result[1].rows);
            }
          } else if (result.command == "DELETE") {
            resolve({
              Message: "Success",
              "Row count": result.rowCount + " rows deleted successfully.",
            });
          } else if (result.rows.length != 0) {
            resolve(result.rows);
          } else {
            resolve(noticeMessage);
          }
        }
      });
    });
    pool.release();
    return response;
  } catch (e) {
    return e.message;
  }
};

module.exports = {
  postreadQuery,
  getreadQuery,
  putreadQuery,
  selectQuery,
  updateQuery,
  insertQuery,
  deleteQuery,
  insertMultipleRecords,
  executeSelectQuery,
};
