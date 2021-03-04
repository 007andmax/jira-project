'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AddressesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {



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
      getLocaleByName: getLocaleByName
    }
  }
  ]);
})(window, jQuery);
