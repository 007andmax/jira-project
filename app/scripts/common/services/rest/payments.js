'use strict';

/*Payments*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PaymentsService', ['$http', 'RealTimeService', 'Utils',
    function ($http, RealTimeService, Utils) {

      var urlForPayments = '/payments';

      function getPaymentr(url, callback) {
        var future = $http({
          url: url,
          method: 'GET'
        });

        Utils.handleCallback(future, callback)
      }

      function getPaymentsData(callback) {
        return getPaymentr(urlForPayments, callback);
      }

      return {
        getPaymentsData: getPaymentsData
      }


    }])

})(window);
