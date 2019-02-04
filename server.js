const config = require('./server/config.json');

// Allows config to be used in .ejs files too.
global.config = config;

// Custom modules
//const wordnik = require('./server/wordnik.js');
//const helpers = require('./server/helpers.js');
const logger = require('./server/logger.js');
const app = require('./server/app.js');
require('./server/routing.js');

/////////////////
// Functions
/////////////////

Array.prototype.filterObjects = function(key, value) {
    return this.filter(function(x) { return x[key] === value; })
};

/////////////////
// Inititialise
/////////////////

if (config.type === 'node') {
    // Used for Node server.
    var server = app.listen(config.port, config.ip, function () {
        var host = server.address().address;
        var port = server.address().port;

        logger.info('Website listening at http://%s:%s.', host, port);
    });
} else if (config.type === 'iis') {
    // Used for IISNode.
    app.listen(process.env.PORT);
} else {
    logger.error('Error: wrong config.type set');
}
