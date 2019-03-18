'use strict';

(function (window, $, undefined) {
  var services = angular.module('main.services');

  services.factory('CustomStorageService', ['$http', 'RealTimeService', 'Utils', function($http, RealTimeService, Utils) {

    function getUserCustomStorageValue(customKey, callback) {
      var future = $http({
        url: 'https://dev.quicktech.com/customStorage/user?customKey=' + customKey,
        method: 'GET'
      });
      Utils.handleCallback(future, callback)
    }

    function saveUserCustomStorageItem( data, callback) {
      var jsonData = JSON.stringify(data);
      var future = $http({
        url: 'https://dev.quicktech.com/customStorage/user',
        method: 'POST',
        data: jsonData
      });

      Utils.handleCallback(future, callback)
    }

    return {
      getUserCustomStorageValue: getUserCustomStorageValue,
      saveUserCustomStorageItem: saveUserCustomStorageItem
    }

  }])
})(window, jQuery);
