/* Rohini Mane
/// created 15/06/2023
/// modified 29/09/2023
/// Outsource Plan API
*/
const { queryPath } = require("../Utils/Constants/query.path");
const properties = require("properties");
const { selectDBQuery, executeDBQuery } = require("../Utils/crud");
const AppError = require("../Utils/ErrorHandling/appErrors");
const { NOT_FOUND, UNAUTHORIZED } = require("../Utils/Constants/errorCodes");
const { v4: uuidv4 } = require("uuid");

const outsourceProductList = async function (fromDate, toDate) {
  try {
    const query = await getOutsourceProperties();

    var outsourceQuery = query.outsourceList.replace(/\n/g, " ");
    outsourceQuery = outsourceQuery.replace(/{fromDate}/gim, fromDate);
    outsourceQuery = outsourceQuery.replace(/{toDate}/gim, toDate);

    const outsourceList = await selectDBQuery(outsourceQuery);
    return outsourceList;
  } catch (error) {
    throw error;
  }
};

const getSubcontractorList = async function () {
  try {
    const query = await new Promise((resolve, reject) => {
      properties.parse(
        queryPath[11].VW_CA_ACCOUNT_SUPPLIER,
        { path: true },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    var subcontractor = query.listSubcontractors;

    const subcontractorList = await selectDBQuery(subcontractor);
    return subcontractorList;
  } catch (error) {
    throw error;
  }
};

const getOutsourceChallanNo = async function () {
  try {
    const query = await getOutsourceProperties();

    let latestRecord = await selectDBQuery(query.latestOutsourceChallan);
    let year = await selectDBQuery(query.fiscal_year);

    let challanNo;
    let fiscalYear = year[0]["prefix"]; // '2425';

    if (latestRecord.length > 0) {
      let challanNumber = latestRecord[0]["outwardchallan_no"];
      let dbchallan = challanNumber.toString().substring(0, 4);

      if (dbchallan === fiscalYear) {
        let challan = challanNumber.toString();
        let increment = parseInt(challan.substring(4, 8)) + 1;
        challanNo = fiscalYear.concat(
          "",
          increment.toString().padStart(4, "0")
        );
      } else {
        challanNo = fiscalYear.concat("", "0001");
      }
    } else {
      challanNo = fiscalYear.concat("", "0001");
    }

    return challanNo;
  } catch (error) {
    throw error;
  }
};

const createOutsource = async function (body) {
  try {
    const outwardchallanNo = await getOutsourceChallanNo();

    const query = await getOutsourceProperties();
    const uid = uuidv4().replaceAll("-", "");
    var outsourceQuery = query.insertParentOutsource.replace(/\n/g, " ");
    outsourceQuery = outsourceQuery.replace(/{id}/gim, uid);
    outsourceQuery = outsourceQuery.replace(
      /{outwardchallan_no}/gim,
      outwardchallanNo
    );
    outsourceQuery = outsourceQuery.replace(
      /{outsource_date}/gim,
      body.outsource_date
    );
    outsourceQuery = outsourceQuery.replace(
      /{subcontractor_id}/gim,
      body.subcontractor_id
    );
    outsourceQuery = outsourceQuery.replace(/{userid}/gim, body.userid);

    const result = await executeDBQuery(outsourceQuery);

    if (result == "Success") {
      body.outsource_list.forEach(async (item) => {
        var outsourceChildQuery = query.insertChildOutsource.replace(
          /\n/g,
          " "
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{outsourceworkorder_id}/gim,
          uid
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{salesorder_id}/gim,
          item.salesorderid
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{product_id}/gim,
          item.productid
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{revision_number}/gim,
          item.revision_number
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{lineitemno}/gim,
          item.lineitemnumber
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{process_id}/gim,
          item.processid
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{instruction}/gim,
          item.instruction
        );
        outsourceChildQuery = outsourceChildQuery.replace(
          /{qty}/gim,
          item.quantity
        );

        await executeDBQuery(outsourceChildQuery);
      });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const inwardProductList = async function (subcontractor_id) {
  try {
    const query = await getOutsourceProperties();

    var inwardQuery = query.inward.replace(/\n/g, " ");
    inwardQuery = inwardQuery.replace(
      /{subcontractor_id}/gim,
      subcontractor_id
    );

    const inwardList = await selectDBQuery(inwardQuery);
    return inwardList;
  } catch (error) {
    throw error;
  }
};

const getInwardChallanNo = async function () {
  try {
    const query = await getOutsourceProperties();

    let latestRecord = await selectDBQuery(query.latestInwardChallan);
    let year = await selectDBQuery(query.fiscal_year);

    let challanNo;
    let fiscalYear = year[0]["prefix"];

    if (latestRecord.length > 0) {
      let challanNumber = latestRecord[0]["inwardchallan_no"];
      let dbchallan = challanNumber.toString().substring(0, 4);

      if (dbchallan === fiscalYear) {
        let challan = challanNumber.toString();
        let increment = parseInt(challan.substring(4, 8)) + 1;
        challanNo = fiscalYear.concat(
          "",
          increment.toString().padStart(4, "0")
        );
      } else {
        challanNo = fiscalYear.concat("", "0001");
      }
    } else {
      challanNo = fiscalYear.concat("", "0001");
    }

    return challanNo;
  } catch (error) {
    throw error;
  }
};

const saveInwardChallan = async function (inwardData) {
  try {
    const query = await getOutsourceProperties();

    const uid = uuidv4().replaceAll("-", "");
    const inwardChallan = await getInwardChallanNo();

    var recordexist = query.inwardRecordExists.replace(/\n/g, " ");
    recordexist = recordexist.replace(
      /{parentid}/gim,
      inwardData.challandata.outsourceid
    );

    let data = await selectDBQuery(recordexist);

    if (data.length > 0) {
      var inwardChildQuery = query.insertChildInward.replace(/\n/g, " ");
      inwardChildQuery = inwardChildQuery.replace(/{inwardid}/gim, data[0].id);
      inwardChildQuery = inwardChildQuery.replace(
        /{ow_details_id}/gim,
        inwardData.challandata.outsourcechildid
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{productid}/gim,
        inwardData.outsource.productid
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{revision_number}/gim,
        inwardData.outsource.revision_number
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{processid}/gim,
        inwardData.outsource.processid
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{qty}/gim,
        inwardData.outsource.quantity
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{pendingqty}/gim,
        inwardData.outsource.quantity -
        (inwardData.qty + inwardData.challandata.sumqty)
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{inwardqty}/gim,
        inwardData.qty
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{status}/gim,
        inwardData.status
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{loginid}/gim,
        inwardData.userid
      );
      await executeDBQuery(inwardChildQuery);
    } else {
      var inwardParentQuery = query.insertParentInward.replace(/\n/g, " ");
      inwardParentQuery = inwardParentQuery.replace(/{uid}/gim, uid);
      inwardParentQuery = inwardParentQuery.replace(
        /{inwardchallan}/gim,
        inwardChallan
      );
      inwardParentQuery = inwardParentQuery.replace(
        /{parentid}/gim,
        inwardData.challandata.outsourceid
      );
      inwardParentQuery = inwardParentQuery.replace(
        /{subcontractor}/gim,
        inwardData.challandata.subcontractor_id
      );
      inwardParentQuery = inwardParentQuery.replace(
        /{loginid}/gim,
        inwardData.userid
      );

      await executeDBQuery(inwardParentQuery);

      var inwardChildQuery = query.insertChildInward.replace(/\n/g, " ");
      inwardChildQuery = inwardChildQuery.replace(/{inwardid}/gim, uid);
      inwardChildQuery = inwardChildQuery.replace(
        /{ow_details_id}/gim,
        inwardData.challandata.outsourcechildid
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{productid}/gim,
        inwardData.outsource.productid
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{revision_number}/gim,
        inwardData.outsource.revision_number
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{processid}/gim,
        inwardData.outsource.processid
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{qty}/gim,
        inwardData.outsource.quantity
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{pendingqty}/gim,
        inwardData.outsource.quantity - inwardData.qty
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{inwardqty}/gim,
        inwardData.qty
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{status}/gim,
        inwardData.status
      );
      inwardChildQuery = inwardChildQuery.replace(
        /{loginid}/gim,
        inwardData.userid
      );

      await executeDBQuery(inwardChildQuery);
    }
    if (inwardData.status == true) {
      var inwardChildUpdate = query.updateChildInward.replace(/\n/g, " ");
      inwardChildUpdate = inwardChildUpdate.replace(
        /{status}/gim,
        inwardData.status
      );
      inwardChildUpdate = inwardChildUpdate.replace(
        /{outsourcechildid}/gim,
        inwardData.challandata.outsourcechildid
      );
      await executeDBQuery(inwardChildUpdate);

      var outsourceChildUpdate = query.updateChildOutsource.replace(/\n/g, " ");
      outsourceChildUpdate = outsourceChildUpdate.replace(
        /{status}/gim,
        inwardData.status
      );
      outsourceChildUpdate = outsourceChildUpdate.replace(
        /{outsourcechildid}/gim,
        inwardData.challandata.outsourcechildid
      );
      await executeDBQuery(outsourceChildUpdate);
    }
    return inwardChallan;
  } catch (e) { }
};

const finishedInwardList = async function (subcontractor_id) {
  try {
    const query = await getOutsourceProperties();

    var finishedInwardQuery = query.finishedInward.replace(/\n/g, " ");
    finishedInwardQuery = finishedInwardQuery.replace(
      /{subcontractor_id}/gim,
      subcontractor_id
    );

    const inwardList = await selectDBQuery(finishedInwardQuery);
    return inwardList;
  } catch (error) {
    throw error;
  }
};

const subcontractorProcessCapability = async function (subcontractor_id, process_id, createdby) {
  try {
    const queryData = await getOutsourceProperties();

    var query = queryData.subcontractor_process_capability.replace(/\n/g, " ");
    query = query.replace(/{subcontractor_id}/gim, subcontractor_id);
    query = query.replace(/{process_id}/gim, process_id);
    query = query.replace(/{createdby}/gim, createdby);

    const result = await executeDBQuery(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const list_ProcessCapability = async function () {
  try {
    const queryData = await getOutsourceProperties();

    var query = queryData.listsubcontractor_process.replace(/\n/g, " ");

    const result = await selectDBQuery(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const delete_ProcessCapability = async function (id) {
  try {
    const queryData = await getOutsourceProperties();

    var query = queryData.delete_subcontractor_process.replace(/\n/g, " ");
    query = query.replace(/{id}/gim, id);

    const result = await executeDBQuery(query);
    if (result == "Success") {
      return "success";
    } else {
      return "fail";
    }

  } catch (error) {
    throw error;
  }
};

const subcontractorWiseOutsourcelist = async function (body) {
  try {
    const queryData = await getOutsourceProperties();

    var query = queryData.pdf_challan_list.replace(/\n/g, " ");
    query = query.replace(/{subcontractor_id}/gim, body.subcontractor_id);
    query = query.replace(/{year}/gim, body.year);
    query = query.replace(/{month}/gim, body.month);

    const result = await selectDBQuery(query);
    for (const item of result) {
      var subquery = queryData.challan_pdf_products.replace(/\n/g, " ");
      subquery = subquery.replace(/{outsourceid}/gim, item.outsourceid);
      const outlist = await selectDBQuery(subquery);
      item.outlist = outlist;
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const companyDetails = async function () {
  try {
    const queryData = await getOutsourceProperties();

    var query = queryData.cc_company_details.replace(/\n/g, " ");

    const result = await selectDBQuery(query);
    return result;
  } catch (error) {
    throw error;
  }
};

async function getOutsourceProperties() {
  return new Promise((resolve, reject) => {
    properties.parse(
      queryPath[18].OUTSOURCE,
      { path: true },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  outsourceProductList,
  getSubcontractorList,
  getOutsourceChallanNo,
  createOutsource,
  inwardProductList,
  saveInwardChallan,
  finishedInwardList,
  subcontractorProcessCapability,
  list_ProcessCapability,
  delete_ProcessCapability,
  subcontractorWiseOutsourcelist,
  companyDetails,
};
