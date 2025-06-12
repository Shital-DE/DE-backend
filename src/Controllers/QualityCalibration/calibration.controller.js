// Author : Shital Gayakwad
// Created Date : 10 Dec 2023
// Description : Instrument calibration

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../Middlewares/generate_auth_token");
const AppError = require("../../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../../Utils/Constants/errorCodes");
const { queryPath } = require("../../Utils/Constants/query.path");
const {
  selectQuery,
  insertQuery,
  updateQuery,
  executeSelectQuery,
  deleteQuery,
} = require("../../Utils/file_read");
const calibrationRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const {
  sendEmail,
  executeMailHistoryQuery,
  generateOrderTable,
  extractNameFromEmail,
  generateOrderEmailContent,
  insertOrders,
  extractNameInitials,
} = require("../../Services/calibration.service");

// Generate card number
calibrationRouter.post(
  "/generate-card-number",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.instrument_id == undefined) {
        throw new AppError(NOT_FOUND, "Instrument id not found", 404);
      } else {
        properties.parse(
          queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.generateCardNumber.replace(/\n/g, " ");
            query = query.replace(/{instrument_id}/g, req.body.instrument_id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

// Frequency list
calibrationRouter.get(
  "/frequency",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[46].CC_CALIBRATIONFREQUENCY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.selectQuery, resp);
        }
      );
    }
  })
);

// Purchase orders
calibrationRouter.post(
  "/purchase-order",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.purchaseOrder.replace(/\n/g, " ");
          query = query.replace(/{product_id}/g, req.body.product_id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Instrument schedule registration
calibrationRouter.post(
  "/instrument-schedule-registration",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.createdby == undefined) {
        throw new AppError(NOT_FOUND, "Created by not found", 404);
      } else if (req.body.createdby == undefined) {
        throw new AppError(NOT_FOUND, "Instrument id not found", 404);
      } else if (req.body.cardnumber == undefined) {
        throw new AppError(NOT_FOUND, "Card number not found", 404);
      } else if (req.body.measuringrange == undefined) {
        throw new AppError(NOT_FOUND, "Measuring not found", 404);
      } else if (req.body.startdate == undefined) {
        throw new AppError(NOT_FOUND, "Start date not found", 404);
      } else if (req.body.duedate == undefined) {
        throw new AppError(NOT_FOUND, "Due date not found", 404);
      } else if (req.body.frequency == undefined) {
        throw new AppError(NOT_FOUND, "Frequency date not found", 404);
      } else if (req.body.certificate_mdocid == undefined) {
        throw new AppError(NOT_FOUND, "Certificates not found", 404);
      } else if (req.body.barcodeinformation == undefined) {
        throw new AppError(
          NOT_FOUND,
          "Barcode or qrcode information not found",
          404
        );
      } else if (req.body.purchaseorder_id == undefined) {
        throw new AppError(NOT_FOUND, "Purchase order id not found", 404);
      } else if (req.body.manufacturer == undefined) {
        throw new AppError(NOT_FOUND, "Manufacturer id not found", 404);
      } else {
        properties.parse(
          queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.insertQuery.replace(/\n/g, " ");
            query = query.replace(/{createdby}/g, req.body.createdby.trim());
            query = query.replace(
              /{instrument_id}/g,
              req.body.instrument_id.trim()
            );
            query = query.replace(/{cardnumber}/g, req.body.cardnumber.trim());
            query = query.replace(
              /{measuringrange}/g,
              req.body.measuringrange.trim()
            );
            query = query.replace(/{startdate}/g, req.body.startdate.trim());
            query = query.replace(/{duedate}/g, req.body.duedate.trim());
            query = query.replace(/{frequency}/g, req.body.frequency.trim());
            query = query.replace(
              /{barcodeinformation}/g,
              req.body.barcodeinformation.trim()
            );
            query = query.replace(
              /{purchaseorder_id}/g,
              req.body.purchaseorder_id.trim()
            );
            query = query.replace(
              /{manufacturer}/g,
              req.body.manufacturer.trim()
            );
            insertQuery(query, resp);
          }
        );
      }
    }
  })
);

// Update certificate id
calibrationRouter.post(
  "/certificate-reference",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.id == undefined) {
        throw new AppError(NOT_FOUND, "Id not found", 404);
      } else if (req.body.certificate_mdocid == undefined) {
        throw new AppError(NOT_FOUND, "Certificate id not found", 404);
      } else {
        properties.parse(
          queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.updateCertificateId.replace(/\n/g, " ");
            query = query.replace(/{id}/g, req.body.id);
            query = query.replace(
              /{certificate_mdocid}/g,
              req.body.certificate_mdocid
            );
            updateQuery(query, resp);
          }
        );
      }
    }
  })
);

// Current day records
calibrationRouter.get(
  "/currentday-status",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.currentDayRecords, resp);
        }
      );
    }
  })
);

// Calibration status
calibrationRouter.get(
  "/calibration-status",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          executeSelectQuery(data.calibrationStatus)
            .then((result) => {
              if (req.query.searchString == "") {
                if (req.query.range == 0) {
                  const filtereddata = result.slice(0, 50);
                  resp.send({ result: filtereddata });
                } else {
                  const start = parseInt(req.query.range) + 1,
                    end = parseInt(req.query.range) + 51;
                  const filtereddata = result.slice(start, end);
                  resp.send({ result: filtereddata });
                }
              } else {
                const filtereddata = result.filter((item) =>
                  item.instrumentname
                    .toLowerCase()
                    .includes(req.query.searchString.toLowerCase())
                );
                resp.send({ result: filtereddata });
              }
            })
            .catch((error) => {
              resp.send({ result: [] });
            });
        }
      );
    }
  })
);

// Mail addresses for order instruments
calibrationRouter.post(
  "/email-addresses",
  tryCatch(async (req, resp) => {
    if (req.body.recipient == undefined) {
      throw new AppError(NOT_FOUND, "Recipient not found", 404);
    } else {
      properties.parse(
        queryPath[37].EVENT_SUBSCRIBER,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.emailaddress.replace(/\n/g, " ");
          query = query.replace(/{recipientas}/g, req.body.recipient);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Send mail
calibrationRouter.post(
  "/send-instrument-order",
  varifyToken,
  tryCatch(async (req, resp) => {
    const user = authorizeToken(req.token);
    if (user) {
      const table = generateOrderTable(req.body.content);
      const toRec = extractNameInitials(req.body.to);
      const fromRec = extractNameInitials(req.body.from);
      const from = extractNameFromEmail(req.body.from);
      const mailcontent = generateOrderEmailContent({
        from: from,
        to: `${fromRec}-${toRec}`,
        table: table,
      });
      const response = await sendEmail({
        from: req.body.from,
        to: req.body.to,
        bcc: "nilesh.desai@genesis-tech.in, shital.gayakwad@genesis-tech.in",
        subject: req.body.subject,
        content: mailcontent,
      });
      if (response.success == true) {
        executeMailHistoryQuery({
          loginby: req.body.userId,
          fromrecipient: req.body.from,
          torecipient: req.body.to,
          subject: req.body.subject,
          mailcontent: `${fromRec}-${toRec},\n
                -- Get content from ppc.pd_product_instrumentorders --
                \nBest regards,\n\n${from}.`,
          description: "Instrument order",
        })
          .then((result) => {
            if (result.length > 0) {
              insertOrders({
                content: req.body.content,
                mailId: result[0]["id"],
              })
                .then((finalResult) => {
                  resp.send(finalResult);
                })
                .catch((error) => {
                  resp.send(error);
                });
            }
          })
          .catch((error) => {
            resp.send(error);
          });
      } else {
        resp.send("The email sending process has failed");
      }
    }
  })
);

// Measuring range list
calibrationRouter.post(
  "/measuring-range-list",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.measuringrangeList.replace(/\n/g, " ");
          query = query.replace(/{instrument_id}/g, req.body.id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Instrument data for send mail content
calibrationRouter.post(
  "/one-instrument-from-product-table",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[4].PD_PRODUCT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.oneInstrument.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// All mails for order instrument
calibrationRouter.get(
  "/all-instrument-orders",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[49].MAIL_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.allMails, resp);
        }
      );
    }
  })
);

// Calibration history registration
calibrationRouter.post(
  "/calibration-history-registration",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.insertQuery.replace(/\n/g, " ");
          query = query.replace(/{createdby}/g, req.body.createdby);
          query = query.replace(
            /{instrumentcalibrationschedule_id}/g,
            req.body.instrumentcalibrationschedule_id
          );
          query = query.replace(/{startdate}/g, req.body.startdate);
          query = query.replace(/{duedate}/g, req.body.duedate);
          query = query.replace(/{certificate_id}/g, req.body.certificate_id);
          query = query.replace(/{frequency}/g, req.body.frequency);
          insertQuery(query, resp);
        }
      );
    }
  })
);

// Send instrument for calibration
calibrationRouter.put(
  "/send-instrument-for-calibration",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.sendForCalibration.replace(/\n/g, " ");
          query = query.replace(/{createdby}/g, req.body.createdby);
          query = query.replace(/{id}/g, req.body.id);
          updateQuery(query, resp);
        }
      );
    }
  })
);

// Outward challan list
calibrationRouter.get(
  "/outward-instruments",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.outwardInstruments, resp);
        }
      );
    }
  })
);

// Generate outsource workorder
calibrationRouter.post(
  "/instrument-outsource-workorder",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[18].OUTSOURCE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.insertParentOutsource.replace(/\n/g, " ");
          const uid = uuidv4().replaceAll("-", "");
          query = query.replace(/{id}/g, uid);
          query = query.replace(
            /{outwardchallan_no}/g,
            req.body.outwardchallan_no
          );
          query = query.replace(/{outsource_date}/g, req.body.outsource_date);
          query = query.replace(
            /{subcontractor_id}/g,
            req.body.subcontractor_id
          );
          query = query.replace(/{userid}/g, req.body.userid);
          insertQuery({ query: query, id: uid }, resp);
        }
      );
    }
  })
);

// Gave challan reference
calibrationRouter.put(
  "/challan-reference-to-instruments",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.updateQuery.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.id);
          query = query.replace(
            /{outsourceworkorder_id}/g,
            req.body.outsourceworkorder_id
          );
          updateQuery(query, resp);
        }
      );
    }
  })
);

// Inward instruments list
calibrationRouter.get(
  "/inward-instruments",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.inwardInstruments, resp);
        }
      );
    }
  })
);

// Inward spacific instruments
calibrationRouter.put(
  "/inward-spacific-instrument",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.inwardSpacificInstrument.replace(/\n/g, " ");
          query = query.replace(/{startdate}/g, req.body.startdate);
          query = query.replace(/{duedate}/g, req.body.duedate);
          query = query.replace(/{frequency}/g, req.body.frequency);
          query = query.replace(
            /{certificate_mdocid}/g,
            req.body.certificateid
          );
          query = query.replace(/{id}/g, req.body.id);
          updateQuery(query, resp);
        }
      );
    }
  })
);

// All challans list
calibrationRouter.get(
  "/instruments-outsource-all-workorders",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.allChallans, resp);
        }
      );
    }
  })
);

// One challan data
calibrationRouter.post(
  "/one-challan-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.oneChallanData.replace(/\n/g, " ");
          query = query.replace(
            /{outsourceworkorder_id}/g,
            req.body.outsourceworkorder_id
          );
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Spacific instruments card number
calibrationRouter.post(
  "/spacific-instrument-card-numbers",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.spacificInstrumentCardNumber.replace(/\n/g, " ");
          query = query.replace(/{instrument_id}/g, req.body.instrument_id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Searched instruments status
calibrationRouter.post(
  "/searched-instruments-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.oneInstrumentData.replace(/\n/g, " ");
          query = query.replace(/{instrument_id}/g, req.body.instrument_id);
          query = query.replace(/{id}/g, req.body.id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// One instrument history
calibrationRouter.post(
  "/one-instrument-calibration-history",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.oneInstrumentHistory.replace(/\n/g, " ");
          query = query.replace(/{instrument_id}/g, req.body.instrument_id);
          query = query.replace(/{id}/g, req.body.id);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Reject instrument
calibrationRouter.put(
  "/reject-instrument",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.deleteQuery.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.id);
          query = query.replace(/{isdeleted}/g, req.body.isdeleted);
          updateQuery(query, resp);
        }
      );
    }
  })
);

// Add rejected instrument to history
calibrationRouter.post(
  "/add-rejected-instrument-to-history",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.rejectedInstrumentsRegistration.replace(/\n/g, " ");
          query = query.replace(/{createdby}/g, req.body.createdby);
          query = query.replace(
            /{instrumentcalibrationschedule_id}/g,
            req.body.instrumentcalibrationschedule_id
          );
          query = query.replace(/{startdate}/g, req.body.startdate);
          query = query.replace(/{duedate}/g, req.body.duedate);
          query = query.replace(/{certificate_id}/g, req.body.certificate_id);
          query = query.replace(/{rejectionreason}/g, req.body.rejectionreason);
          query = query.replace(/{isdeleted}/g, req.body.isdeleted);
          query = query.replace(
            /{remark}/g,
            req.body.remark == "" ? "null" : req.body.remark
          );
          insertQuery(query, resp);
        }
      );
    }
  })
);

// Instrument rejection reason
calibrationRouter.get(
  "/instrument-rejection-reasons",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.instrumentrejectionresons, resp);
        }
      );
    }
  })
);

// Rejected instruments data
calibrationRouter.get(
  "/rejected-instruments-data-for-new-instrument-order",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.rejectedInstrumentsDataForNewOrder, resp);
        }
      );
    }
  })
);

// One instrumentOrder
calibrationRouter.get(
  "/one-instrument-order",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[54].PD_PRODUCT_INSTRUMENTORDERS,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.oneOrderData.replace(/\n/g, " ");
          query = query.replace(/{mail_id}/g, req.query.params);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Stored instruments
calibrationRouter.get(
  "/stored-instruments",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.storedInstruments, resp);
        }
      );
    }
  })
);

// Cancel calibration
calibrationRouter.post(
  "/cancel-calibration",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[45].PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.cancelCalibration.replace(/\n/g, " ");
          query = query.replace(/{createdby}/g, req.body.createdby);
          query = query.replace(/{startdate}/g, req.body.startdate);
          query = query.replace(/{duedate}/g, req.body.duedate);
          query = query.replace(
            /{id}/g,
            req.body.instrumentcalibrationscheduleId
          );
          query = query.replace(/{frequency}/g, req.body.frequency);
          query = query.replace(
            /{certificate_mdocid}/g,
            req.body.certificate_mdocid
          );
          executeSelectQuery(query)
            .then((result) => {
              if (result) {
                properties.parse(
                  queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
                  { path: true },
                  function (error, data) {
                    if (error) {
                      throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.deleteQuery.replace(/\n/g, " ");
                    query = query.replace(/{id}/g, req.body.historytableid);
                    deleteQuery(query, resp);
                  }
                );
              }
            })
            .catch((e) => {
              resp.send({ Error: e });
            });
        }
      );
    }
  })
);

// Restore stored instruments
calibrationRouter.delete(
  "/restore-stored-instruments",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.deleteQuery.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.id);
          deleteQuery(query, resp);
        }
      );
    }
  })
);

// Rejected instruments data
calibrationRouter.get(
  "/rejected-instruments-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[48].PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.rejectedInstrumentsDataQuery, resp);
        }
      );
    }
  })
);

module.exports = {
  calibrationRouter,
};
