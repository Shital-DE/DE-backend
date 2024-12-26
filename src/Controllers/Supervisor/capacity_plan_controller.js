/* Rohini Mane
/// 28-05-2023
/// Capacity Plan API
*/
const express = require('express');
const capacityRouter = express.Router();
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const { errorHandler } = require('../../Middlewares/error_handler');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { NOT_FOUND, UNAUTHORIZED, OK, BAD_REQUEST } = require('../../Utils/Constants/errorCodes');
const cpService = require('../../Services/capacity_planService');


//------------Generate Capacity Plan----------//
capacityRouter.get('/checkDate', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    const data = await cpService.checkDate()
    resp.status(OK).send({ "status": 200, "message": "Success", "data": data });
  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

capacityRouter.post('/getCPProducts', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    if (!req.body.fromDate || !req.body.toDate) {
      resp.status(BAD_REQUEST).send({ "status": 400, "message": "'Invalid payload'" });
    } else {
      const data = await cpService.selectCP_ProductList(req.body.fromDate, req.body.toDate)
      resp.status(OK).send({ "status": 200, "message": "Success", "data": data });
    }
  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

capacityRouter.post('/addNewCPProducts', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    if (!req.body.fromDate || !req.body.toDate) {
      resp.status(BAD_REQUEST).send({ "status": 400, "message": "'Invalid payload'" });
    } else {
      const data = await cpService.addNewCP_ProductList(req.body.fromDate, req.body.toDate, req.body.runnumber)
      resp.status(OK).send({ "status": 200, "message": "Success", "data": data });
    }
  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

capacityRouter.post('/saveCapacityPlan', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.saveCapacityPlan(req.body)
    resp.send({ "status": 200, "message": data });

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

capacityRouter.post('/updateCapacityPlan', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.updateCapacityPlan(req.body)
    resp.send({ "status": 200, "message": data });

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));
//------------End Capacity Plan----------//
//------Bar Chart--------//
capacityRouter.get('/capacityplan_list', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {
    const data = await cpService.capacityplan_list()
    resp.send(data);

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

capacityRouter.post('/graph_view_list', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.graphViewList(req.body.runnumber)
    resp.send(data);

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }
}));

//--------Drag And Drop-----------//
capacityRouter.post('/cp_dragdropList', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.drag_dropList(req.body.runnumber)
    // resp.send(data);
    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/save-drapdrop-product', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.savedrag_dropProduct(req.body);
    // resp.send(data);
    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/save-alldrapdrop-product', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.saveAlldrag_dropProduct(req.body);
    // resp.send(data);
    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/update-ws-dragproduct', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.updateWStoDragProduct(req.body);
    // resp.send(data);
    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));


capacityRouter.post('/getWorkcentreCPProduct', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.assignedWorkcentre_CPProducts(req.body.workcentre_id, req.body.runnumber);
    // resp.send(data);
    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.delete('/deleteWorkcentreCPProduct', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.deleteWorkcentre_CPProducts(req.body.cp_child_id);

    if (data != null) {
      resp.send({ "status": 200, "message": data });
    }
    else {
      resp.send({ "status": 500, "message": data });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

//---------PO Plan Date Edit--------//
capacityRouter.post('/search-customer-po', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.searchCustomerPO(req.body.po);

    if (data != "") {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 400, "message": "Failed", "data": {} });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/update-plandate-so', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.updateAllPlanDateService(req.body);

    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": data });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/update-plandate-sodetail', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.updateSinglePlanDateService(req.body);

    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/workstation-shift', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.workcentreShift(req.body.workcentre_id);

    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.post('/update-shift', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.updateShift(req.body.value, req.body.ws_status_id);

    if (data != null) {
      resp.send({ "status": 200, "message": data });
    }
    else {
      resp.send({ "status": 500, "message": data });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

capacityRouter.get('/shift-total-time', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.shiftTotal();

    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

//--------------Real Time Product View----------------------//
capacityRouter.post('/getWorkcentreProductWithRoute', varifyToken, tryCatch(async (req, resp) => {
  const userdata = authorizeToken(req.token);
  if (userdata) {

    const data = await cpService.workcentreProductsRealtime(req.body.workcentre_id, req.body.runnumber);
    // resp.send(data);
    if (data != null) {
      resp.send({ "status": 200, "message": "Success", "data": data });
    }
    else {
      resp.send({ "status": 500, "message": "Failed", "data": [] });
    }

  } else {
    throw new AppError(UNAUTHORIZED, 'Authorization unsuccessful.', 401);
  }

}));

const defaultCPRouter = [
  // errorHandler, tryCatch, AppError
]
defaultCPRouter.forEach((router) => {
  capacityRouter.use(router);
});


module.exports = { capacityRouter }