// Author : Shital Gayakwad
// Created Date : 30 Dec 2022
// Description : ERPX_PPC ->  Documents (PDF, 3 Models)

const express = require("express");
const { errorHandler } = require("../../Middlewares/error_handler");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const {
  pdfValidation,
  modelValidation,
  docValidation,
} = require("../../Validations/documents.validation");
const docRouter = express.Router();
const {
  getMongoConnection,
  closeMongoConnection,
} = require("../../Config/Database/mongodb_config");
const objectId = require("mongodb").ObjectId;
const filestore = process.env.FILESTORE;
const { GridFSBucket } = require("mongodb");
const properties = require("properties");
const { queryPath } = require("../../Utils/Constants/query.path");
const {
  selectQuery,
  updateQuery,
  deleteQuery,
  executeSelectQuery,
} = require("../../Utils/file_read");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const dbConnect = require("../../Config/Database/postgresql_config");
const { paginateResults } = require("../../Services/document.service");

// Searched Product Mongodb id for pdf view
docRouter.post(
  "/pdf-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const { error, value } = pdfValidation.validate({});
    const id = req.body.id;
    if (userData) {
      const id = req.body.id;
      if (id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else {
        properties.parse(
          queryPath[2].DOCUMENTS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.getPdfmdocId.replace(/\n/g, " ");
            query = query.replace(/{req.body.id}/g, id);
            selectQuery(query, resp);
          }
        );
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

// Searched Product Mongodb id for 3D model
docRouter.post(
  "/model-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    const { error, value } = modelValidation.validate({});
    const id = req.body.id;
    if (id == undefined) {
      throw new AppError(NOT_FOUND, "Product id not found", 404);
    } else {
      properties.parse(
        queryPath[2].DOCUMENTS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.getModelmdocId.replace(/\n/g, " ");
          query = query.replace(/{req.body.id}/g, id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Get Documents data in base64 from mongodb
docRouter.post(
  "/documents-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const id = req.body.id;
    const userData = authorizeToken(req.token);
    const { error, value } = docValidation.validate({});

    if (id == undefined) {
      throw new AppError(NOT_FOUND, "Documents mdoc id not found", 404);
    }

    const db = await getMongoConnection();
    const bucket = new GridFSBucket(db);
    const filestorecollection = db.collection(filestore);
    let fileData = "";
    const searchCriteria = { _id: new objectId(id) };
    const filestoredata = await filestorecollection.findOne(searchCriteria);
    const downloadStream = bucket.openDownloadStream(
      filestoredata["GridFS_ID"]
    );

    downloadStream.on("data", function (chunk) {
      fileData += chunk.toString("base64");
    });

    downloadStream.on("error", function (error) {
      closeMongoConnection();
    });

    downloadStream.on("end", function () {
      resp.send(fileData);

      closeMongoConnection();
    });
  })
);

docRouter.post(
  "/mdocid-folder-data",
  tryCatch(async (req, resp) => {
    try {
      const db = await getMongoConnection();
      const bucket = new GridFSBucket(db);
      const filestorecollection = db.collection(filestore);
      const mdocidlist = req.body.mdocidlist;

      const result = [];
      const data = [];
      const idList = mdocidlist
        .split("       ")
        .map((mdocidlist) => mdocidlist.trim());

      for (const index of idList) {
        id = index;

        if (id == undefined) {
          throw new AppError(NOT_FOUND, "Documents mdoc id not found", 404);
        }

        const searchCriteria = { _id: new objectId(id) };
        const filestoredata = await filestorecollection.findOne(searchCriteria);

        data.push({
          id: id,
          folder: filestoredata["folder"],
        });
      }
      resp.json(data);
    } catch (error) { }
  })
);

// All PDF's
docRouter.get(
  "/all_pdf-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[2].DOCUMENTS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.selectAllPDF.replace(/\n/g, " ");
          selectQuery(query, resp);
        }
      );
    }
  })
);

docRouter.post(
  "/pdf-model-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else {
        properties.parse(
          queryPath[2].DOCUMENTS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.documentData.replace(/\n/g, " ");
            query = query.replace(/{productid}/g, req.body.id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

//Programs upload API
docRouter.post(
  "/upload-programs",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.createdby == undefined) {
        throw new AppError(NOT_FOUND, "Created by not found", 404);
      } else if (req.body.pd_product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "Product revision not found", 404);
      } else if (req.body.workcenter_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstation id not found", 404);
      } else if (req.body.process_route_id == undefined) {
        throw new AppError(NOT_FOUND, "Process route id not found", 404);
      } else if (req.body.process_seq == undefined) {
        throw new AppError(NOT_FOUND, "Process sequence not found", 404);
      } else if (req.body.remark == undefined) {
        throw new AppError(NOT_FOUND, "Remark not found", 404);
      } else if (req.body.imagetype_code == undefined) {
        throw new AppError(NOT_FOUND, "Image extension not found", 404);
      } else if (req.body.data == undefined) {
        throw new AppError(NOT_FOUND, "Image data not found", 404);
      } else {
        properties.parse(
          queryPath[26].PD_PRODUCT_FOLDER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.insertProgramDetails.replace(/\n/g, " ");
            query = query.replace(/{createdby}/g, req.body.createdby);
            query = query.replace(/{pd_product_id}/g, req.body.pd_product_id);
            query = query.replace(/{workcentre_id}/g, req.body.workcenter_id);
            query = query.replace(/{workstation_id}/g, req.body.workstation_id);
            query = query.replace(
              /{processroute_id}/g,
              req.body.process_route_id
            );
            query = query.replace(
              /{revision_number}/g,
              req.body.revision_number.trim()
            );
            query = query.replace(/{remark}/g, req.body.remark);
            query = query.replace(/{imagetype_code}/g, req.body.imagetype_code);
            query = query.replace(/{process_seqnumber}/g, req.body.process_seq);
            dbConnect.query(`${query}`, async (error, result) => {
              if (!error) {
                if (result.rowCount == 1) {
                  const db = await getMongoConnection();
                  const bucket = new GridFSBucket(db);
                  const binaryData = Buffer.from(req.body.data, "base64");
                  const uploadStream = bucket.openUploadStream(req.body.remark);
                  uploadStream.write(binaryData);
                  uploadStream.end();
                  uploadStream.on("finish", async () => {
                    const uploadFile = {
                      postgresql_id: result.rows[0].id,
                      GridFS_ID: uploadStream.id,
                    };
                    const filestorecollection = db.collection(filestore);
                    const response = await filestorecollection.insertOne(
                      uploadFile
                    );
                    if (response.acknowledged == true) {
                      const mdocid =
                        response.insertedId
                          .toString()
                          .match(/[0-9a-fA-F]{24}/)?.[0] || null;
                      properties.parse(
                        queryPath[26].PD_PRODUCT_FOLDER,
                        { path: true },
                        function (error, data) {
                          if (error) {
                            throw new AppError(NOT_FOUND, error, 404);
                          }
                          var query = data.updateMdocId.replace(/\n/g, " ");
                          query = query.replace(
                            /{pd_product_folder_id}/g,
                            result.rows[0].id
                          );
                          query = query.replace(/{mdoc_id}/g, mdocid.trim());
                          updateQuery(query, resp);
                        }
                      );
                    } else {
                      resp.send(response);
                    }
                  });
                  uploadStream.on("error", (error) => {
                    resp.send("Error uploading file:", error);
                  });
                }
              } else {
                resp.send(error.message);
              }
              dbConnect.end;
            });
          }
        );
      }
    }
  })
);

// Delete program files from pd_product_folder and mongo db TestDatabase
docRouter.delete(
  "/delete-programs",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.postgresql_id == undefined) {
        throw new AppError(NOT_FOUND, "pd_product_folder id not found", 404);
      } else if (req.body.mongodb_id == undefined) {
        throw new AppError(NOT_FOUND, "MongoDB id not found", 404);
      } else {
        const db = await getMongoConnection();
        const filestorecollection = db.collection(filestore);
        const searchCriteria = {
          _id: new objectId(req.body.mongodb_id.trim()),
        };
        const document = await filestorecollection.findOne(searchCriteria);
        if (!document) {
          throw new AppError(NOT_FOUND, "Document not found", 404);
        } else {
          const bucket = new GridFSBucket(db);
          await bucket.delete(document["GridFS_ID"]).then(async () => {
            await filestorecollection
              .deleteOne(searchCriteria)
              .then(async () => {
                properties.parse(
                  queryPath[26].PD_PRODUCT_FOLDER,
                  { path: true },
                  function (error, data) {
                    if (error) {
                      throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.deleteDocument.replace(/\n/g, " ");
                    query = query.replace(
                      /{pd_product_folder_id}/g,
                      req.body.postgresql_id
                    );
                    deleteQuery(query, resp);
                  }
                );
              });
          });
        }
      }
    }
  })
);

// Program mdoc id return API
docRouter.post(
  "/program-mdoc-id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "Process route id not found", 404);
      } else {
        properties.parse(
          queryPath[26].PD_PRODUCT_FOLDER,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.programMdocId.replace(/\n/g, " ");
            query = query.replace(/{processroute_id}/g, req.body.id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

// Unverified programs
docRouter.get('/program-list-for-verification', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[26].PD_PRODUCT_FOLDER,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        var query = data.queryForVerifyPrograms.replace(/\n/g, " ");

        executeSelectQuery(query).then((rows) => {
          const resultRows = paginateResults({ rows: rows, index: req.query.footerIndex });
          resp.send(resultRows);
        }).catch((e) => {
          resp.send(e.message);
        });
      }
    );
  }
}));

// Verify machine programs
docRouter.put('/verify-machine-programs', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[26].PD_PRODUCT_FOLDER,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        var query = data.verifyMachinePrograms.replace(/\n/g, " ");
        query = query.replace(/{verify}/g, req.body.verify);
        query = query.replace(/{verifyby}/g, req.body.verifyby);
        query = query.replace(/{id}/g, req.body.id);
        updateQuery(query, resp);
      }
    );
  }
}));

//Verified programs
docRouter.get('/verified-machine-programs', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[26].PD_PRODUCT_FOLDER,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        var query = data.verifiedPrograms.replace(/\n/g, " ");
        executeSelectQuery(query).then((rows) => {
          const resultRows = paginateResults({ rows: rows, index: req.query.footerIndex });
          resp.send(resultRows);
        }).catch((e) => {
          resp.send(e.message);
        });
      }
    );
  }
}));


//cad labs New production product
docRouter.get('/new-production-product-list', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[26].PD_PRODUCT_FOLDER,
      { path: true },      
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        var query = data.newProductionProductCadlab.replace(/\n/g, " ");
        executeSelectQuery(query).then((rows) => {
        const resultRows = paginateResults({ rows: rows, index: req.query.footerIndex });
        resp.send(resultRows);
        }).catch((e) => {
          resp.send(e.message);
        });
      }
    );
  }
}));

                
// cad labs delete New production product
docRouter.delete('/deleteNewproductionproducttt', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);

  if (userData) {
  
      if (req.body.tableid == undefined) {
        throw new AppError(NOT_FOUND, "tableid not found", 404);
      } else {
          properties.parse(
                  queryPath[26].PD_PRODUCT_FOLDER,
                  { path: true },
                  function (error, data) {
                    if (error) {
                      throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.deleteNewProductionproduct.replace(/\n/g, " ");
                    query = query.replace(
                      /{newProductionproducttableid}/g,
                      req.body.tableid
                    );
                   // console.log(query);
                    deleteQuery(query, resp);
                  }
     );
}     
   }
}));

docRouter.delete(
  "/delete-programs",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.postgresql_id == undefined) {
        throw new AppError(NOT_FOUND, "pd_product_folder id not found", 404);
      } else if (req.body.mongodb_id == undefined) {
        throw new AppError(NOT_FOUND, "MongoDB id not found", 404);
      } else {
        const db = await getMongoConnection();
        const filestorecollection = db.collection(filestore);
        const searchCriteria = {
          _id: new objectId(req.body.mongodb_id.trim()),
        };
        const document = await filestorecollection.findOne(searchCriteria);
        if (!document) {
          throw new AppError(NOT_FOUND, "Document not found", 404);
        } else {
          const bucket = new GridFSBucket(db);
          await bucket.delete(document["GridFS_ID"]).then(async () => {
            await filestorecollection
              .deleteOne(searchCriteria)
              .then(async () => {
                properties.parse(
                  queryPath[26].PD_PRODUCT_FOLDER,
                  { path: true },
                  function (error, data) {
                    if (error) {
                      throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.deleteDocument.replace(/\n/g, " ");
                    query = query.replace(
                      /{pd_product_folder_id}/g,
                      req.body.postgresql_id
                    );
                    deleteQuery(query, resp);
                  }
                );
              });
          });
        }
      }
    }
  })
);




// Quality instrument calibration certificates
docRouter.post('/instrument-calibration-certificates', varifyToken, tryCatch(async (req, resp) => {
  const db = await getMongoConnection();
  const bucket = new GridFSBucket(db);
  const binaryData = Buffer.from(req.body.data, "base64");
  const uploadStream = bucket.openUploadStream(req.body.instrumentname);
  uploadStream.write(binaryData);
  uploadStream.end();
  uploadStream.on("finish", async () => {
    const uploadFile = {
      postgresql_id: req.body.postgresql_id,
      GridFS_ID: uploadStream.id,
    };
    const filestorecollection = db.collection('Instrument Certificates');
    const response = await filestorecollection.insertOne(
      uploadFile
    );
    if (response.acknowledged == true) {
      const mdocid = response.insertedId
        .toString()
        .match(/[0-9a-fA-F]{24}/)?.[0] || null;
      resp.send(mdocid);
      await closeMongoConnection();
    } else {
      resp.send(response);
    }
  })
}));

// Get certificates 
docRouter.post('/get-certificates', varifyToken, tryCatch(async (req, resp) => { //Instrument Certificates
  const db = await getMongoConnection();
  const bucket = new GridFSBucket(db);
  const filestorecollection = db.collection('Instrument Certificates');

  let fileData = "";
  const searchCriteria = { _id: new objectId(req.body.id) };
  const filestoredata = await filestorecollection.findOne(searchCriteria);
  const downloadStream = bucket.openDownloadStream(
    filestoredata["GridFS_ID"]
  );

  downloadStream.on("data", function (chunk) {
    fileData += chunk.toString("base64");
  });

  downloadStream.on("error", function (error) {
    closeMongoConnection();
  });

  downloadStream.on("end", function () {
    resp.send(fileData);
    closeMongoConnection();
  });
}));

const defaultdocRouter = [
  varifyToken,
  tryCatch,
  authorizeToken,
  AppError,
  errorHandler,
];

defaultdocRouter.forEach((router) => {
  docRouter.use(router);
});

module.exports = {
  docRouter,
};
