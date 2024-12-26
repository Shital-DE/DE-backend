/*
 * Author: Swaroopa T
 * Date: 25th November 2022
 * Purpose: Expence Detail Api Call
 *
 */
const express = require("express");
const properties = require("properties");
const { errorHandler } = require("../../Middlewares/error_handler");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { queryPath } = require("../../Utils/Constants/query.path");
const { selectQuery } = require("../../Utils/file_read");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require("mongodb");
const bodyParser = require("body-parser");
//const pool = require("../Config/DBConfig/postgresql_config");
const Grid = require("gridfs-stream");
const {
  getMongoConnection,
  closeMongoConnection,
} = require("../../Config/Database/mongodb_config");
const storage = new GridFsStorage({
  url: process.env.MONGO_DBURL + process.env.MONGO_DATABASE,

  file: (req, file) => {
    const filename = file.originalname;
    const fileInfo = {
      filename: filename,
      bucketName: "photos",
    };
    return fileInfo;
  },
});

const expenseDetailRouter = express.Router();

let poolClosed = true;
let gfs;

//const upload = multer({ storage });

expenseDetailRouter.get(
  "/expensedetail",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[38].AC_ACCOUNT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.GetExpenceAccountData.replace(/\n/g, " ");
          selectQuery(query, resp);
        }
      );
    }
  })
);

expenseDetailRouter.get(
  "/photo/:id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const getMdocId = req.params.id;
    // console.log(getMdocId);

    const userData = authorizeToken(req.token);
    //const { error, value } = docValidation.validate({});

    if (getMdocId == undefined) {
      throw new AppError(NOT_FOUND, "Documents mdoc id not found", 404);
    }

    if (userData) {
      try {
        const db = await getMongoConnection();
        const mdocId = getMdocId;
        //const db = conn;
        const bucket = new GridFSBucket(db, { bucketName: "photos" });
        const fileMetadata = await db
          .collection("photos.files")
          .find({ mdocId })
          .toArray();

        if (!fileMetadata || fileMetadata.length === 0) {
          throw new Error(`Files not found with mdocId: ${mdocId}`);
        }

        const filesData = [];

        const downloadPromises = fileMetadata.map((metadata) => {
          return new Promise((resolve, reject) => {
            const downloadStream = bucket.openDownloadStream(metadata._id);
            let fileData = "";
            const chunksData = [];

            downloadStream.on("data", (chunk) => {
              fileData += chunk.toString("base64");
              chunksData.push(chunk);
            });

            downloadStream.on("end", () => {
              filesData.push({
                fileId: metadata._id,
                fileName: metadata.filename,
                filemdocid: metadata.mdocId,
                fileData: fileData,
              });
              resolve();
            });

            downloadStream.on("error", (error) => {
              // console.error("An error occurred:", error);
              reject(error);
            });
          });
        });

        Promise.all(downloadPromises)
          .then(() => {
            resp.status(200).json({
              status: "success",
              statusCode: 200,
              filesData,
            });
          })
          .catch((error) => {
            // console.error("An error occurred:", error);
            resp.status(500).json({
              status: "error",
              statusCode: 500,
              message: "An error occurred",
            });
          });
      } catch (error) {
        // console.error("An error occurred:", error);
      }
    }
  })
);

expenseDetailRouter.put(
  "/expense/:id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const { pettyExpenseId } = req.params.id;
    const {
      payeename,
      expenseaccount_id,
      referencedocumentnumber,
      referencedocumentdate,
      amount,
    } = req.body;

    if (userData) {
      try {
        if (pettyExpenseId == undefined) {
          throw new AppError(NOT_FOUND, "pettyExpenseId Field Not Found", 404);
        } else {
          properties.parse(
            queryPath[38].AC_ACCOUNT,
            { path: true },
            function (error, data) {
              if (error) {
                throw new AppError(NOT_FOUND, error, 404);
              }
              var query = data.selectPettyExpense.replace(/\n/g, " ");
              query = query.replace(/{pettyExpenseId}/gim, pettyExpenseId);
              selectQuery(query, resp);
            }
          );
        }

        if (query.rows.length === 0) {
          resp.status(404).json({ error: "Record not found" });
          return;
        }
        const oldValues = existingRecord.rows[0];
        const updatedValues = {};

        // Check if each field has a new value in the request body, and update only those fields
        if (payeename !== undefined) {
          updatedValues.payeename = payeename;
        }

        if (expenseaccount_id !== undefined) {
          updatedValues.expenseaccount_id = expenseaccount_id;
        }

        if (referencedocumentnumber !== undefined) {
          updatedValues.referencedocumentnumber = referencedocumentnumber;
        }

        if (referencedocumentdate !== undefined) {
          updatedValues.referencedocumentdate = referencedocumentdate;
        }

        if (amount !== undefined) {
          updatedValues.amount = amount;
        }

        // Check if any fields have changed
        if (Object.keys(updatedValues).length > 0) {
          //const updateResult

          properties.parse(
            queryPath[38].AC_ACCOUNT,
            { path: true },
            function (error, data) {
              if (error) {
                throw new AppError(NOT_FOUND, error, 404);
              } else {
                var query = data.updateAccountForeignData.replace(/\n/g, "");
                query = query.replace(/{payeename}/gim, payeename);
                query = query.replace(
                  /{expenseaccount_id}/gim,
                  expenseaccount_id
                );
                query = query.replace(
                  /{referencedocumentnumber}/gim,
                  referencedocumentnumber
                );
                query = query.replace(
                  /{referencedocumentdate}/gim,
                  referencedocumentdate
                );
                query = query.replace(/{amount}/gim, amount);
                query = query.replace(/{pettyExpenseId}/gim, pettyExpenseId);

                //console.log(query);
                updateQuery(query, resp);
              }
            }
          );

          // Commit the transaction
          //await pool.query("COMMIT");

          // console.log(query.rows);
          resp.status(200).json(query.rows[0]);
        } else {
          // No fields have changed, so no update is necessary
          resp.status(200).json({ message: "No changes detected" });
        }
      } catch (error) {
        // Rollback the transaction if an error occurs
        //await pool.query("ROLLBACK");
        // console.error("Error occurred:", error);
        resp.status(500).send("Error occurred during database transaction");
      }
    }
  })
);

expenseDetailRouter.delete(
  "/photo/:id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);

    // console.log("Delete API called: /expenses/photo/:id");

    if (userData) {
      try {
        const fileId = req.params.id;
        if (fileId == undefined) {
          throw new AppError(NOT_FOUND, "fileId Not Found", 404);
        } else {
          const db = await getMongoConnection();
          const bucket = new GridFSBucket(db, { bucketName: "photos" });

          bucket.delete(new mongoose.Types.ObjectId(fileId), (error) => {
            if (error) {
              // console.error(
              //   "An error occurred while deleting the file:",
              //   error
              // );
              resp.status(500).json({
                status: "error",
                statusCode: 500,
                message: "An error occurred while deleting the file",
              });
            } else {
              resp.status(200).json({
                status: "success",
                statusCode: 200,
                message: "File deleted successfully",
              });
            }
          });
        }
      } catch (error) {
        // console.error("An error occurred:", error);
        resp.status(500).json({
          status: "error",
          statusCode: 500,
          message: "An error occurred",
        });
      }
    }
  })
);
const upload = multer({ storage });

expenseDetailRouter.post(
  "/expenses/photo",
  upload.array("photo"),
  varifyToken,
  tryCatch(async (req, resp) => {
    // console.log("API called: /expenses/photo");

    const getMdocId = req.body.mdocId;
    // console.log("Get Mdoc Id +++ " + getMdocId);
    const userData = authorizeToken(req.token);
    // console.log("userData" + userData);

    if (userData) {
      //await pool.query("BEGIN");
      const updatePromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          gfs.files.updateOne(
            { _id: file.id },
            { $set: { mdocId: mdocId } },
            (err, result) => {
              if (err) {
                // console.error("Error associating document ID:", err);
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      });

      await Promise.all(updatePromises);
      const insertResult = await pool.query();
      if (getMdocId == undefined) {
        throw new AppError(NOT_FOUND, "MDoc Id Not Found", 404);
      } else {
        properties.parse(
          queryPath[38].AC_ACCOUNT,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            } else {
              var query = data.insertPettyExpence.replace(/\n/g, "");
              query = query.replace(/{document_date}/g, req.body.document_date);
              query = query.replace(/{employee_id}/g, req.body.employee_id);
              query = query.replace(/{payeename}/g, req.body.payeename);
              query = query.replace(
                /{pettycashaccount_id}/g,
                req.body.pettycashaccount_id
              );
              query = query.replace(
                /{expenseaccount_id}/g,
                req.body.expenseaccount_id
              );
              query = query.replace(
                /{referencedocumentnumber}/g,
                req.body.referencedocumentnumber
              );
              query = query.replace(
                /{referencedocumentdate}/g,
                req.body.referencedocumentdate
              );
              query = query.replace(/{amount}/g, req.body.amount);
              query = query.replace(/{mdocId}/g, req.body.mdocId);
              query = query.replace(
                /{document_number}/g,
                req.body.document_number
              );

              //console.log(queryPath[14].AC_ACCOUNT);
              //console.log(query);
              insertQuery(query, resp);
            }
          }
        );
      }
      //await pool.query("COMMIT");
      //console.log(insertResult.rows);
      resp.status(200).json(insertResult.rows[0]);
    }
  })
);

const defaultExpenseDetailRouter = [
  varifyToken,
  tryCatch,
  authorizeToken,
  AppError,
  errorHandler,
];

defaultExpenseDetailRouter.forEach((router) => {
  expenseDetailRouter.use(router);
});

module.exports = {
  expenseDetailRouter,
};
