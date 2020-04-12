'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('QuotesService', ['$http', 'Utils', function ($http, Utils) {

    function getActualNumber(scope, callback) {
        $http.get('/data/actualNumber?type=SALE_QUOTE').success(function (quoteNumber) {
          callback(quoteNumber.number);
        });
    }

    return {
        getActualNumber: getActualNumber
    }

  }]);
})(window, jQuery);
