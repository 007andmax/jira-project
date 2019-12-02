'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ConstantsService', ['$http',
    function ($http) {

      var constants;

      var future = $http.get('/data/getConstants').then(function (resp) {
        constants = resp.data;
        future = undefined;
        return resp.data;
      });

      function getConstant(constantName, callback) {

        if (!constantName) {
          return constants;
        }

        if (!constants) {
          future.then(function (data) {
            if (!Array.isArray(constantName)) {

              if (data.hasOwnProperty(constantName)) {
                callback && callback(data[constantName]);
              }

            } else {

              var constantByName = {};

              for (var i = 0; i < constantName.length; i++) {
                if (data.hasOwnProperty(constantName[i])) {
                  constantByName[constantName[i]] = data[constantName[i]];
                }
              }

              callback && callback(constantByName);

            }
          })
        } else {
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
      }

      return {
        getConstant: getConstant
      }

    }]);

})(window, jQuery);
