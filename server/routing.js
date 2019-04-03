const express = require('express');
const request = require('request');

const app =  require('./app.js');
const backgrounds = require('./backgrounds.js');
const logger = require('./logger.js');
const config = require('./config.json');
const css = require('./css.js');
const fs = require('fs');

// Required dependencies:
// app, express, config, logger
const routing = function(dependencies) {
    for (let key in dependencies) {
        global[key] = dependencies[key];
    }

    // Render index.
    app.get('/', function(req, res) {
        css.getCss()
            .then(css => {
                res.render('index', {
                    layout: 'common',
                    relativeUrl: '',
                    css: css
                });
            });
    });

    // Backgrounds API
    app.get('/background', async(req, res) => {
        if (req.query.width) {
            let imageUri = await backgrounds.getBackgroundUri(req.query.date, req.query.width);

            req
                .pipe(request(imageUri))
                .pipe(res);
        } else {
            res.setHeader('Content-Type', 'application/json');

            backgrounds.getBackground(req.query.date)
                .then(data => {
                    res.send(data);
                });
        }
    });

    // Links api
    app.get('/links', async(req, res) => {
        let ipGroups = await JSON.parse(fs.readFile('links.json'));
        let links = [];

        for (let ipGroup of ipGroups) {
            if (ipGroup.ip === "any" || req.connection.remoteAddress === ipGroup.ip) {
                links.concat(ipGroup.linkGroups);
            }
        }

        res.send(links);
    });

    /////////////////
    // Statuses
    /////////////////
    app.use(express.static('./public'));

    if(global.config.dev == true) {
        app.use(express.static('./src'));
    }

    app.use(function(req, res, next) {
        logger.info('404 error: %s', req.originalUrl);

        getCssAsync()
            .then((css) => {
                res.status(404).render('error', {
                    layout: 'common',
                    relativeUrl: '404',
                    pageTitle: 'Status: 404',
                    bodyText: '<p>You\'re looking for a page that doesn\'t exist...</p>',
                    css: css
                });
            });

    });

    app.use(function(err, req, res, next) {
        logger.error('500 error: %s', err.stack);

        css.getCss()
            .then(css => {
                res.status(500).render('error', {
                    layout: 'common',
                    relativeUrl: '500',
                    pageTitle: 'Status: 500',
                    bodyText: '<p>So sorry, but a problem occured! Please email me if this problem persists.</p>',
                    css: css
                });
            });
    });
}();

module.exports = routing;
