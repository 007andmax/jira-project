'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('GlobalSearch', ['$http', '$rootScope', 'Utils', function ($http, $rootScope, Utils) {

    function search(word, callback) {
      var future = $http.get('/globalSearch?word=' + word);
      Utils.handleCallback(future, callback);
    }

    return {
      search: search
    }

  }]);

})(window, jQuery);
