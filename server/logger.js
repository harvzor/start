const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'portfolio',
    streams: [
        {
            level: 'info',
            path: 'logs/log.txt',
            stream: process.stdout
        },
        {
            level: 'warn',
            path: 'logs/log.txt',
            stream: process.stdout
        },
        {
            level: 'error',
            path: 'logs/log.txt',
            stream: process.stdout
        }
    ]
});

module.exports = logger;
