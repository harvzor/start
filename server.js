const config = require('./server/config.json');

global.dev = config.dev;

/////////////////
// Start website
/////////////////

// Node modules
const express = require('express');
const compression = require('compression');
const expressLayouts = require('express-ejs-layouts');

// Custom modules
//const wordnik = require('./server/wordnik.js');
//const helpers = require('./server/helpers.js');
const logger = require('./server/logger.js');

var app = express();
app.use(compression());

/////////////////
// Functions
/////////////////
Array.prototype.filterObjects = function(key, value) {
    return this.filter(function(x) { return x[key] === value; })
}

app.locals.year = function() {
    return new Date().getUTCFullYear();
}

/////////////////
// Templating
/////////////////
app.set('view engine', 'ejs');

app.use(expressLayouts)

require('./server/routing.js')({
    'app': app,
    'express': express
});

/////////////////
// Inititialise
/////////////////

if (config.type == 'node') {
    // Used for Node server.
    var server = app.listen(config.port, config.ip, function () {
        var host = server.address().address;
        var port = server.address().port;

        logger.info('Website listening at http://%s:%s.', host, port);
    });
} else if(config.type == 'iis') {
    // Used for IISNode.
    app.listen(process.env.PORT);
} else {
    logger.error('Error: wrong config.type set');
}
