'use strict';

// Required dependencies:
// app, fs, express, config, logger, cheerio, backgrounds, request
var routing = function(dependencies) {
	for (let key in dependencies) {
		global[key] = dependencies[key];
	}

	// Render index.
	app.get('/', function(req, res) {
		res.render('index', {
			dev: config.dev,
			layout: 'common',
			relativeUrl: ''
		});
	});

	// Backgrounds API
	app.get('/background', function(req, res) {
		backgrounds.getDay(new Date(), function(data) {
			res.setHeader('Content-Type', 'application/json');

			if (typeof req.query.pretty !== 'undefined' && req.query.pretty.toLowerCase() === 'true') {
				res.send(JSON.stringify(data, null, 4));
			} else {
				res.send(JSON.stringify(data));
			}
		});
	});

	// Backgrounds API
	app.get('/api/background/get', function(req, res) {
		var date = new Date(req.query.date);

		backgrounds.getDay(date, function(file) {
			res.send(file);
		});
	});

	/////////////////
	// Statuses
	/////////////////
	app.use(express.static('./public'));

	if(global.dev == true) {
		app.use(express.static('./src'));
	}

	app.use(function(req, res, next) {
		logger.info('404 error: %s', req.originalUrl);

		res.status(404).render('error', {
			layout: 'common',
			relativeUrl: '404',
			pageTitle: 'Status: 404',
			bodyText: '<p>You\'re looking for a page that doesn\'t exist...</p>'
		});
	});

	app.use(function(err, req, res, next) {
		logger.error('500 error: %s', err.stack);

		res.status(500).render('error', {
			layout: 'common',
			relativeUrl: '500',
			pageTitle: 'Status: 500',
			bodyText: '<p>So sorry, but a problem occured! Please email me if this problem persists.</p>'
		});
	});
};

module.exports = routing;

