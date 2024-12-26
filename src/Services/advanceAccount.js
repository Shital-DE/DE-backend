const connection = require("../Config/Database/postgresdb_config");

const getAdvAccountData = async function attendance(
  accountId,
  accountScheduleid
) {
  let newAccountId;
  try {
    (async () => {
      const conn = await connection.pool.connect();
      let query = `INSERT INTO data.ac_account (id, name1, shortname, accountschedule_id, currency, issystemowned, company_id, 
								        erp3accountid, name, isforeigncompany, accountserialnumber)
	                  SELECT uuid_generate(), name1, trim(shortname) || '-Adv', $1, currency, issystemowned, company_id, 
		                    erp3accountid, trim(name) || ' (Advance)', isforeigncompany, accountserialnumber
	                  FROM data.ac_account
	                  WHERE id = $2
                    RETURNING id`;
      // console.log("Inserted into data.ac_account");
      conn.query(
        query,
        [accountScheduleid, accountId],
        async (error, result) => {
          if (error) {
            throw error;
          }
          newAccountId = result.rows[0].id;
          // console.log("New Account ID:", newAccountId);

          let query1 = `INSERT INTO data.ac_account_advanceaccount (id, account_id, advanceaccount_id, createdby)
                SELECT uuid_generate(), $1 ,$2, 'erp' RETURNING id`;
          // console.log("Inserted into data.ac_account_advanceaccount");

          // conn.release();
          let query2 = `INSERT INTO data.ac_account_address (id, address1, address2, pin, contactperson, ac_account_id, address_order, city_id)
		                SELECT uuid_generate(), address1, address2, pin, contactperson, $1 , address_order, city_id
		                FROM data.ac_account_address
          WHERE ac_account_id = $2 RETURNING id`;
          // console.log("Inserted into data.ac_account_address");

          let query3 = `INSERT INTO data.ac_account_bankdetail (id, ac_account_id, bankname, bankaddress, bankaccountnumber, bankifsccode, bankdetail_order)
                    SELECT uuid_generate(), $1, bankname, bankaddress, bankaccountnumber, bankifsccode, bankdetail_order
                    FROM data.ac_account_bankdetail
          WHERE ac_account_id = $2 RETURNING id`;
          // console.log("Inserted into data.ac_account_bankdetail");

          let query4 = `INSERT INTO data.ac_account_paymentmilestone (id, ac_account_id, srno, paymentmilestone_id, paymentinstallmentformat, percentage, amount, remark, paymentmilestonecode, paymentmilestone_order)
                    SELECT uuid_generate(), $1, srno, paymentmilestone_id, paymentinstallmentformat, percentage, amount, remark, paymentmilestonecode, paymentmilestone_order
                    FROM data.ac_account_paymentmilestone
            WHERE ac_account_id = $2 RETURNING id`;
          // console.log("Inserted into data.ac_account_paymentmilestone");

          let query5 = `INSERT INTO data.ac_account_taxinfo(id, ac_account_id, eccnumber, planumber, pannumber, cstnumber, vatnumber, stnumber,
         					        rdurd, defaulttdscategory_id, taxinfo_order, gstin, gstcategory, packingforwardingrate, isanagency, issubcontractor)
                    SELECT uuid_generate(), $1, eccnumber, planumber, pannumber, cstnumber, vatnumber, stnumber, rdurd, defaulttdscategory_id,
         			            taxinfo_order, gstin, gstcategory, packingforwardingrate, isanagency, issubcontractor
                    FROM data.ac_account_taxinfo
            WHERE ac_account_id = $2 RETURNING id`;
          // console.log("Inserted into data.ac_account_taxinfo");

          let query6 = `INSERT INTO data.ac_account_tdscategoryapplicable(id,tdscategory_id, ac_account_id, tdscategoryapplicable_order)
                SELECT uuid_generate(), tdscategory_id, $1, tdscategoryapplicable_order
                FROM data.ac_account_tdscategoryapplicable
           WHERE ac_account_id = $2 RETURNING id`;
          // console.log("Inserted into data.ac_account_tdscategoryapplicable");

          try {
            await conn.query(`BEGIN`);
            await conn.query(query1, [newAccountId, accountId]);
            await conn.query(query2, [newAccountId, accountId]);
            await conn.query(query3, [newAccountId, accountId]);
            await conn.query(query4, [newAccountId, accountId]);
            await conn.query(query5, [newAccountId, accountId]);
            await conn.query(query6, [accountId, newAccountId]);

            //console.log("DONE");
            await conn.query(`COMMIT`);
            // console.log("Commited");
          } catch (e) {
            await conn.query(`ROLLBACK`);
            throw e;
          } finally {
            conn.release();
          }
        }
      );
    })().catch(console.error);
  } catch (e) {
    // console.log(e);
  }
};
module.exports = { getAdvAccountData };
/*
async function advAccount(accountId, advAccountScheduleId) {
  const newAccountId = NULL;
  console.log(
    "++++++++++++++++" + accountId,
    advAccountScheduleId + "+++++++++++++"
  );

  try {
    console.log("Try Block !!!!!");
  } catch (e) {
    throw e;
  }
} */
