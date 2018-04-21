var StartApp = angular.module('StartApp', []);

StartApp.controller('LinksController', ['$scope', function($scope) {
	$scope.links = [
		[
			{
				name: 'Localhost',
				url: 'http://localhost:3000'
			}
		],
		[
			{
				name: 'Google',
				url: 'https://www.google.co.uk'
			},
			{
				name: 'Duck Duck Go',
				url: 'https://start.duckduckgo.com'
			},
			{
				name: 'Maps',
				url: 'https://google.co.uk/maps'
			}
		],
		[
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
		],
		[
			{
				name: 'YouTube',
				url: 'https://www.youtube.com'
			},
			{
				name: 'Spotify',
				url: 'https://open.spotify.com'
			},
			/*
				{
					name: 'Plex',
					url: 'https://bigkthx.com/web/index.html'
				},
			*/
		],
		[
			{
				name: 'Amazon',
				url: 'https://www.amazon.co.uk'
			},
			{
				name: 'AlternativeTo',
				url: 'https://alternativeto.net'
			},
			{
				name: 'Toggl',
				url: 'https://www.toggl.com/app/timer'
			}
		],
		[
			{
				name: 'CoinLib',
				url: 'https://coinlib.io'
			},
			{
				name: 'Coin Market Cap',
				url: 'https://coinmarketcap.com'
			},
			{
				name: 'EthTrader',
				url: 'https://www.reddit.com/r/ethtrader/'
			},
		]
	];
}]);

StartApp.controller('Body', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/background'
	}).then(function successCallback(response) {
		//$scope.backgroundUrl = '/media/backgrounds/' + response.data.date + '.jpg';
		$scope.backgroundUrl = response.data.data[0].attributes.image.uri;
	});
}]);

StartApp.controller('WordController', ['$scope', '$http', function($scope, $http) {
	var dayOffset = 0;

	$scope.isNextWord = false;
	$scope.data = {
		word: '',
		definition: ''
	};

	var getWord = function(dayOffset, callback) {
		var date = new Date();
		date.setDate(date.getDate() + dayOffset);

		var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

		$http({
			method: 'GET',
			url: '//api.wordnik.com/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5&date=' + dateString
		}).then(function successCallback(response) {
			$scope.data = {
				word: response.data.word,
				definition: response.data.definitions[0].text
			};

			callback();
		});
	};

	$scope.prevWord = function() {
		getWord(dayOffset, function() {
			dayOffset--;

			$scope.isNextWord = true;
		});
	};

	$scope.nextWord = function() {
		getWord(dayOffset, function() {

			dayOffset++;

			if (dayOffset == 0) {
				$scope.isNextWord = false;
			}
		});
	};

	getWord(0);
}]);

StartApp.controller('AboutImageController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
	$http({
		method: 'GET',
		url: '/background'
	}).then(function successCallback(response) {
		var data = response.data.data[0].attributes.image;

		$scope.data = {
			title: data.title,
			description: $sce.trustAsHtml(data.caption)
		};
	});
}]);
