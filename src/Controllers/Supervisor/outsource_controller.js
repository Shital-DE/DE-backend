/* Rohini Mane
/// created 15/06/2023
/// modified 13/01/2024
/// Outsource Plan API
*/
const express = require("express");
const outsourceRouter = express.Router();
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { errorHandler } = require("../../Middlewares/generate_auth_token");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const {
  NOT_FOUND,
  UNAUTHORIZED,
  OK,
  BAD_REQUEST,
} = require("../../Utils/Constants/errorCodes");
const outsourceService = require("../../Services/outsourceService");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");

//-------Runtime Master -------//
outsourceRouter.post(
  "/list",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.outsourceProductList(
        req.body.fromDate,
        req.body.toDate
      );
      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail", data: [] });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.get(
  "/challan_no",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.getOutsourceChallanNo();

      if (data != null) {
        resp.send({ status: 200, message: "Success", challan_no: data });
      } else {
        resp.send({ status: 500, message: "Fail", challan_no: "" });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.post(
  "/save-outsource",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.createOutsource(req.body);

      if (data != null) {
        resp.send({ status: 200, message: "Success", challan_no: data });
      } else {
        resp.send({ status: 500, message: data });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.post(
  "/inward-list",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.inwardProductList(
        req.body.subcontractor_id
      );

      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail" });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.post(
  "/save-inward",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.saveInwardChallan(req.body);

      if (data != null) {
        resp.send({ status: 200, message: "Success", challan_no: data });
      } else {
        resp.send({ status: 500, message: data });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.post(
  "/finished-inward-list",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.finishedInwardList(
        req.body.subcontractor_id
      );

      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail" });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.post(
  "/save-subcontractor-process",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.subcontractorProcessCapability(
        req.body.subcontractor_id,
        req.body.process_id,
        req.body.userid
      );
      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail", data: [] });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.get(
  "/list-process-capability",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.list_ProcessCapability();
      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail", data: [] });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
); 

outsourceRouter.put(
  "/delete-subcontractor-process",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.delete_ProcessCapability(req.body.id);
      if (data == "success") {
        resp.send({ status: 200, message: "Success" });
      } else {
        resp.send({ status: 500, message: "Fail" });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.post(
  "/list-subcontractor-challan",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.subcontractorWiseOutsourcelist(
        req.body
      );
      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail" });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

outsourceRouter.get(
  "/company-details",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    if (userdata) {
      const data = await outsourceService.companyDetails();
      if (data != null) {
        resp.send({ status: 200, message: "Success", data: data });
      } else {
        resp.send({ status: 500, message: "Fail", data: [] });
      }
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);
const defaultRouter = [
  // errorHandler, tryCatch, AppError
];

defaultRouter.forEach((router) => {
  outsourceRouter.use(router);
});

module.exports = { outsourceRouter };
