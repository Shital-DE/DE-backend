// Author : Shital Gayakwad
// Created Date : 19 March 2022
// Description : ERPX_PPC -> Quality controller
//Modified Date :

const express = require("express");
const { model } = require("mongoose");
const { errorHandler } = require("../../Middlewares/error_handler");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const {
  startInspectionValidation,
  endInspectionValidation,
  shortQuantityValidation,
  finalendInspectionValidation,
  changeendInspectionFlagValidation,
  inspectionstatusValidation,
} = require("../../Validations/quality.validation");
const qualitycontrollerRouter = express.Router();
const properties = require("properties");
const { queryPath } = require("../../Utils/Constants/query.path");
const {
  insertQuery,
  selectQuery,
  updateQuery,
} = require("../../Utils/file_read");

qualitycontrollerRouter.post(
  "/start-inspection",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { error, value } = startInspectionValidation.validate({});
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
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.startInspection.replace(/\n/g, " ");
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{rmsissue_id}/gim, req.body.rms_issue_id);
            query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
            query = query.replace(
              /{workstation_id}/gim,
              req.body.workstation_id
            );
            query = query.replace(/{user_id}/gim, req.body.employee_id);
            query = query.replace(/{revision}/gim, req.body.revision_number);
            query = query.replace(
            /{process_sequence}/gim,
            req.body.process_sequence
            );
            query = query.replace(/{processroute_id}/gim, req.body.processroute_id.trim());
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/get-start_inspection_time",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { error, value } = startInspectionValidation.validate({});
    if (userdata) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.getInspectionStartTime.replace(/\n/g, " ");
            query = query.replace(/{id}/gim, req.body.id);
            query = query.replace(
            /{process_sequence}/gim,
            req.body.process_sequence
            );
           
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/inspection-id",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { error, value } = startInspectionValidation.validate({});
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
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.getproductworkstationJobStatusId.replace(
              /\n/g,
              " "
            );
            query = query.replace(/{product_id}/gim, req.body.product_id);
            query = query.replace(/{rmsissue_id}/gim, req.body.rms_issue_id);
            query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
            query = query.replace(
              /{workstation_id}/gim,
              req.body.workstation_id
            );
            query = query.replace(/{employee_id}/gim, req.body.employee_id);
            query = query.replace(
              /{revision_number}/gim,
              req.body.revision_number
            );
            query = query.replace(
            /{process_sequence}/gim,
            req.body.process_sequence
            );
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.get(
  "/rejected-reasons",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      properties.parse(
        queryPath[9].QUALITY_DEPT_REJECTED_REASONS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.rejectedReasons, resp);
        }
      );
    }
  })
);

qualitycontrollerRouter.post(
  "/end-inspection",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { value, error } = endInspectionValidation.validate({});
    if (userdata) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "Id not fount", 404);
      } else if (req.body.ok_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Ok quantity not fount", 404);
      } else if (req.body.rework_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Rework quantity not fount", 404);
      } else if (req.body.rejected_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Rejected quantity not fount", 404);
      } else if (req.body.rejected_reasons == undefined) {
        throw new AppError(NOT_FOUND, "Rejected reasons not fount", 404);
      } else if (req.body.remark == undefined) {
        throw new AppError(NOT_FOUND, "Employee id not fount", 404);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.endInspection.replace(/\n/g, " ");
            query = query.replace(/{okquantity}/gim, req.body.ok_quantity);
            query = query.replace(/{rejqty}/gim, req.body.rejected_quantity);
            query = query.replace(
              /{rejectedreason}/gim,
              req.body.rejected_reasons
            );
            query = query.replace(/{reworkqty}/gim, req.body.rework_quantity);
            query = query.replace(/{id}/gim, req.body.id);
            const escapedRemark = req.body.remark.replace(/'/g, "''");
            query = query.replace(/{remark}/gim, escapedRemark);
            if (req.body.stockqty == undefined) {
              query = query.replace(/{stockqty}/gim, 0);
            } else {
              query = query.replace(/{stockqty}/gim, req.body.stockqty);
            }
          
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/short-quantity",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { value, error } = shortQuantityValidation.validate({});
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.rms_issuse_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.issue_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Issue quantity not found", 404);
      } else if (req.body.ok_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Ok quantity not found", 404);
      } else if (req.body.rework_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Rework quantity not found", 404);
      } else if (req.body.rejected_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Rejected quantity not found", 404);
      } else if (req.body.short_quantity == undefined) {
        throw new AppError(NOT_FOUND, "Short quantity not found", 404);
      } else if (req.body.employee_id == undefined) {
        throw new AppError(NOT_FOUND, "Employee id not found", 404);
      } else {
        properties.parse(
          queryPath[10].PD_PRODUCT_PRODUCTION_SHORT_QUANTITY_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.shortQuantity.replace(/\n/g, " ");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsid}/gim, req.body.rms_issuse_id);
            query = query.replace(/{issueqty}/gim, req.body.issue_quantity);
            query = query.replace(/{okquantity}/gim, req.body.ok_quantity);
            query = query.replace(/{reworkqty}/gim, req.body.rework_quantity);
            query = query.replace(/{rejqty}/gim, req.body.rejected_quantity);
            query = query.replace(/{shortqty}/gim, req.body.short_quantity);
            query = query.replace(/{employeeid}/gim, req.body.employee_id);
            query = query.replace(
              /{revision_number}/gim,
              req.body.revision_number
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/final-end-inspection",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { value, error } = finalendInspectionValidation.validate({});
    if (userdata) {
      if (req.body.productid == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.rmsissueid == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.workcentreid == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else if (req.body.revision_number == undefined) {
        throw new AppError(NOT_FOUND, "Product revision number not found", 404);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.finalEndInspection.replace(/\n/g, " ");
            query = query.replace(/{productid}/gim, req.body.productid);
            query = query.replace(/{rmsissueid}/gim, req.body.rmsissueid);
            query = query.replace(/{workcentreid}/gim, req.body.workcentreid);
            query = query.replace(
              /{revision_number}/gim,
              req.body.revision_number
            );
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/change-end-inspection-flag",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { value, error } = changeendInspectionFlagValidation.validate({});
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.rms_issue_id == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.changeEndProductionFlag.replace(/\n/g, " ");
            query = query.replace(/{workcentreid}/gim, req.body.workcentre_id);
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
            query = query.replace(
              /{revision_number}/gim,
              req.body.revision_number
            );
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/job-inspection-status-check",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { value, error } = inspectionstatusValidation.validate({});
    if (userdata) {
      if (req.body.product_id == undefined) {
        throw new AppError(NOT_FOUND, "Product id not found", 404);
      } else if (req.body.rmsissueid == undefined) {
        throw new AppError(NOT_FOUND, "Raw material issue id not found", 404);
      } else if (req.body.workcentre_id == undefined) {
        throw new AppError(NOT_FOUND, "Workcentre id not found", 404);
      } else {
        properties.parse(
          queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.jobInspectionStatusCheck.replace(/\n/g, " ");
            query = query.replace(/{productid}/gim, req.body.product_id);
            query = query.replace(/{rmsissueid}/gim, req.body.rmsissueid);
            query = query.replace(/{workcentreid}/gim, req.body.workcentre_id);
            query = query.replace(
              /{revision_number}/gim,
              req.body.revision_number
            );
            query = query.replace(
            /{process_sequence}/gim,
            req.body.process_sequence
            );
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

qualitycontrollerRouter.post(
  "/inspection-status",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    const { value, error } = inspectionstatusValidation.validate({});

    if (userdata) {
      properties.parse(
        queryPath[7].PD_PRODUCT_WORKSTATIONROUTE_STATUS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.inspectionStatus.replace(/\n/g, " ");
          query = query.replace(/{productid}/gim, req.body.product_id);
          query = query.replace(/{rmsissueid}/gim, req.body.rms_issue_id);
          query = query.replace(/{workcentre_id}/gim, req.body.workcentre_id);
          query = query.replace(
            /{revision_number}/gim,
            req.body.revision_number
          );
          query = query.replace(
            /{process_sequence}/gim,
            req.body.process_sequence
          );
          
          selectQuery(query, resp);
        }
      );
    }
  })
);

const defaultQualityRouter = [varifyToken, tryCatch, errorHandler, AppError];

defaultQualityRouter.forEach((router) => {
  qualitycontrollerRouter.use(router);
});

module.exports = {
  qualitycontrollerRouter,
};
