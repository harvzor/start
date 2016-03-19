'use strict';

var backgrounds = function(request, cheerio, fs) {
	var backgroundsFolderPath = 'public/media/backgrounds/';

	// Returns a date in "yyyy-MM-dd" format.
	var dateToString = function(date) {
		var month = date.getMonth() + 1;

		if (month < 10) {
			month = '0' + month;
		}

		return date.getFullYear() + '-' + month + '-' + date.getDate();
	};

	// Scrapes National Geographic for their background today.
	var scrapeForImage = function(dateString, callback) {
		var getHtml = function(callback) {
			request({
				url: 'http://photography.nationalgeographic.com/photography/photo-of-the-day/',
				method: 'GET'
			}, function(err, response, body) {
				if (err) {
					console.log(err);

					return;
				}

				callback(body);
			});
		};

		var saveImage = function(url, fileName, callback) {
			request.head(url, function(err, res, body){
				request(url).pipe(fs.createWriteStream(fileName)).on('close', callback);
			});
		};

		getHtml(function(html) {
			var $ = cheerio.load(html);
			$('.primary_photo img').filter(function() {
				var $img = $(this);
				var src = $img.attr('src');

				fs.mkdirSync(backgroundsFolderPath + dateString);

				saveImage('http:' + src, backgroundsFolderPath + dateString + '/image.jpg', function() {
					callback();
				});
			});
		});
	};

	return {
		// Gets a background from the file system.
		// date is optional
		getDay: function(date, callback) {
			var dateString = '';

			if (typeof date === 'undefined') {
				date = new Date();
			}

			dateString = dateToString(date);

			fs.readdir(backgroundsFolderPath + dateString, function(err, files) {
				if (!err) {
					callback('/media/backgrounds/' + dateString + '/' + files[0]);
				} else if (dateString == dateToString(new Date())) {
					scrapeForImage(dateString, function() {
						fs.readdir(backgroundsFolderPath + dateString, function(err, files) {
							if (!err) {
								callback('/media/backgrounds/' +  dateString + '/' + files[0]);
							}
						});
					});
				} else {
					console.log('error');
				}
			});
		}
	};
};

module.exports = backgrounds;
