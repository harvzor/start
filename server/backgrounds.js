const natGeoApi = require('national-geographic-api').API;

const backgrounds = function() {
    let backgroundData = {};

    /**
     * Get the background data, either from cache or from the NatGeo website.
     * @param {string} date Date in ISO format.
     */
    var getBackgroundData = (date) => {
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

    let getBackgroundUri = async(date, width) => {
        let backgroundDataString = await getBackgroundData(date);

        let data = JSON.parse(backgroundDataString);

        let render = data.data[0].attributes.image.renditions
            .find(rendition => rendition.width === width);

        return render.uri;
    };

    return {
        getBackground: getBackgroundData,
        getBackgroundUri: getBackgroundUri
    };
}();

module.exports = backgrounds;
