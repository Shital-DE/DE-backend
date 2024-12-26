// Author : Shital Gayakwad
// Created Date : 16 Feb 2023
// Description : ERPX_PPC -> Error Handling

exports.tryCatch = (controller) => async (req, resp, next) => {
    try {
        await controller(req, resp);
    } catch (error) {
        return next(error);
    }
}