'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TutorialsService', ['$http', 'Utils', function ($http, Utils) {

    function getTypes(callback) {
      var future = $http.get('/tutorials/types');
      Utils.handleCallback(future, callback);
    }

    return {
      getTypes: getTypes
    }

  }]);
})(window, jQuery);
