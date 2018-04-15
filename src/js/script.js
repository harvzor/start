var StartApp = angular.module('StartApp', []);

StartApp.controller('LinksController', ['$scope', function($scope) {
	$scope.links = [
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
	];
}]);

StartApp.controller('Body', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/background'
	}).then(function successCallback(response) {
		$scope.backgroundUrl = '/media/backgrounds/' + response.data.date + '.jpg';
	});
}]);

StartApp.controller('WordController', ['$scope', '$http', function($scope, $http) {
	var dayOffset = 0;

	$scope.isNextWord = false;
	$scope.data = {
		word: '',
		definition: ''
	};

	var getWord = function(dayOffset) {
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
		});
	};


	$scope.prevWord = function() {
		dayOffset--;

		$scope.isNextWord = true;

		getWord(dayOffset);
	};

	$scope.nextWord = function() {
		dayOffset++;

		if (dayOffset == 0) {
			$scope.isNextWord = false;
		}

		getWord(dayOffset);
	};

	getWord(0);
}]);

StartApp.controller('AboutImageController', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/background'
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.data = response.data;
	});
}]);
