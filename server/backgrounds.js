'use strict';

// Required dependencies:
// config = {
//     dataPath: '', // The path to the file where image information should be stored.
//     publicBackgroundsPath: '', // The external URL to the file.
//     backgroundsPath: '' // The internal path to the file.
// }
var backgrounds = function(config) {
	// Dependencies.
	var fs = require('fs');
	var cheerio = require('cheerio');
	var request = require('request');

	var dateToString = function(date) {
		var month = date.getMonth() + 1;

		if (month < 10) {
			month = '0' + month;
		}

		return date.getFullYear() + '-' + month + '-' + date.getDate();
	};

	// A model that can be stored in the JSON file.
	var backgroundModel = function() { 
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
	var scrapeForImageData = function(callback, url) {
		// If the url is undefined, set it as the image of the day.
		if (typeof url == 'undefined') {
			url = 'http://photography.nationalgeographic.com/photography/photo-of-the-day/';
		}

		request({
			method: 'GET',
			url: url
		}, function(err, response, html) {
			var data = new backgroundModel();
			var $;

			if (err) {
				logger.info('[backgrounds]', err);

				return;
			}

			$ = cheerio.load(html);

			data.set('url', 'http:' + $('.primary_photo img').attr('src'));
			data.set('date', dateToString(new Date($('.publication_time').eq(0).text())));
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
		var data = null;

		return {
			get: function(loadNew) {
				if (loadNew || data == null) {
					return JSON.parse(fs.readFileSync(config.dataPath, 'utf8'));
				}

				return data;
			},
			set: function(newData) {
				var data = this.get();

				data.push(newData);

				fs.writeFile(config.dataPath, JSON.stringify(data), function(err) {
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
			var lastData = jsonFileData.get()[jsonFileData.get().length > 0 ? jsonFileData.get().length - 1 : 0];

			if (typeof date === 'undefined') {
				date = new Date();
			}

			dateString = dateToString(date);

			if (lastData.date == dateString) {
				callback(lastData);
			}
			// If the file requested is for todays image of the day
			else if (dateString == dateToString(new Date())) {
				scrapeForImageData(function(data) {

					// If there is data in the JSON.
					if (jsonFileData.get().length > 0) {

						// If a new image hasn't been uploaded yet, just return the last image.
						if (data.get('name') == lastData.name) {
							callback(config.publicBackgroundsPath + lastData.date + '.jpg');

							return;
						}
					}

					saveImage(data.get('url'), config.backgroundsPath + dateString + '.jpg', function() {
						callback(data.getAll());
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
