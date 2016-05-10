'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ConstantsService', ['$http',
    function ($http) {

      var constants;

      $http.get('/data/getConstants').then(function (resp) {
        constants = resp.data;
      });

      function getConstant(constantName) {

        if (!constantName) {
          return constants;
        }

        if (!Array.isArray(constantName)) {

          if (constants.hasOwnProperty(constantName)) {
            return constants[constantName];
          }

        } else {

          var constantByName = {};

          for (var i = 0; i < constantName.length; i++) {
            if (constants.hasOwnProperty(constantName[i])) {
              constantByName[constantName[i]] = constants[constantName[i]];
            }
          }

          return constantByName;

        }
      }

      return {
        getConstant: getConstant
      }

    }]);

})(window, jQuery);
