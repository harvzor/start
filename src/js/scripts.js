var StartApp = angular.module('StartApp', []);

var helpers = function() {
    var toDateIso = function(date) {
        return date.toISOString().substring(0, 10)
    };

    return {
        toDateIso: toDateIso
    };
}();

/**
 * Somewhat stolen from https://serviceworke.rs/offline-fallback_index_doc.html
 */
var serviceWorker = function() {
    var register = function() {
        if (navigator.serviceWorker.controller) {
            console.log(navigator.serviceWorker.controller.scriptURL + ' already registered');
        } else {
            // Seems the service worker needs to be available at the root.
            navigator.serviceWorker.register('/service-worker.js', {
                scope: './'
            }).then(function(reg) {
                console.log(reg.scope + ' registered');
                console.log('Service worker change, registered the service worker');
            });
        }
    };

    var unregister = function() {
        navigator.serviceWorker.getRegistration().then(reg => {
            reg.unregister();

            console.log('unregistered service worker:', reg);
        })
    };

    var deleteCaches = async function() {
        var cacheKeys = await caches.keys();

        cacheKeys.forEach(function(cacheKey) {
            caches.delete(cacheKey);
        });
    };

    return {
        register: register,
        unregister: unregister,
        deleteCaches: deleteCaches
    };
}();

StartApp.factory('BackgroundApi', ['$http', function($http) {
    var get = function(date) {
        return $http({
            method: 'GET',
            url: '/background',
            params: {
                date: date
            }
        });
    };

    return {
        get: get
    }
}]);

StartApp.factory('LinksApi', ['$http', function($http) {
    var get = function() {
        return $http({
            method: 'GET',
            url: '/links.json'
        });
    };

    return {
        get: get
    }
}]);

StartApp.controller('LinksController', ['$scope', 'LinksApi', function($scope, LinksApi) {
    $scope.links = [];

    LinksApi.get()
        .then(response => {
            let data = response.data;

            $scope.links = data;
        });

}]);

StartApp.controller('Background', ['$scope', '$sce', 'BackgroundApi', function($scope, $sce, BackgroundApi) {
    // Set to -1 as they might not have released the image for today yet, and their API throws an error if you request
    // one for the future!
    let dayOffset = -1;

    $scope.loaded = false;
    $scope.show = false;
    $scope.isNextBackground = false;
    $scope.hide = false;

    let findDifference = (valueOne, valueTwo) => {
        return Math.sqrt(Math.pow(valueOne - valueTwo, 2));
    };

    let getBackground = () => {
        let date = new Date();
        date.setDate(date.getDate() + dayOffset);

        let promise = new Promise((resolve, reject) => {
            BackgroundApi.get(helpers.toDateIso(date))
                .then(function (response) {
                    let data = response.data.data[0].attributes;

                    //$scope.backgroundUrl = '/media/backgrounds/' + response.data.date + '.jpg';

                    let preferredRendition = null;

                    // Loop over all of the renditions until one is found with the closest resolution to the current
                    // screen width is found.
                    data.image.renditions.forEach((rendition) => {
                        if (preferredRendition == null) {
                            preferredRendition = rendition;
                        }

                        let difference = findDifference(window.innerWidth, rendition.width);

                        if (difference < findDifference(window.innerWidth, preferredRendition.width)) {
                            preferredRendition = rendition;
                        }
                    });

                    $scope.data = {
                        backgroundUrl: preferredRendition.uri.replace('http:', 'https:'),
                        title: data.image.title,
                        description: $sce.trustAsHtml(data.image.caption),
                        link: data.uri
                    };

                    $scope.loaded = true;

                    resolve();
                });
        });

        return promise;
    };

    $scope.prevBackground = () => {
        dayOffset--;

        getBackground()
            .then(() => {
                $scope.isNextBackground = true;

                $scope.$apply();
            });
    };

    $scope.nextBackground = () => {
        dayOffset++;

        getBackground()
            .then(() => {
                if (dayOffset == -1) {
                    $scope.isNextBackground = false;

                    $scope.$apply();
                }
            });
    };

    getBackground();

    $scope.press = (key) => {
        console.log(key);

        if (key.keyCode == 27) {
            $scope.hide = !$scope.hide;
        }

        if (key.keyCode == 37) {
            $scope.prevBackground();
        }

        if (key.keyCode == 39) {
            $scope.nextBackground();
        }
    };
}]);

/*
    StartApp.controller('WordController', ['$scope', '$http', function($scope, $http) {
        var dayOffset = 0;

        $scope.loaded = false;
        $scope.isNextWord = false;
        $scope.data = {
            word: '',
            definition: ''
        };

        var getWord = function(callback) {
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

                $scope.loaded = true;

                if (typeof callback !== 'undefined') {
                    callback();
                }
            });
        };

        $scope.prevWord = function() {
            dayOffset--;

            getWord(function() {
                $scope.isNextWord = true;
            });
        };

        $scope.nextWord = function() {
            dayOffset++;

            getWord(function() {
                if (dayOffset == 0) {
                    $scope.isNextWord = false;
                }
            });
        };

        getWord();
    }]);
*/

StartApp.controller('AboutImageController', ['$scope', '$sce', 'BackgroundApi', function($scope, $sce, BackgroundApi) {
}]);

if (window.config.useServiceWorker) {
    serviceWorker.register();
}
