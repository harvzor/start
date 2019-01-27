var wordnik = function(http) {
    return {
        getWordOfTheDay: function(callback) {
            http.get({
                host: 'api.wordnik.com',
                path: '/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
            }, function(response) {
                var body = '';

                response.on('data', function(d) {
                    body += d;
                });

                response.on('end', function() {
                    var parsed = JSON.parse(body);

                    callback(parsed);
                });
            });
        }
    };
};

module.exports = wordnik;
