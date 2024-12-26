/* Rohini Mane
/// 03-06-2023
/// Capacity Plan API
*/
const { queryPath } = require('../Utils/Constants/query.path');
const properties = require('properties');
const { selectDBQuery, executeDBQuery } = require('../Utils/crud');
const AppError = require('../Utils/ErrorHandling/appErrors');
const { NOT_FOUND, UNAUTHORIZED } = require('../Utils/Constants/errorCodes');
const { v4: uuidv4 } = require('uuid');


//========================================//
const checkDate = async () => {
  try {
    const query = await getCPQueriesfromProperties();

    const data = await selectDBQuery(query.cpCheckDate);
    if (data.length != 0) {
      return data[0]["todate"];
    } else {
      return "Empty";
    }
  } catch (error) {
    throw (error);
  }
}

const selectCP_ProductList = async function (fromDate, toDate) {
  try {
    const query = await getCPQueriesfromProperties();

    var parentQuery = query.capacityPlanProductList.replace(/\n/g, ' ');
    parentQuery = parentQuery.replace(/{fromDate}/gim, fromDate);
    parentQuery = parentQuery.replace(/{toDate}/gim, toDate);

    const parentList = await selectDBQuery(parentQuery);

    return parentList;


  } catch (error) {
    throw (error);
  }
}

const addNewCP_ProductList = async function (fromDate, toDate, runnumber) {
  try {
    const query = await getCPQueriesfromProperties();

    // var parentQuery = query.addNewCPProductList.replace(/\n/g, ' ');
    // parentQuery = parentQuery.replace(/{fromDate}/gim, fromDate);
    // parentQuery = parentQuery.replace(/{toDate}/gim, toDate);
    // parentQuery = parentQuery.replace(/{runnumber}/gim, runnumber);

    var parentQuery = query.newPoPlanProductList.replace(/\n/g, ' ');

    parentQuery = parentQuery.replace(/{fromDate}/gim, fromDate);
    parentQuery = parentQuery.replace(/{toDate}/gim, toDate);
    parentQuery = parentQuery.replace(/{runnumber}/gim, runnumber);

    const parentList = await selectDBQuery(parentQuery);

    for (const item of parentList) {
      var subQuery = query.cpProductListSubQuery.replace(/\n/g, ' ');
      subQuery = subQuery.replace(/{product_id}/gim, item.product_id);
      subQuery = subQuery.replace(/{revision_number}/gim, item.revision_number);
      const subList = await selectDBQuery(subQuery);

      item.workcentre_route = subList;
    }

    return parentList;


  } catch (error) {
    throw (error);
  }
}

const runTimeNumberCP = async function () {
  try {
    const query = await getCPQueriesfromProperties();

    const data = await selectDBQuery(query.generateRunnumber);

    const runNumberVal = new Promise((resolve, reject) => {

      let date = new Date(); //2023-05-13
      let runNumber = '';
      let val2 = (date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2)).toString() //202305

      if (data != 0) {
        const tableRunnumber = data[0].runnumber.toString(); //202305001
        let val1 = tableRunnumber.substring(0, 6); //202305

        if (val1 === val2) { //val1:db 202212  === val2: current date 202305
          let str = tableRunnumber.substring(6, 9); //001 
          let runNo = parseInt(str) + 1;  //001 + 1 add
          runNumber = val2 + runNo.toString().padStart(3, '0');
        } else {
          runNumber = val2 + "001";
        }
      } else {
        runNumber = val2 + "001";
      }
      resolve(runNumber);

    })

    return runNumberVal;

  } catch (error) {
    throw (error);
  }
}

const saveCapacityPlan = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();

    let result = '';
    const runnumber = await runTimeNumberCP();

    for (var item of payload.list) {
      const uid = uuidv4().replaceAll('-', '')

      var parentQuery = query.saveCapacityPlanParentQuery.replace(/\n/g, ' ');
      parentQuery = parentQuery.replace(/{id}/gim, uid);
      parentQuery = parentQuery.replace(/{runnumber}/gim, runnumber);
      parentQuery = parentQuery.replace(/{salesorder_id}/gim, item.salesorder_id);
      parentQuery = parentQuery.replace(/{lineitemno}/gim, item.lineitemnumber);
      parentQuery = parentQuery.replace(/{product_id}/gim, item.product_id);
      parentQuery = parentQuery.replace(/{revision_no}/gim, item.revision_number);
      parentQuery = parentQuery.replace(/{quantity}/gim, item.orderedqty);
      result = await executeDBQuery(parentQuery);


      for (var route of item.workcentre_route) {
        var childQuery = query.saveCapacityPlanChildQuery.replace(/\n/g, ' ');
        childQuery = childQuery.replace(/{parent_id}/gim, uid);
        childQuery = childQuery.replace(/{workcentre_id}/gim, route.workcentre_id);
        childQuery = childQuery.replace(/{runtime_perunit}/gim, route.runtimemins);
        childQuery = childQuery.replace(/{runtime_total}/gim, route.runtimemins * item.orderedqty);
        childQuery = childQuery.replace(/{runno}/gim, runnumber);
        result = await executeDBQuery(childQuery);
      }
    }

    var logQuery = query.cpRundataLog.replace(/\n/g, ' ');
    logQuery = logQuery.replace(/{runnumber}/gim, runnumber);
    logQuery = logQuery.replace(/{fromdate}/gim, payload.fromDate);
    logQuery = logQuery.replace(/{todate}/gim, payload.toDate);
    logQuery = logQuery.replace(/{userid}/gim, payload.userid);
    result = await executeDBQuery(logQuery);

    return result;

  } catch (error) {
    throw (error);
  }
}

const updateCapacityPlan = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();

    let result = '';


    for (var item of payload.list) {
      const uid = uuidv4().replaceAll('-', '')

      var parentQuery = query.saveCapacityPlanParentQuery.replace(/\n/g, ' ');
      parentQuery = parentQuery.replace(/{id}/gim, uid);
      parentQuery = parentQuery.replace(/{runnumber}/gim, payload.runnumber);
      parentQuery = parentQuery.replace(/{salesorder_id}/gim, item.salesorder_id);
      parentQuery = parentQuery.replace(/{lineitemno}/gim, item.lineitemnumber);
      parentQuery = parentQuery.replace(/{product_id}/gim, item.product_id);
      parentQuery = parentQuery.replace(/{revision_no}/gim, item.revision_number);
      parentQuery = parentQuery.replace(/{quantity}/gim, item.orderedqty);
      result = await executeDBQuery(parentQuery);


      for (var route of item.workcentre_route) {
        var childQuery = query.saveCapacityPlanChildQuery.replace(/\n/g, ' ');
        childQuery = childQuery.replace(/{parent_id}/gim, uid);
        childQuery = childQuery.replace(/{workcentre_id}/gim, route.workcentre_id);
        childQuery = childQuery.replace(/{runtime_perunit}/gim, route.runtimemins);
        childQuery = childQuery.replace(/{runtime_total}/gim, route.runtimemins * item.orderedqty);
        childQuery = childQuery.replace(/{runno}/gim, payload.runnumber);
        result = await executeDBQuery(childQuery);

      }
    }


    return result;

  } catch (error) {
    throw (error);
  }
}
//========================================//
const capacityplan_list = async function () {
  try {
    const query = await getCPQueriesfromProperties();
    const data = await selectDBQuery(query.capacityPlanList);
    return data;
  } catch (e) { }
}

const graphViewList = async function (runnumber) {
  try {
    const query = await getCPQueriesfromProperties();

    var graphQuery = query.productionTime.replace(/\n/g, ' ');
    graphQuery = graphQuery.replace(/{runnumber}/gim, runnumber);
    const data = await selectDBQuery(graphQuery);
    return data;
  } catch (e) { }
}
//========================================//
const drag_dropList = async function (runnumber) {
  try {
    const query = await getCPQueriesfromProperties();

    var listQuery = query.cp_dragdropList.replace(/\n/g, ' ');
    listQuery = listQuery.replace(/{runnumber}/gim, runnumber);
    const data = await selectDBQuery(listQuery);

    return data;
  } catch (e) { }
}

const savedrag_dropProduct = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();

    var dragQuery = query.saveDragProduct.replace(/\n/g, ' ');
    dragQuery = dragQuery.replace(/{capacityplan_id}/gim, payload.cpid);
    dragQuery = dragQuery.replace(/{cp_child_id}/gim, payload.cpchild_id);
    dragQuery = dragQuery.replace(/{salesorder_id}/gim, payload.salesorder_id);
    dragQuery = dragQuery.replace(/{product_id}/gim, payload.product_id);
    dragQuery = dragQuery.replace(/{lineitemno}/gim, payload.lineitemnumber);
    dragQuery = dragQuery.replace(/{revision_no}/gim, payload.revision_number);
    dragQuery = dragQuery.replace(/{sequence_no}/gim, payload.sequencenumber);
    dragQuery = dragQuery.replace(/{quantity}/gim, payload.quantity);
    dragQuery = dragQuery.replace(/{workcentre_id}/gim, payload.workcentre_id);
    dragQuery = dragQuery.replace(/{runnumber}/gim, payload.runnumber);
    const data = await executeDBQuery(dragQuery);
    return "data";
  } catch (e) { }
}

const saveAlldrag_dropProduct = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();
    payload.forEach(async element => {

      var dragQuery = query.saveDragProduct.replace(/\n/g, ' ');
      dragQuery = dragQuery.replace(/{capacityplan_id}/gim, element.cpid);
      dragQuery = dragQuery.replace(/{cp_child_id}/gim, element.cpchild_id);
      dragQuery = dragQuery.replace(/{salesorder_id}/gim, element.salesorder_id);
      dragQuery = dragQuery.replace(/{product_id}/gim, element.product_id);
      dragQuery = dragQuery.replace(/{lineitemno}/gim, element.lineitemnumber);
      dragQuery = dragQuery.replace(/{revision_no}/gim, element.revision_number);
      dragQuery = dragQuery.replace(/{sequence_no}/gim, element.sequencenumber);
      dragQuery = dragQuery.replace(/{quantity}/gim, element.quantity);
      dragQuery = dragQuery.replace(/{workcentre_id}/gim, element.workcentre_id);
      dragQuery = dragQuery.replace(/{runnumber}/gim, element.runnumber);
      const data = await executeDBQuery(dragQuery);
    });
    return "data";
  } catch (e) { }
}
const assignedWorkcentre_CPProducts = async function (workcentre_id, runnumber) {
  try {
    const query = await getCPQueriesfromProperties();

    var listQuery = query.workcentreProduct.replace(/\n/g, ' ');
    listQuery = listQuery.replace(/{workcentre_id}/gim, workcentre_id);
    listQuery = listQuery.replace(/{runnumber}/gim, runnumber);
    const data = await selectDBQuery(listQuery);
    return data;
  } catch (e) { }
}

const updateWStoDragProduct = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();

    var updateQuery = query.updateWSDragProduct.replace(/\n/g, ' ');
    updateQuery = updateQuery.replace(/{workstation_id}/gim, payload.workstation_id);
    updateQuery = updateQuery.replace(/{capacityplan_id}/gim, payload.capacityplan_id);
    updateQuery = updateQuery.replace(/{cp_child_id}/gim, payload.cp_child_id);

    const data = await executeDBQuery(updateQuery);
    return data;
  } catch (e) { }
}

const deleteWorkcentre_CPProducts = async function (cp_child_id) {
  try {
    const query = await getCPQueriesfromProperties();

    var listQuery = query.workcentreProduct_delete.replace(/\n/g, ' ');
    listQuery = listQuery.replace(/{cp_child_id}/gim, cp_child_id);

    const data = await executeDBQuery(listQuery);
    return data;
  } catch (e) { }
}
//========================================//

/* change po plan date */
const searchCustomerPO = async function (po) {
  try {
    const query = await getCPQueriesfromProperties();

    var poQuery = query.searchCustomerPO.replace(/\n/g, ' ');
    poQuery = poQuery.replace(/{po}/gim, po);
    let so = await selectDBQuery(poQuery);

    if (so.length != 0 && so != null && so != undefined) {

      var childQuery = query.getPOProductList.replace(/\n/g, ' ');
      childQuery = childQuery.replace(/{salesorderid}/gim, so[0]['salesorderid']);
      const sodetails = await selectDBQuery(childQuery);

      so[0].sodetails = sodetails;
      return so[0];

    }
    else {
      return "";
    }

  } catch (e) {
    // return e;
  }
}


const updateAllPlanDateService = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();

    var updateSO = query.updatePlanDateSO.replace(/\n/g, ' ');
    updateSO = updateSO.replace(/{plandate}/gim, payload.plandate);
    updateSO = updateSO.replace(/{salesorderid}/gim, payload.salesorderid);
    const so = await executeDBQuery(updateSO);

    var updateSODetail = query.updatePlanDateSODetailAll.replace(/\n/g, ' ');
    updateSODetail = updateSODetail.replace(/{plandate}/gim, payload.plandate);
    updateSODetail = updateSODetail.replace(/{salesorderid}/gim, payload.salesorderid);

    const sodetail = await executeDBQuery(updateSODetail);

    if (so == 'Success' && sodetail == 'Success') {
      return 'Success';
    } else { return 'Failed'; }
  } catch (e) {

  }
}

const updateSinglePlanDateService = async function (payload) {
  try {
    const query = await getCPQueriesfromProperties();

    var updateSODetail = query.updatePlanDateSODetail.replace(/\n/g, ' ');
    updateSODetail = updateSODetail.replace(/{plandate}/gim, payload.plandate);
    updateSODetail = updateSODetail.replace(/{so_details_id}/gim, payload.sodetailsid);
    updateSODetail = updateSODetail.replace(/{salesorderid}/gim, payload.salesorder_id);

    const sodetail = await executeDBQuery(updateSODetail);
    if (sodetail == 'Success') {
      return 'Success';
    } else { return 'Failed'; }
  } catch (e) {

  }
}

const workcentreShift = async function (workcentre_id) {
  try {
    const query = await getCPQueriesfromProperties();

    var listworkstation = query.workstationShift.replace(/\n/g, ' ');
    listworkstation = listworkstation.replace(/{workcentre_id}/gim, workcentre_id);

    const data = await selectDBQuery(listworkstation);
    return data;
  } catch (e) { }
}

const updateShift = async function (value, ws_status_id, shift_id) {
  try {
    const query = await getCPQueriesfromProperties();

    var shift_status = query.shift_status_update.replace(/\n/g, ' ');
    shift_status = shift_status.replace(/{value}/gim, value);
    shift_status = shift_status.replace(/{ws_status_id}/gim, ws_status_id);

    const data = await executeDBQuery(shift_status);
    return data;
  } catch (e) { }
}

const shiftTotal = async function () {
  try {
    const query = await getCPQueriesfromProperties();

    const data = await selectDBQuery(query.shift_total);
    return data;
  } catch (e) { }
}

const workcentreProductsRealtime = async function (workcentre_id, runnumber) {
  try {
    const query = await getCPQueriesfromProperties();

    var listQuery = query.realtime_product_view.replace(/\n/g, ' ');
    listQuery = listQuery.replace(/{workcentre_id}/gim, workcentre_id);
    listQuery = listQuery.replace(/{runnumber}/gim, runnumber);
    const data = await selectDBQuery(listQuery);
    return data;
  } catch (e) { }
}

//========================================//
async function getCPQueriesfromProperties() {
  return new Promise((resolve, reject) => {
    properties.parse(queryPath[17].CAPACITY_PLAN, { path: true }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  checkDate,
  selectCP_ProductList,
  addNewCP_ProductList,
  saveCapacityPlan,
  updateCapacityPlan,
  capacityplan_list,
  graphViewList,
  drag_dropList,
  savedrag_dropProduct,
  saveAlldrag_dropProduct,
  updateWStoDragProduct,
  assignedWorkcentre_CPProducts,
  deleteWorkcentre_CPProducts,
  searchCustomerPO,
  updateAllPlanDateService,
  updateSinglePlanDateService,
  workcentreShift,
  updateShift,
  shiftTotal,
  workcentreProductsRealtime

}