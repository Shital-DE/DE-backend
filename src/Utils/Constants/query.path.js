// Author : Shital Gayakwad
// Created Date : 17 March 2022
// Description : ERPX_PPC -> ERPDBX paths
//Modified Date :

const projectPath = process.env.PROJECT_PATH;

const queryPath = [
  {
    CC_COMPANY: `${projectPath}/data/cc_company.properties`, //0
  },
  {
    CC_SHIFTPATTERN: `${projectPath}/data/cc_shiftpattern.properties`, //1
  },
  {
    DOCUMENTS: `${projectPath}/data/documents.properties`, //2
  },
  {
    HR_EMPLOYEE: `${projectPath}/data/hr_employee.properties`, //3
  },
  {
    PD_PRODUCT: `${projectPath}/data/pd_product.properties`, //4
  },
  {
    WR_WORKCENTRE_WORKSTATION: `${projectPath}/data/wr_workcentre_workstation.properties`, //5
  },
  {
    WR_WORKCENTRE: `${projectPath}/data/wr_workcentre.properties`, //6
  },
  {
    PD_PRODUCT_WORKSTATIONROUTE_STATUS: `${projectPath}/ppc/pd_product_workstationroute_status.properties`, //7
  },
  {
    DATABASE_CURRENT_TIME: `${projectPath}/common/database_current_time.properties`, //8
  },
  {
    QUALITY_DEPT_REJECTED_REASONS: `${projectPath}/ppc/quality_dept_rejected_reasons.properties`, //9
  },
  {
    PD_PRODUCT_PRODUCTION_SHORT_QUANTITY_STATUS: `${projectPath}/ppc/pd_product_production_short_qty_status.properties`, //10
  },
  {
    VW_CA_ACCOUNT_SUPPLIER: `${projectPath}/data/vw_ac_account_supplier.properties`, //11
  },
  {
    CM_CITY: `${projectPath}/data/cm_city.properties`, //12
  },
  {
    CM_STATE: `${projectPath}/data/cm_state.properties`, //13
  },
  {
    COMMON: `${projectPath}/common/common.properties`, //14
  },
  {
    ACL_USER_PROGRAM: `${projectPath}/data/acl_user_program.properties`, //15
  },
  {
    ALL_ACL: `${projectPath}/common/all_acl.properties`, //16
  },
  {
    CAPACITY_PLAN: `${projectPath}/ppc/capacity_plan.properties`, //17
  },
  {
    OUTSOURCE: `${projectPath}/ppc/outsource.properties`, //18
  },
  {
    ATTENDANCE: `${projectPath}/ppc/attendance_employee.properties`, //19
  },
  {
    CC_PROCESS_ASSEMBLYSHOP: `${projectPath}/ppc/cc_process_assemblyshop.properties`, //20
  },
  {
    AS_WORKSTATION_STATUS: `${projectPath}/ppc/as_workstation_status.properties`, //21
  },
  {
    PD_PRODUCT_PRODUCTROUTE: `${projectPath}/data/pd_product_productroute.properties`, //22
  },
  {
    CC_SS_CUSTOMER_POS: `${projectPath}/data/vw_ss_customer_pos.properties`, // 23
  },
  {
    PD_PRODUCT_PRODUCTBILLOFMATERIAL: `${projectPath}/data/pd_product_productbillofmaterial.properties`, // 24
  },
  {
    PD_PRODUCT_PRODUCTPROCESSROUTE: `${projectPath}/data/pd_product_productprocessroute.properties`, //25
  },
  {
    PD_PRODUCT_FOLDER: `${projectPath}/data/pd_product_folder.properties`, // 26
  },
  {
    AS_PD_PRODUCT_STOCK: `${projectPath}/ppc/as_pd_product_stock.properties`, //27
  },
  {
    OPERATOR_SCREEN: `${projectPath}/ppc/operator_screen.properties`, //28
  },
  {
    PRODUCT_AND_PROCESS_PROUTE: `${projectPath}/ppc/product_and_process_route.properties`, // 29
  },
  {
    PD_PRODUCT_PRODUCTROUTE_LAST: `${projectPath}/ppc/pd_product_productroute_last.properties`, // 30
  },
  {
    CC_PROCESS: `${projectPath}/data/cc_process.properties`, // 31
  },
  {
    AT_GENERALLEDGER: `${projectPath}/data/at_generalledger.properties`, //32
  },
  {
    AT_OUTWARDSUPPLY: `${projectPath}/data/at_outwardsupply.properties`, //33
  },
  {
    CC_ONLINEPAYMENTSTATUS: `${projectPath}/data/cc_onlinepaymentstatus.properties`, //34
  },
  {
    EVENT: `${projectPath}/message/event.properties`, //35
  },
  {
    SUBSCRIBER: `${projectPath}/message/subscriber.properties`, //36
  },
  {
    EVENT_SUBSCRIBER: `${projectPath}/message/eventsubscriber.properties`, //37
  },
  {
    AC_ACCOUNT: `${projectPath}/data/ac_account.properties`, //38
  },
  {
    AS_PD_PRODUCT_STRUCTURE: `${projectPath}/assembly/as_pd_product_structure.properties`, //39
  },
  {
    AS_PD_PRODUCT: `${projectPath}/assembly/as_pd_product.properties`, //40
  },
  {
    AS_PRODUCTTYPE: `${projectPath}/assembly/as_producttype.properties`, //41
  },
  {
    PD_PRODUCT_PRODUCTSTOCK: `${projectPath}/ppc/pd_product_productstock.properties`, //42
  },
  {
    CC_INSTRUMENTTYPE: `${projectPath}/data/cc_instrumenttype.properties`, // 43
  },
  {
    PD_PRODUCT_MEASURINGINSTRUMENT: `${projectPath}/ppc/pd_product_measuringinstrument.properties`, // 44
  },
  {
    PD_PRODUCT_INSTRUMENTCALIBRATIONSCHEDULE: `${projectPath}/ppc/pd_product_instrumentcalibrationschedule.properties`, // 45
  },
  {
    CC_CALIBRATIONFREQUENCY: `${projectPath}/ppc/cc_calibrationfrequency.properties`, // 46
  },
  {
    ADMIN_DASHBOARD: `${projectPath}/ppc/admin_dashboard.properties` //47
  },
  {
    PD_PRODUCT_INSTRUMENTCALIBRATION_HISTORY: `${projectPath}/ppc/pd_product_instrumentcalibration_history.properties` // 48
  },
  {
    MAIL_HISTORY: `${projectPath}/ppc/mail_history.properties` // 49
  },
  {
    AS_PD_PRODUCT_STRUCTUREHISTORY: `${projectPath}/assembly/as_pd_product_structurehistory.properties` // 50
  },
  {
    AS_PD_PRODUCT_STOCK: `${projectPath}/assembly/as_pd_product_stock.properties` // 51
  },
  {
    AS_PD_PRODUCT_STOCKHISTORY: `${projectPath}/assembly/as_pd_product_stockhistory.properties` // 52
  },
  {
    TABLET_LOGIN_LOGS: `${projectPath}/ppc/tablet_login_logs.properties` // 53
  },
  {
    PD_PRODUCT_INSTRUMENTORDERS: `${projectPath}/ppc/pd_product_instrumentorders.properties` // 54
  },
  {
    AS_PD_PRODUCT_SALESORDERS: `${projectPath}/assembly/as_pd_product_salesorders.properties` // 55
  },
  {
    AS_PD_PRODUCT_SALESORDERDETAILS: `${projectPath}/assembly/as_pd_product_salesorderdetails.properties` // 56
  },
  {
    PRODUCTION_LOG: `${projectPath}/ppc/production_log.properties` // 57
  },
  {
    IND4_WORKSTATION_TAGID: `${projectPath}/ppc/ind4_workstation_tagid.properties` // 58
  },
  {
    CC_INSTRUMENTMANUFACTURER: `${projectPath}/ppc/cc_instrumentmanufacturer.properties` // 59
  },
  {
    AS_PD_PRODUCT_RESERVEORDER: `${projectPath}/assembly/as_pd_product_reserveorder.properties` // 60
  },
  {
    AS_PD_PRODUCT_PRODUCTROUTE: `${projectPath}/assembly/as_pd_product_productroute.properties` // 61  
  },
  {
    AS_PRODUCTION_SCHEDULE: `${projectPath}/assembly/as_production_schedule.properties` // 62
  },
  {
    AS_PRODUCTION_STATUS: `${projectPath}/assembly/as_production_status.properties` // 63 
  },
  {
    CC_CALENDAR: `${projectPath}/data/cc_calendar.properties` // 64
  },
  {
    PD_PRODUCT_STRUCTURE: `${projectPath}/ppc/pd_product_structure.properties` // 65 
  },
  {
    SS_SALESORDER: `${projectPath}/data/ss_salesorder.properties` // 66  
  },
  {
    PD_PRODUCT_BILLOFMATERIALOFASSEMBLY: `${projectPath}/ppc/pd_product_billofmaterialofassembly.properties` // 67 
  },
  {
    MANAGE_INVENTORY: `${projectPath}/ppc/manage_inventory.properties` // 68 
  }

];

queryPath.forEach((paths) => {
  return paths;
});

module.exports = {
  queryPath,
};
