var routing = function(app, fs, express, config, logger, wordnik, http, cheerio, backgrounds, request) {
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
		backgrounds(request, cheerio, fs).getDay(new Date(), function(file) {
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

