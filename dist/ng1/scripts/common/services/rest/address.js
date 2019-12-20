'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AddressesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function getLocales(grouped, callback) {

      if (grouped == null) {
        throw 'grouped is required!';
      }

      var info = Utils.customizeArray([]);

      var url = '/addresses/' + (grouped ? 'getGroupedLocales' : 'getLocales');

      $http.get(url).then(function (resp) {
        Utils.customizeArray(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function getLocaleByName(name, callback) {

      if (name == null) {
        throw 'name is required!';
      }

      var future = $http({
        url: '/addresses/getLocaleByName',
        method: 'POST',
        data: name
      });

      Utils.handleCallback(future, callback);
    }

    return {
      getLocales: getLocales,
      getLocaleByName: getLocaleByName
    }
  }
  ]);
})(window, jQuery);
