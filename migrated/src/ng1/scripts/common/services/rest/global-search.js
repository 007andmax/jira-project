'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('GlobalSearch', ['$http', '$rootScope', 'Utils', function ($http, $rootScope, Utils) {

    function search(word, callback) {
      var future = $http.get('/globalSearch', { params: { word: word } });
      Utils.handleCallback(future, callback);
    }

    function filterByType(id, type, callback) {
      var future = $http.get('/globalSearch/filter?id=' + id + '&type=' + type);
      Utils.handleCallback(future, callback);
    }

    return {
      search: search,
      filterByType: filterByType
    }

  }]);

})(window, jQuery);
