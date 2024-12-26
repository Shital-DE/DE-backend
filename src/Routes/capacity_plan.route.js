/* Rohini Mane
/// 28-05-2023
/// Capacity Plan API
*/
const express = require('express');
const { capacityRouter } = require('../Controllers/Supervisor/capacity_plan_controller');
const capacityPlanRouter = express.Router();

const defaultCapacityRouter = [
  {
    path: '/capacityPlan',
    route: capacityRouter
  }
];

defaultCapacityRouter.forEach((router) => {
  capacityPlanRouter.use(router.path, router.route);
});

module.exports = {
  capacityPlanRouter
}