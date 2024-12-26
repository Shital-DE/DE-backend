// Nilesh Desai
// Created Date : 15-04-2023
// Description :

const express = require("express");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const properties = require("properties");
const { queryPath } = require("../../Utils/Constants/query.path");
const {
  insertQuery,
  selectQuery,
  updateQuery,
} = require("../../Utils/file_read");
/*const {
  startsettinginsertvalidation,
  updatestartproductionvalidation,
  getpreviousproductiontimevalidation,
  finalendproductionvalidation,
  endProcessvalidation,
  getproductBOMid,
  getlastproductroutedetails,
  createproductmachineroutevalidation,
  productmachineroutediffSeqvalidation,
  productmachineroutediffRevisionvalidation,
  // jobStartAPIvalidation,
  machineloginstatusvalidation,
  machinelogoutvalidation,
  // toollistvalidation,
  barcodedocumentvalidation,
  penddingproductlistvalidation,
  productlistfromcplistvalidation,
  machineprogarmseqwiselistvalidation,
  productprocessseqvalidation,
  // workstationstatusidValidation,
  // finaljobproductionstatusvalidation,
  getmachineuservalidation,
  getinstructionvalidation,
  ompstartsettinginsertvalidation,
  ompfinalendproductionvalidation,
  cpmessagesinsertvalidation,
  cpmessagestatuscheckvalidation,
  prmessagestatuscheckvalidation,
  availablePRvalidation,
  prmessagesinsertvalidation,
  tabletloginloginsertvalidation,
} = require("../../Validations/operator.validation");
*/
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");

const operatorcontrollerrouter = express.Router();
const axios = require("axios");
const whatsapp_no = process.env.WHATSAPP_NUMBER;
// const instance_id = process.env.INSTANCE_ID;
// const temperature_value = process.env.ATTENDANCE_TEMPERATURE
const instance_id = process.env.INSTANCE_ID;
const temperature_value = process.env.ATTENDANCE_TEMPERATURE;

operatorcontrollerrouter.post(
  "/update-start-production",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      }
      if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Rmsid not found", 403);
      }
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      }
      if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      }
      if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      }
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "production record id not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.ompupdatestartproduction.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsid}/gim, req.body.rms_issue_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(/{id}/gim, req.body.id);
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);
operatorcontrollerrouter.post(
  "/machine-login-status",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {      
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "employeeid not found", 403);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.machineloginstatusupdate.replace(/\n/g, "");
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/machine-logout",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.machinelogout.replace(/\n/g, "");

            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/scanbarcodefunction",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.year == undefined) {
        throw new AppError(NOT_FOUND, "year not found", 403);
      } else if (req.body.document_no == undefined) {
        throw new AppError(NOT_FOUND, "document_no not found", 403);
      }
      properties.parse(
        queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.scanbarcodedata.replace(/\n/g, " ");
          query = query.replace(/{barcodedocumentno}/gim, req.body.document_no);
          selectQuery(query, resp);
        }
      );
    }
  })
);

operatorcontrollerrouter.post(
  "/pendingproductlist",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 403);
      }

      properties.parse(
        queryPath[28].OPERATOR_SCREEN,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.pendingproductlist.replace(/\n/g, " ");
          query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

operatorcontrollerrouter.post(
  "/productlistfromcapacityplan",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 403);
      } else if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "product_id not found", 403);
      } else if (req.body.rms_id == undefined) {
        throw new AppError(NOT_FOUND, "rms_id not found", 403);
      } else if (req.body.poid == undefined) {
        throw new AppError(NOT_FOUND, "poid not found", 403);
      }

      properties.parse(
        queryPath[28].OPERATOR_SCREEN,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.productlistfromcp.replace(/\n/g, " ");
          query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
          query = query.replace(/{product_id}/gim, req.body.product_id);
          query = query.replace(/{rms_id}/gim, req.body.rms_id);
          query = query.replace(/{poid}/gim, req.body.poid);
          selectQuery(query, resp);
        }
      );
    }
  })
);

operatorcontrollerrouter.post(
  "/productprocessseq",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "product_id not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 403);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "revision_numbernot found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.productprocessseq.replace(/\n/g, "");
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
            query = query.replace(
              /{revision_number}/gim,
              req.body.revision_number
            );
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/machineProgramListFromERP",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token); 
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "product_id not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 403);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revision_numbernot found", 403);
      } else if (req.body.Process_seqno == undefined) {
        throw new AppError(NOT_FOUND, "seqno not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.wcseqwiseprogramlist.replace(/\n/g, "");
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{revision_number}/gim, req.body.revisionno);
            query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
            query = query.replace(/{seqno}/gim, req.body.Process_seqno);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/operatorworkstatusall",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token); 
    if (userdata) {
      if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "employee_id not found", 403);
      }  else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.operatorworkstatusall.replace(/\n/g, "");
            query = query.replace(/{empid}/gim, req.body.employee_id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/toollist",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      }
      properties.parse(
        queryPath[28].OPERATOR_SCREEN,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.toollistquery.replace(/\n/g, " ");
          query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

operatorcontrollerrouter.get(
  "/getoperatorrejresons",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      properties.parse(
        queryPath[28].OPERATOR_SCREEN,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.getoperatorrejresons, resp);
        }
      );
    }
  })
);

operatorcontrollerrouter.post(
  "/get-product-BOM-id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.productid == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.getproductBomid.replace(/\n/g, " ");
            query = query.replace(/{productid}/gim, req.body.productid);

            selectQuery(query, resp);
          }
        );
      }
    }
  })
);
operatorcontrollerrouter.post(
  "/workstationstatusid",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token); 
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstation id not found", 404);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employee id not found", 404);
      } else if (req.body.processrouteid == undefined) {
        throw new AppError(NOT_FOUND, "processrouteid id not found", 404);
      } else if (req.body.seqno == undefined) {
        throw new AppError(NOT_FOUND, "seqno not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.getproductworkstationJobStatusId.replace(
              /\n/g,
              " "
            );
            query = query.replace(
              /{scanCode.barcodeProductid}/gim,
              req.body.product_id
            );
            query = query.replace(/{scanCode.idd}/gim, req.body.rms_issue_id);
            query = query.replace(
              /{widget.loginpagedata.workCentreid}/gim,
              req.body.workcentre_id
            );
            query = query.replace(
              /{widget.loginpagedata.workstationid}/gim,
              req.body.workstation_id
            );
            query = query.replace(
              /{widget.loginpagedata.loginId}/gim,
              req.body.employee_id
            );
            query = query.replace(
              /{widget.productrouteid}/gim,
              req.body.processrouteid
            );
            query = query.replace(/{widget.seqno}/gim, req.body.seqno);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/get-last-product-route-details",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
      if (userdata) {
      if (req.body.productid == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "revision_number not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.getlastproductroutedetails.replace(/\n/g, " ");
            query = query.replace(/{productid}/gim, req.body.productid);
            query = query.replace(
              /{Rrevision_number}/gim,
              req.body.revision_number
            );
            selectQuery(query, response);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/start-setting-insert",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Rmsid not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 403);
      } else if (req.body.processrouteid == undefined) {
        throw new AppError(NOT_FOUND, "processroute_id not found", 403);
      } else if (req.body.seqno == undefined) {
        throw new AppError(NOT_FOUND, "seqno not found", 403);
      }  else if (req.body.cprunnumber == undefined) {
        throw new AppError(NOT_FOUND, "cprunnumber not found", 403);
      } else if (req.body.cpexcutionid == undefined) {
        throw new AppError(NOT_FOUND, "cpexcutionid not found", 403);
      }
      else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.Autostartsettinginsert.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsid}/gim, req.body.rms_issue_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(/{Rrevisionnumber}/gim, req.body.revisionno);
            query = query.replace(
              /{processroute_id}/gim,
              req.body.processrouteid
            );
            query = query.replace(/{seqno}/gim, req.body.seqno);
            query = query.replace(/{cpr}/gim, req.body.cprunnumber);
            query = query.replace(/{cpeid}/gim, req.body.cpexcutionid);
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

///insertfistscanproductCadlab

operatorcontrollerrouter.post(
  "/insertfistscanproductCadlab",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 403);
      }  else if (req.body.po_number == undefined) {
        throw new AppError(NOT_FOUND, "po_number not found", 403);
      } else if (req.body.poqty == undefined) {
        throw new AppError(NOT_FOUND, "poqty not found", 403);
      } 
      else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.insertfirstproductcadlab.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{Rrevisionnumber}/gim, req.body.revisionno);          
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{pono}/gim, req.body.po_number);
             query = query.replace(/{poqtyyy}/gim, req.body.poqty);
            query = query.replace(/{employeeiid}/gim, req.body.employee_id);
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/ompstartsetting",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Rmsid not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.Ompstartsettinginsert.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsid}/gim, req.body.rms_issue_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(/{Rrevisionnumber}/gim, req.body.revisionno);
            query = query.replace(
            /{process_sequence}/gim,
            req.body.process_sequence
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.get(
  "/requestid",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      properties.parse(
        queryPath[28].OPERATOR_SCREEN,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.requestidd, resp);
        }
      );
    }
  })
);

operatorcontrollerrouter.post(
  "/create-product-machine-route",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.productbomid == undefined) {
        throw new AppError(NOT_FOUND, "productBOM not found", 403);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "revision_number not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.createproductmachineroute.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{BOMid}/gim, req.body.productbomid);
            query = query.replace(
              /{Rrevision_number}/gim,
              req.body.revision_number
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/product-machine-route-diff-seq",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);  
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.productbomid == undefined) {
        throw new AppError(NOT_FOUND, "productBOM not found", 403);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "revision_number not found", 403);
      } else if (req.body.nseq == undefined) {
        throw new AppError(NOT_FOUND, "nseq not found", 403);
      } else if (req.body.version == undefined) {
        throw new AppError(NOT_FOUND, "version not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.productmachineroutewithdiffseq.replace(/\n/g, "");

            query = query.replace(/newversion/gim, req.body.version);
            query = query.replace(/nseq/gim, req.body.nseq);
            query = query.replace(/{productiid}/gim, req.body.product_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{BOMid}/gim, req.body.productbomid);
            query = query.replace(
              /{Rrevision_number}/gim,
              req.body.revision_number
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/product-machine-route-diff-revison",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.productbomid == undefined) {
        throw new AppError(NOT_FOUND, "productBOM not found", 403);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "revision_number not found", 403);
      } else if (req.body.version == undefined) {
        throw new AppError(NOT_FOUND, "version not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.productmachineroutewithdiffversion.replace(
              /\n/g,
              ""
            );
            query = query.replace(/newversion/gim, req.body.version);
            query = query.replace(/{productiid}/gim, req.body.product_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{BOMid}/gim, req.body.productbomid);
            query = query.replace(
              /{Rrevision_number}/gim,
              req.body.revision_number
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/get-previous-production-time",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);  
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Rmsid not found", 403);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentreid not found", 403);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "Workstationid not found", 403);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "revision_number not found", 403);
      } else if (req.body.productionstatusid == undefined) {
        throw new AppError(NOT_FOUND, "productionid not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.getpriviousproductiontime.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsid}/gim, req.body.rms_issue_id);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(
              /{Rrevisionnumber}/gim,
              req.body.revision_number
            );
            query = query.replace(
              /{productionstatusid}/gim,
              req.body.productionstatusid
            );
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/getstatusoffirstscanproductdetails",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      }  else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.firstscanstatusproduct.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);  
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/endProcess",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);

    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Productid not found", 403);
      } else if (req.body.rms_issuse_id == undefined) {
        throw new AppError(NOT_FOUND, "Rmsid not found", 403);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employeeid not found", 403);
      } else if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "ProductStatusid not found", 403);
      } else if (req.body.ok_quantity == undefined) {
        throw new AppError(NOT_FOUND, "ok_quantity not found", 403);
      } else if (req.body.rejected_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Rej_quantity not found", 403);
      } else if (req.body.rejected_reasons == undefined) {
        throw new AppError(NOT_FOUND, "Rej_reasons not found", 403);
      }
        else if (req.body.produced_count == undefined) {
        throw new AppError(NOT_FOUND, "produced_count not found", 403);
      }
        else if (req.body.production_time== undefined) {
        throw new AppError(NOT_FOUND, "production_time not found", 403);
      }
        else if (req.body.idle_time == undefined) {
        throw new AppError(NOT_FOUND, "idle_time not found", 403);
      }
        else if (req.body.energy_consumed == undefined) {
        throw new AppError(NOT_FOUND, "energy_consumed not found", 403);
      }
      else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.endProcess.replace(/\n/g, "");
            query = query.replace(/{productionstatusID}/gim, req.body.id);
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issuse_id);
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(/{okquantity}/gim, req.body.ok_quantity);
            query = query.replace(/{rejqty}/gim, req.body.rejected_quantity);

            query = query.replace(/{pcount}/gim, req.body.produced_count);
            query = query.replace(/{ptime}/gim, req.body.production_time);
            query = query.replace(/{itime}/gim, req.body.idle_time);
            query = query.replace(/{energy}/gim, req.body.energy_consumed);
            query = query.replace(
              /{rejectedreason}/gim,
              req.body.rejected_reasons
            );
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/ompendProcess",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);

    if (userdata) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "ProductStatusid not found", 403);
      } else if (req.body.ok_quantity == undefined) {
        throw new AppError(NOT_FOUND, "ok_quantity not found", 403);
      } else if (req.body.rejected_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Rej_quantity not found", 403);
      } else if (req.body.rejected_reasons == undefined) {
        throw new AppError(NOT_FOUND, "Rej_reasons not found", 403);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.ompendProcess.replace(/\n/g, "");
            query = query.replace(/{productionstatusID}/gim, req.body.id);
            query = query.replace(/{okquantity}/gim, req.body.ok_quantity);
            query = query.replace(/{rejqty}/gim, req.body.rejected_quantity);
            query = query.replace(
              /{rejectedreason}/gim,
              req.body.rejected_reasons
            );
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/final-production-end",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
   
    if (userdata) {
      if (req.body.productid == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rmsid == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.wcid == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.finalEndProduction.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.productid);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rmsid);
            query = query.replace(/{workcentreid}/gim, req.body.wcid);
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/ompfinal-production-end",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);

    if (userdata) {
      if (req.body.productid == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rmsid == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.wcid == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else {

        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {

            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.finalEndProduction.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.productid);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rmsid);
            query = query.replace(/{workcentreid}/gim, req.body.wcid);
            updateQuery(query, resp);

          }
        );
      }
    }
  })
);
operatorcontrollerrouter.post(
  "/productionjobStatus",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);

    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "workstation_id not found", 404);
      } else if (req.body.processrouteid == undefined) {
        throw new AppError(NOT_FOUND, "processrouteid not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.finajobproductionstatus.replace(/\n/g, "");

            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
            query = query.replace(/{workcentreid}/gim, req.body.workcentre_id);
            query = query.replace(
              /{workstationid}/gim,
              req.body.workstation_id
            );
            query = query.replace(/{processid}/gim, req.body.processrouteid);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/getMachineuUerData",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "workstation_id not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.getMachineUserData.replace(/\n/g, "");
            query = query.replace(/{workcentreid}/gim, req.body.workcentre_id);
            query = query.replace(
              /{workstationid}/gim,
              req.body.workstation_id
            );
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/getInstructiondata",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.processrouteid == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.getInstructionData.replace(/\n/g, "");
            query = query.replace(
              /{processrouteid}/gim,
              req.body.processrouteid
            );
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/inserttoollist",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.productionstatusid == undefined) {
        throw new AppError(NOT_FOUND, "productionstatusid not found", 404);
      } else if (req.body.toolList == undefined) {
        throw new AppError(NOT_FOUND, "toolList not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.inserttoollistdata.replace(/\n/g, "");
            query = query.replace(
              /{productionstatusid}/gim,
              req.body.productionstatusid
            );
            query = query.replace(/{toollistinsert}/gim, req.body.toolList);
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/cpmessageStatuscheck",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);

    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.po_id == undefined) {
        throw new AppError(NOT_FOUND, "po_id id not found", 404);
      } else if (req.body.lineitno == undefined) {
        throw new AppError(NOT_FOUND, "lineitno not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.cpmessagestatuscheck.replace(/\n/g, "");

            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
            query = query.replace(/{po_id}/gim, req.body.po_id);
            query = query.replace(/{linno}/gim, req.body.lineitno);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/prmessageStatuscheck",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.po_id == undefined) {
        throw new AppError(NOT_FOUND, "po_id id not found", 404);
      } else if (req.body.lineitno == undefined) {
        throw new AppError(NOT_FOUND, "lineitno not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.prmessagestatuscheck.replace(/\n/g, "");

            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
            query = query.replace(/{po_id}/gim, req.body.po_id);
            query = query.replace(/{linno}/gim, req.body.lineitno);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/availablePR",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "product_id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }

            var query = data.avilablePR.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/cpmessageinsert",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.po_id == undefined) {
        throw new AppError(NOT_FOUND, "po_id id not found", 404);
      } else if (req.body.lineitno == undefined) {
        throw new AppError(NOT_FOUND, "lineitno not found", 404);
      } else if (req.body.employeeid == undefined) {
        throw new AppError(NOT_FOUND, "employeeid not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.cpmessageinsert.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
            query = query.replace(/{po_id}/gim, req.body.po_id);
            query = query.replace(/{linno}/gim, req.body.lineitno);
            query = query.replace(/{employee_id}/gim, req.body.employeeid);
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/prmessageinsert",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.revisionno == undefined) {
        throw new AppError(NOT_FOUND, "revisionno not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.po_id == undefined) {
        throw new AppError(NOT_FOUND, "po_id id not found", 404);
      } else if (req.body.lineitno == undefined) {
        throw new AppError(NOT_FOUND, "lineitno not found", 404);
      } else if (req.body.employeeid == undefined) {
        throw new AppError(NOT_FOUND, "employeeid not found", 404);
      } else if (req.body.authorized_person == undefined) {
        throw new AppError(NOT_FOUND, "authorized_person not found", 404);
      } else if (req.body.message == undefined) {
        throw new AppError(NOT_FOUND, "message not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.prmessageinsert.replace(/\n/g, "");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{revisionno}/gim, req.body.revisionno);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
            query = query.replace(/{po_id}/gim, req.body.po_id);
            query = query.replace(/{linno}/gim, req.body.lineitno);
            query = query.replace(/{employee_id}/gim, req.body.employeeid);
            query = query.replace(/{authori}/gim, req.body.authorized_person);
            query = query.replace(/{mze}/gim, req.body.message);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

operatorcontrollerrouter.post(
  "/tabletlogininsert",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    
    if (userdata) {
      if (req.body.android == undefined) {
        throw new AppError(NOT_FOUND, "android not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "workcentre_id not found", 404);
      } else if (req.body.workstation_id == undefined) {
        throw new AppError(NOT_FOUND, "workstation_id not found", 404);
      } else if (req.body.employeeid == undefined) {
        throw new AppError(NOT_FOUND, "employeeidid not found", 404);
      } else if (req.body.ipaddress == undefined) {
        throw new AppError(NOT_FOUND, "ipaddress not found", 404);
      } else if (req.body.loginstatus == undefined) {
        throw new AppError(NOT_FOUND, "loginstatus not found", 404);
      } else {
        properties.parse(
          queryPath[28].OPERATOR_SCREEN,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.tabletloginlosinsert.replace(/\n/g, "");
            query = query.replace(/{tablet_id}/gim, req.body.android);
            query = query.replace(/{wcid}/gim, req.body.workcentre_id);
            query = query.replace(/{wsid}/gim, req.body.workstation_id);
            query = query.replace(/{employee_id}/gim, req.body.employeeid);
            query = query.replace(/{ip}/gim, req.body.ipaddress);
            query = query.replace(/{status}/gim, req.body.loginstatus);
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

const defaultoperatorcontrollerrouter = [tryCatch, AppError];

defaultoperatorcontrollerrouter.forEach((router) => {
  operatorcontrollerrouter.use(router);
});

module.exports = { operatorcontrollerrouter };
