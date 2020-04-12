'use strict';

(function (window, $, undefined) {
  var services = angular.module('main.services');

  services.factory('ColorsService', ['$http', 'RealTimeService', 'Utils', function($http, RealTimeService, Utils) {

    var urlForCompaniesColors = '/company/color';
    var urlForUsersColors = '/users/color';

    function getColors(url, callback) {
      var future = $http({
        url: url,
        method: 'GET'
      });
      Utils.handleCallback(future, callback)
    }

    function putColors(url, data, callback) {
      var future = $http({
        url: url,
        method: 'PUT',
        data: data
      });
      Utils.handleCallback(future, callback)
    }



    function getUserColors(scope, callback) {
      var userColor = {};

      getColors(urlForUsersColors, function(resp) {
        Utils.customizeObj(resp, userColor);
        callback && callback(userColor)
      });

      RealTimeService.subscribe('/user', scope, function(newChange) {
        if(newChange.action === 'USER_COLOR_CHANGED' ) {
          Utils.customizeObj(newChange.data, userColor);
        }
      })
    }

    function putUsersColors(data, callback) {
      return putColors(urlForUsersColors, data, callback)
    }

    function getCompaniesColors(scope, callback) {
      var companiesColors = {};
      getColors(urlForCompaniesColors, function(resp) {
        Utils.customizeObj(resp, companiesColors);
        callback && callback(companiesColors)
      });

      RealTimeService.subscribe('/company', scope, function(newChange) {
        if(newChange.action === 'COMPANY_COLOR_CHANGED' ) {
          Utils.customizeObj(newChange.data, companiesColors);
        }
      })

    }

    function putCompaniesColors(data, callback) {
      return putColors(urlForCompaniesColors, data, callback)
    }

    return {
      getUserColors: getUserColors,
      putUsersColors: putUsersColors,
      getCompaniesColors: getCompaniesColors,
      putCompaniesColors: putCompaniesColors
    }

  }])
})(window, jQuery);
