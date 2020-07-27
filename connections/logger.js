const log4js = require('log4js');
require('dotenv').config();
log4js.configure({
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS %p %c %m',
      }
    },
    file: {
      type: 'file',
      filename: 'project.log',
      maxLogSize: 10485760,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug',
    },
  }
});
module.exports = log4js.getLogger();
