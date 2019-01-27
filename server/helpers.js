'use strict';

var helpers = {
    // Returns a date in "yyyy-MM-dd" format.
    dateToString: function(date) {
        var month = date.getMonth() + 1;

        if (month < 10) {
            month = '0' + month;
        }

        return date.getFullYear() + '-' + month + '-' + date.getDate();
    }
};

module.exports = helpers;

