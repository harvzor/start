var routing = function(app, fs, express, config, logger, wordnik, http) {
	app.get('/', function(req, res) {
		wordnik(http).getWordOfTheDay(function(word) {
			res.render('index', {
				dev: config.dev,
				layout: 'common',
				relativeUrl: '',
				links: [
					{
						name: 'Google',
						url: 'https://www.google.co.uk'
					},
					{
						name: 'Maps',
						url: 'https://google.co.uk/maps'
					},
					{
						name: 'Imgur',
						url: 'https://www.imgur.com'
					},
					{
						name: '4chan',
						url: 'https://www.4chan.org'
					},
					{
						name: 'Facebook',
						url: 'https://www.facebook.com'
					},
					{
						name: 'YouTube',
						url: 'https://www.youtube.com'
					},
					{
						name: 'Amazon',
						url: 'https://www.amazon.co.uk'
					},
					{
						name: 'AlternativeTo',
						url: 'https://alternativeto.net'
					}
				],
				word: word
			});
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

