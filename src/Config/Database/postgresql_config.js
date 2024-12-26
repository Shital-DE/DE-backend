// Author : Shital Gayakwad
// Created Date : 30 Dec 2022
// Description : ERPX_PPC -> Postgresql Connection file

// Postgresql Connection
const { Client } = require('pg');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { NETWORK_ERROR_ON_SERVERSIDE } = require('../../Utils/Constants/errorCodes');
const dbConnect = new Client({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

dbConnect.connect(
    (error) => {
        if (error) {
            new AppError(NETWORK_ERROR_ON_SERVERSIDE, 'Network problem occur on server side', 503);
        } else {

        }
    }
);

module.exports = dbConnect;