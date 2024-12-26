const express = require('express');
const connectionrouter = express.Router();
let ipaddress = ['192.168.0.141', '192.168.0.141'];

connectionrouter.get('', async (req, res) => {
    try {
        for (var i = 0; i <= ipaddress.length; i++) {

        }
    } catch (e) {

    }
});

module.exports = connectionrouter;