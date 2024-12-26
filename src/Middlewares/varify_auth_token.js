// Author : Shital Gayakwad
// Created Date : 16 Feb 2023
// Description : ERPX_PPC -> Authorize Token
//Authorization Token
function varifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    varifyToken
}