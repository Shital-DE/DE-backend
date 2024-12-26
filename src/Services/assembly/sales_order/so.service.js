// Author : Shital Gayakwad
// Created Date : 9 Feb 2024
// Description : Assembly purchase orders service

const { NOT_FOUND } = require("../../../Utils/Constants/errorCodes");
const { queryPath } = require("../../../Utils/Constants/query.path");
const AppError = require("../../../Utils/ErrorHandling/appErrors");
const { executeSelectQuery, insertQuery } = require("../../../Utils/file_read");
const properties = require("properties");
const { parse, format, isValid, getDate, getMonth, getYear } = require('date-fns');
const ExcelJS = require('exceljs');


// Register po if not available in purchase order
function poRegister(userId, item) {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[55].AS_PD_PRODUCT_SALESORDERS,
            { path: true },
            function (error, data) {
                if (error) {
                    reject(new AppError(NOT_FOUND, error, 404));
                } else {
                    var query = data.insertQuery.replace(/\n/g, " ");
                    query = query.replace(/{createdby}/g, userId.trim());
                    query = query.replace(/{referencedocumentnumber}/g, item[1].trim());
                    executeSelectQuery(query)
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((e) => {
                            resolve(e);
                        });
                }
            }
        );
    });
}

// Search product by product code 
function searchProductByCode(item) {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[40].AS_PD_PRODUCT,
            { path: true },
            function (error, data) {
                if (error) {
                    reject(new AppError(NOT_FOUND, error, 404));
                }
                var query = data.searchProductByCode.replace(/\n/g, " ");
                query = query.replace(/{code}/g, item[3].trim());
                executeSelectQuery(query)
                    .then((productId) => {
                        resolve(productId);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            }
        );
    });
}

// Register order
function registerOrder({ userId, poid, productId, item }) {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[56].AS_PD_PRODUCT_SALESORDERDETAILS,
            { path: true },
            async function (error, data) {
                if (error) {
                    reject(new AppError(NOT_FOUND, error, 404));
                }
                var query = data.insertQuery.replace(/\n/g, " ");
                query = query.replace(/{createdby}/g, userId.trim());
                query = query.replace(/{po_id}/g, poid.trim());
                query = query.replace(/{linenumber}/g, item[2].trim());
                query = query.replace(/{product_id}/g, productId.trim());
                query = query.replace(/{quantity}/g, item[4].trim());
                const newDate = await convertToISOFormat(item[6].trim());
                query = query.replace(/{dispatchdate}/g, newDate);
                executeSelectQuery(query)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            }
        );
    });
}
function convertToISOFormat(dateString) {
    const formatsToTry = ["yyyy-MM-dd'T'HH:mm:ss.SSS", 'dd-MM-yyyy'];
    for (const formatToTry of formatsToTry) {
        try {
            const parsedDate = parse(dateString, formatToTry, new Date());
            if (isValid(parsedDate)) {
                if (isValidDate(parsedDate)) {
                    return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS");
                }
            }
        } catch (error) {
           
        }
    }
    throw new Error('Invalid date format: ' + dateString);
}

function isValidDate(date) {
    const day = getDate(date);
    const month = getMonth(date) + 1;
    const year = getYear(date);
    return day <= daysInMonth(month, year);
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Create excel sheet
async function createExcelSheet({ orderdata, data, filename }) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(filename);

    // Add empty row
    worksheet.addRow();

    // Order table header text
    const orderTableText = worksheet.addRow(['Selected products in order :']);
    orderTableText.eachCell(cell => {
        cell.font = { bold: true };
    });

    // Add empty row
    worksheet.addRow();

    // Add Order table header
    const orderTableheaderRow = worksheet.addRow(['PO', 'Product', 'Revision', 'Description', 'Line number', 'Quantity', 'Dispatch date']);
    orderTableheaderRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '90EE90' }
        };
        cell.font = { bold: true };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    });


    // Order table 
    orderdata.forEach(item => {
        const values = Object.values(item);
        const modifiedValues = values.filter((_, index) => index !== 7 && index !== 8 && index !== 9);

        const row = worksheet.addRow(modifiedValues);
        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        });
    });

    // Add empty row
    worksheet.addRow();

    // Stock check header
    const tobeProduceQtyTableText = worksheet.addRow(['Essential products for order completion :']);
    tobeProduceQtyTableText.eachCell(cell => {
        cell.font = { bold: true };
    });

    // Add empty row
    worksheet.addRow();

    // Stock check table header
    const headerRow = worksheet.addRow(data.header);
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '90CAF9' }
        };
        cell.font = { bold: true };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    });

    // Stock check table data
    let prevValue = null;
    let startMergeIndex = null;

    data.data.forEach(item => {
        const values = Object.values(item);

        const modifiedValues = values.filter((_, index) => index !== 6 && index !== 13 && index !== 14 && index !== 15 && index !== 16 && index !== 17 && index !== 18 && index !== 19 && index !== 20);

        for (let i = 0; i < modifiedValues[3].length; i++) {
            const row = worksheet.addRow([
                modifiedValues[0],
                modifiedValues[1],
                modifiedValues[2],
                modifiedValues[3][i],
                modifiedValues[4][i],
                modifiedValues[5][i] == 0.0 ? 0 : modifiedValues[5][i],
                modifiedValues[6] == 0.0 ? 0 : modifiedValues[6],
                modifiedValues[7][i] == 0.0 ? 0 : modifiedValues[7][i],
                modifiedValues[8][i] == 0.0 ? 0 : modifiedValues[8][i],
                modifiedValues[9][i] == 0.0 ? 0 : modifiedValues[9][i],
                modifiedValues[10] == 0.0 ? 0 : modifiedValues[10],
                modifiedValues[11]]);
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
            });
            const cellA = row.getCell(1);
            if (cellA.value === prevValue) {
                if (startMergeIndex === null) {
                    startMergeIndex = row.number - 1;
                }
            } else {
                if (startMergeIndex !== null) {
                    if (row.number - startMergeIndex > 1) {
                        worksheet.mergeCells(`A${startMergeIndex}:${'A' + (row.number - 1)}`);
                        worksheet.mergeCells(`B${startMergeIndex}:${'B' + (row.number - 1)}`);
                        worksheet.mergeCells(`C${startMergeIndex}:${'C' + (row.number - 1)}`);
                        worksheet.mergeCells(`G${startMergeIndex}:${'G' + (row.number - 1)}`);
                        worksheet.mergeCells(`J${startMergeIndex}:${'J' + (row.number - 1)}`);
                    }
                    startMergeIndex = null;
                }
                prevValue = cellA.value;
            }
        }
    });

    // Column width 
    worksheet.columns.forEach((column, index) => {
        column.width = 20;
    });

    // Row height 
    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
            row.height = 20;
        }
    });

    // Both table header height
    worksheet.getRow(orderTableheaderRow.number).height = 30;
    worksheet.getRow(headerRow.number).height = 45;

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

// Reserved orders in detail to send on mail
async function reservedOrderToSendMail() {
    return new Promise((resolve, reject) => {
        properties.parse(
            queryPath[60].AS_PD_PRODUCT_RESERVEORDER,
            { path: true },
            async function (error, data) {
                if (error) {
                    reject({
                        'status code': 404,
                        'error': error
                    });
                }

                executeSelectQuery(data.reservedOrder).then((result) => {
                    if (result.length != 0) {
                        resolve(result);
                    }
                }).catch((e) => {
                    reject({
                        'status code': 404,
                        'error': e
                    });
                });
            }
        );
    });
}

module.exports = {
    poRegister,
    searchProductByCode,
    registerOrder,
    createExcelSheet,
    reservedOrderToSendMail
}
