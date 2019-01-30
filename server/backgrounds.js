const natGeoApi = require('national-geographic-api').API;

const backgrounds = function() {
    let backgroundData = {};

    /**
     * Get the background data, either from cache or from the NatGeo website.
     * @param {string} date Date in ISO format.
     */
    var getBackground = (date) => {
        return new Promise((resolve, reject) => {
            // Data already loaded.
            if (typeof backgroundData[date] !== 'undefined') {
                resolve(backgroundData[date]);

                return;
            }

            natGeoApi.getPhotoOfDay(date)
                .then(result => {
                    backgroundData[date] = result;

                    resolve(result);
                })
                .catch(e => {
                    reject(e);
                });
        });
    };

    return {
        getBackground: getBackground
    };
}();

module.exports = backgrounds;
