var winston = require('winston');
require('winston-daily-rotate-file');


var transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: process.env.CRONLOG_FILEPATH + '/erpx_app_info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50k',
  maxFiles: '7'
});


// transport.on('rotate', (filename) => {
//   console.log(filename);
// });

var logger = winston.createLogger({
  transports: [
    transport
  ]
});

module.exports = logger;
