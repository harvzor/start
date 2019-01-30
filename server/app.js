const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const logger = require('./logger.js');

var app = express();

app.use(compression());

app.locals.year = function() {
    return new Date().getUTCFullYear();
};

app.set('view engine', 'ejs');

app.use(expressLayouts)

module.exports = app;
