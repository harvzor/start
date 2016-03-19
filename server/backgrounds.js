'use strict';

// Required dependencies:
// request, cheerio, fs, helpers, logger
var backgrounds = function(dependencies) {
	for (let key in dependencies) {
		global[key] = dependencies[key];
	}

	var publicBackgroundsPath = '/media/backgrounds/';
	var backgroundsPath = 'public' + publicBackgroundsPath;

	// Scrapes National Geographic for their background today.
	var scrapeForImageUrl = function(callback) {
		request({
			method: 'GET',
			url: 'http://photography.nationalgeographic.com/photography/photo-of-the-day/'
		}, function(err, response, html) {
			var $;

			if (err) {
				logger.info('[backgrounds]', err);

				return;
			}

			$ = cheerio.load(html);

			$('.primary_photo img').filter(function() {
				callback('http:' + $(this).attr('src'));
			});
		});
	};

	var saveImage = function(url, filePath, callback) {
		request(url).pipe(fs.createWriteStream(filePath)).on('close', callback);
	};

	return {
		// Gets a background from the file system.
		// date is optional
		getDay: function(date, callback) {
			var dateString = '';

			if (typeof date === 'undefined') {
				date = new Date();
			}

			dateString = helpers.dateToString(date);

			if (fs.existsSync(backgroundsPath + dateString + '.jpg')) {
				callback(publicBackgroundsPath + dateString + '.jpg');
			}
			// If the file requested is for todays image of the day
			else if (dateString == helpers.dateToString(new Date())) {

				scrapeForImageUrl(function(url) {
					saveImage(url, backgroundsPath + dateString + '.jpg', function() {
						callback(publicBackgroundsPath + dateString + '.jpg');
					});
				});
			} else {
				logger.info('[backgrounds]', 'No background found for date: ' + dateString);
			}
		}
	};
};

module.exports = backgrounds;
