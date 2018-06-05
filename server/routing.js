'use strict';

// Required dependencies:
// app, fs, express, config, logger, cheerio, natgeo, request
var routing = function(dependencies) {
	for (let key in dependencies) {
		global[key] = dependencies[key];
	}

	let backgroundData = {};

	/**
	 * Get the background data, either from cache or from the NatGeo website.
	 * @param {string} date Date in ISO format.
	 */
	var getBackgroundAsync = (date) => {
		let promise = new Promise((resolve, reject) => {
			// Data already loaded.
			if (typeof backgroundData[date] !== 'undefined') {
				resolve(backgroundData[date]);

				return;
			}

			natgeo.getPhotoOfDay(date)
				.then((result) => {
					backgroundData[date] = result;

					resolve(result);
				});
		});

		return promise;
	};

	var getCssAsync = () => {
		let css = null;

		let promise = new Promise((resolve, reject) => {
			if (css != null) {
				resolve(css);

				return;
			}

			fs.readFile('./public/css/main.css', 'utf8', (err, data) => {
				if (err) {
					logger.error(err);

					reject(err);
				} else {
					css = data;

					resolve(css);

					//logger.info('Loaded css file...', css);
				}
			});
		});

		return promise;
	};

	// Render index.
	app.get('/', function(req, res) {
		getCssAsync()
			.then((css) => {
				res.render('index', {
					dev: config.dev,
					layout: 'common',
					relativeUrl: '',
					css: css
				});
			});
	});

	// Backgrounds API
	app.get('/background', (req, res) => {
		res.setHeader('Content-Type', 'application/json');

		getBackgroundAsync(req.query.date)
			.then((data) => {
				res.send(data);
			});

		/*
			backgrounds.getDay(new Date(), function(data) {
				res.setHeader('Content-Type', 'application/json');

				if (typeof req.query.pretty !== 'undefined' && req.query.pretty.toLowerCase() === 'true') {
					res.send(JSON.stringify(data, null, 4));
				} else {
					res.send(JSON.stringify(data));
				}
			});
		*/
	});

	/*
		// Backgrounds API
		app.get('/api/background/get', function(req, res) {
			var date = new Date(req.query.date);

			backgrounds.getDay(date, function(file) {
				res.send(file);
			});
		});
	*/

	/////////////////
	// Statuses
	/////////////////
	app.use(express.static('./public'));

	if(global.dev == true) {
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

		getCssAsync()
			.then((css) => {
				res.status(500).render('error', {
					layout: 'common',
					relativeUrl: '500',
					pageTitle: 'Status: 500',
					bodyText: '<p>So sorry, but a problem occured! Please email me if this problem persists.</p>',
					css: css
				});
			});
	});
};

module.exports = routing;
