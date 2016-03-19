'use strict';

// Required dependencies:
// request, cheerio, fs, helpers, logger
var backgrounds = function(dependencies) {
	for (let key in dependencies) {
		global[key] = dependencies[key];
	}

	var publicBackgroundsPath = '/media/backgrounds/';
	var backgroundsPath = 'public' + publicBackgroundsPath;

	var backgroundData = function() { 
		var data = {
			url: '',
			date: '',
			name: '',
			credit: '',
			description: ''
		};

		return {
			set: function(key, value) {
				if (typeof data[key] != 'undefined') {
					data[key] = value;
				}
			},
			get: function(key) {
				return data[key];
			},
			getAll: function() {
				return data;
			}
		};
	};

	// Scrapes National Geographic for their background today.
	var scrapeForImageData = function(callback) {
		request({
			method: 'GET',
			url: 'http://photography.nationalgeographic.com/photography/photo-of-the-day/'
		}, function(err, response, html) {
			var data = new backgroundData();
			var $;

			if (err) {
				logger.info('[backgrounds]', err);

				return;
			}

			$ = cheerio.load(html);

			data.set('url', 'http:' + $('.primary_photo img').attr('src'));
			data.set('date', helpers.dateToString(new Date()));
			data.set('name', $('h1').text());
			data.set('credit', $('#caption .credit').text());
			data.set('description', $('#caption .credit').next().text());

			callback(data);
		});
	};

	var saveImage = function(url, filePath, callback) {
		request(url).pipe(fs.createWriteStream(filePath)).on('close', callback);
	};

	var jsonFileDataConstructor = function() {
		var dataPath = 'data/backgrounds.json';
		var data = null;

		return {
			get: function(loadNew) {
				if (loadNew || data == null) {
					return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
				}

				return data;
			},
			set: function(newData) {
				var data = this.get();

				data.push(newData);

				fs.writeFile(dataPath, JSON.stringify(data), function(err) {
					if (err) {
						logger.info('[backgrounds] Error writing to backgrounds.json');
					}
				});
			}
		};
	};
	
	var jsonFileData = new jsonFileDataConstructor();

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
				scrapeForImageData(function(data) {
					saveImage(data.get('url'), backgroundsPath + dateString + '.jpg', function() {
						callback(publicBackgroundsPath + dateString + '.jpg');
					});

					jsonFileData.set(data.getAll());
				});
			} else {
				logger.info('[backgrounds]', 'No background found for date: ' + dateString);
			}
		}
	};
};

module.exports = backgrounds;
