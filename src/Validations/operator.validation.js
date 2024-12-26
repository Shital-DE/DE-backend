// Author : Nilesh Desai
// Created Date 15-04-2023
// Description : operator screen

const Joi = require("joi");

const startsettinginsertvalidation = Joi.object({
  product_id: Joi.string().required(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  revisionno: Joi.string().required(),
});
const ompstartsettinginsertvalidation = Joi.object({
  product_id: Joi.string().required(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  revisionno: Joi.string().required(),
});

const updatestartproductionvalidation = Joi.object({
  product_id: Joi.string(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  id: Joi.string().required(),
});
const getpreviousproductiontimevalidation = Joi.object({
  product_id: Joi.string(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  productionid: Joi.string().required(),
});
const endProcessvalidation = Joi.object({
  product_id: Joi.string(),
  rms_issue_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  id: Joi.string().required(),
  ok_quantity: Joi.string().required(),
  rejected_quantity: Joi.string().required(),
  rejected_reasons: Joi.string().required(),
  produced_count: Joi.string().required(),
  production_time: Joi.string().required(),
  idle_time: Joi.string().required(),
  energy_consumed: Joi.string().required(),
});

const ompendProcessvalidation = Joi.object({
  id: Joi.string().required(),
  ok_quantity: Joi.string().required(),
  rejected_quantity: Joi.string().required(),
  rejected_reasons: Joi.string().required(),
});
const finalendproductionvalidation = Joi.object({
  product_id: Joi.string(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
});
const ompfinalendproductionvalidation = Joi.object({
  productid: Joi.string(),
  revisionno: Joi.string(),
  rmsid: Joi.string().required(),
  wcid: Joi.string().required(),
});
const getproductBOMid = Joi.object({
  productid: Joi.string(),
});
const getlastproductroutedetails = Joi.object({
  productid: Joi.string(),
  revision_number: Joi.string(),
});

const createproductmachineroutevalidation = Joi.object({
  product_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  productbomid: Joi.string().required(),
});

const productmachineroutediffSeqvalidation = Joi.object({
  product_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  productbomid: Joi.string().required(),
  nseq: Joi.string().required(),
  version: Joi.string().required(),
});
const productmachineroutediffRevisionvalidation = Joi.object({
  product_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  productbomid: Joi.string().required(),
  version: Joi.string().required(),
});
const machineloginstatusvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  employee_id: Joi.string().required(),
});
const machinelogoutvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
});
const machineProgrammdocidvalidation = Joi.object({
  product_id: Joi.string().required(),
});
const toollistvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
});
const barcodedocumentvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
});

const penddingproductlistvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
});

const productlistfromcplistvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
  product_id: Joi.string().required(),
  rms_id: Joi.string().required(),
  poid: Joi.string().required(),
});
const machineprogarmseqwiselistvalidation = Joi.object({
  product_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  revision_number: Joi.string().required(),
  processrouteid: Joi.string().required(),
});

const productprocessseqvalidation = Joi.object({
  workcentre_id: Joi.string().required(),
  product_id: Joi.string().required(),
  revision_number: Joi.string().required(),
});

const workstationstatusidValidation = Joi.object({
  product_id: Joi.string().required(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  processrouteid: Joi.string().required(),
  seqno: Joi.string().required(),
});

const finaljobproductionstatusvalidation = Joi.object({
  product_id: Joi.string(),
  revisionno: Joi.string(),
  rms_issue_id: Joi.string().required(),
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
  processrouteid: Joi.string().required(),
});
const cpmessagestatuscheckvalidation = Joi.object({
  product_id: Joi.string(),
  revisionno: Joi.string(),
  rms_issue_id: Joi.string().required(),
  po_id: Joi.string().required(),
  lineitno: Joi.string().required(),
});
const prmessagestatuscheckvalidation = Joi.object({
  product_id: Joi.string(),
  revisionno: Joi.string(),
  rms_issue_id: Joi.string().required(),
  po_id: Joi.string().required(),
  lineitno: Joi.string().required(),
});
const cpmessagesinsertvalidation = Joi.object({
  product_id: Joi.string(),
  revisionno: Joi.string(),
  rms_issue_id: Joi.string().required(),
  po_id: Joi.string().required(),
  lineitno: Joi.string().required(),
  employeeid: Joi.string().required(),
});
const prmessagesinsertvalidation = Joi.object({
  product_id: Joi.string(),
  revisionno: Joi.string(),
  rms_issue_id: Joi.string().required(),
  po_id: Joi.string().required(),
  lineitno: Joi.string().required(),
  employeeid: Joi.string().required(),
  authorized_person: Joi.string().required(),
  message: Joi.string().required(),
});
const getmachineuservalidation = Joi.object({
  workcentre_id: Joi.string().required(),
  workstation_id: Joi.string().required(),
});
const getinstructionvalidation = Joi.object({
  processrouteid: Joi.string().required(),
});
const availablePRvalidation = Joi.object({
  product_id: Joi.string().required(),
  revisionno: Joi.string().required(),
});
const inserttoolvalidation = Joi.object({
  processrouteid: Joi.string().required(),
  toolList: Joi.string().required(),
});

const tabletloginloginsertvalidation = Joi.object({
  android: Joi.string(),
  workcentre_id: Joi.string(),
  workstation_id: Joi.string().required(),
  employeeid: Joi.string().required(),
  ipaddress: Joi.string().required(),
  loginstatus: Joi.string().required(),
});

const employeeovertimedatainsertvalidation = Joi.object({
  loginid: Joi.string(),
  empid: Joi.string(),
  wsid: Joi.string().required(),
  poid: Joi.string().required(),
  productid: Joi.string().required(),
  remark: Joi.string().required(),
  starttime: Joi.string().required(),
  endtime: Joi.string().required(),  
});
const getemployeeovertimedatavalidation = Joi.object({
  empid: Joi.string(),  
});
const getproductlistfrompoidvalidation = Joi.object({
  so_id: Joi.string(),  
});

const updateempOvertimedatavalidation = Joi.object({
id: Joi.string(),  
  empid: Joi.string(),  
  endtime: Joi.string(),  
});

module.exports = {
  startsettinginsertvalidation,
  ompstartsettinginsertvalidation,
  updatestartproductionvalidation,
  getpreviousproductiontimevalidation,
  endProcessvalidation,
  finalendproductionvalidation,
  getproductBOMid,
  getlastproductroutedetails,
  createproductmachineroutevalidation,
  productmachineroutediffSeqvalidation,
  productmachineroutediffRevisionvalidation,
  machineloginstatusvalidation,
  machinelogoutvalidation,
  machineProgrammdocidvalidation,
  toollistvalidation,
  barcodedocumentvalidation,
  penddingproductlistvalidation,
  productlistfromcplistvalidation,
  productprocessseqvalidation,
  machineprogarmseqwiselistvalidation,
  workstationstatusidValidation,
  finaljobproductionstatusvalidation,
  getmachineuservalidation,
  getinstructionvalidation,
  inserttoolvalidation,
  ompendProcessvalidation,
  ompfinalendproductionvalidation,
  cpmessagestatuscheckvalidation,
  cpmessagesinsertvalidation,
  prmessagestatuscheckvalidation,
  availablePRvalidation,
  prmessagesinsertvalidation,
  tabletloginloginsertvalidation,
  employeeovertimedatainsertvalidation,
  getemployeeovertimedatavalidation,
  updateempOvertimedatavalidation,
  getproductlistfrompoidvalidation
};
