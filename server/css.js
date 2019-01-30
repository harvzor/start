const fs = require('fs');

const css = function() {
    var getCss = () => {
        let css = null;

        let promise = new Promise((resolve, reject) => {
            if (css != null) {
                resolve(css);

                return;
            }

            fs.readFile('./public/css/main.css', 'utf8', (err, data) => {
                if (err) {
                    logger.error(err);

                    reject(err);
                } else {
                    css = data;

                    resolve(css);

                    //logger.info('Loaded css file...', css);
                }
            });
        });

        return promise;
    };

    return {
        getCss: getCss
    }
}();

module.exports = css;
