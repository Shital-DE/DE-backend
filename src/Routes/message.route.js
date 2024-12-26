// Author : Swarupa T
// Created Date :
// Description : ERPX_Audit -> Expence Detail

const express = require("express");

const { eventRouter } = require("../Controllers/Message/Event");
const { subscriberRouter } = require("../Controllers/Message/Subscriber");
const {
  eventsubscriberRouter,
} = require("../Controllers/Message/EventSubscriber");

const messageRouter = express.Router();
const defaultmessageRouter = [
  {
    path: "/event", //http://localhost:8082/message/event/eventdd
    route: eventRouter,
  },
  {
    path: "/subscriber", //http://localhost:8082/message/subscriber/subscriberdd
    route: subscriberRouter,
  },
  {
    path: "/eventsubcriber",
    route: eventsubscriberRouter,
  },
];

defaultmessageRouter.forEach((route) => {
  messageRouter.use(route.path, route.route);
});

module.exports = {
  messageRouter,
};
