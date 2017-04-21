'use strict';

(function (window, $, undefined){

  var services = angular.module('main.services');

  services.factory('PaymentsService', ['http', '$rootScope', 'RealTimeService', 'Utils',
  function($http, $rootScope, RealTimeService, Utils){

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

})();
