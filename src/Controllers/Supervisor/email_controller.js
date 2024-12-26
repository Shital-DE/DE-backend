/* Rohini Mane
/// 28-05-2023
/// Capacity Plan API
*/
const express = require("express");
const emailRouter = express.Router();
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const { errorHandler } = require("../../Middlewares/error_handler");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const {
  NOT_FOUND,
  UNAUTHORIZED,
  OK,
  BAD_REQUEST,
} = require("../../Utils/Constants/errorCodes");
const emailService = require("../../Services/emailService");

//------------Generate Capacity Plan----------//

emailRouter.post(
  "/send",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userdata = authorizeToken(req.token);
    //const t = await sendNodeMail()
    //console.log(t);
    if (userdata) {
      const uint8ArrayData = new Uint8Array(req.body.pdfdata);
      const data = await emailService.sendNodeMail(
        uint8ArrayData,
        req.body.outsource_challan
      );
      resp.status(OK).send({ status: 200, message: "Success", data: data });
    } else {
      throw new AppError(UNAUTHORIZED, "Authorization unsuccessful.", 401);
    }
  })
);

const defaultCPRouter = [
  // errorHandler, tryCatch, AppError
];
defaultCPRouter.forEach((router) => {
  emailRouter.use(router);
});

module.exports = { emailRouter };

/*

if (userdata) {
      const uint8ArrayData = new Uint8Array(req.body.pdfdata);
      const data = await emailService.sendNodeMail(
        uint8ArrayData,
        req.body.outsource_challan
      );
      resp.status(OK).send({ status: 200, message: "Success", data: data });
    }

*/
