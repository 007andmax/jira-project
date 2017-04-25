'use strict';

/*Payments*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PaymentsService', ['$http', 'RealTimeService', 'Utils',
    function ($http, RealTimeService, Utils) {

      var urlForGetPayments = '/payments';
      var urlForGetDepositSlips = '/payments/deposits';
      var urlForPostNewDepositSlip = ' /payments/deposits';

      function getData(url, callback) {
        var getFuture = $http({
          url: url,
          method: 'GET'
        });

        Utils.handleCallback(getFuture, callback)
      }

      function postData(url, data, callback) {
        var postFuture = $http({
          url: url,
          method: 'POST',
          data: data
        });
        Utils.handleCallback(postFuture, callback)
      }

      function getPaymentsData(callback) {
        return getData(urlForGetPayments, callback);
      }

      function getDepositSlipsData(callback) {
        return getData(urlForGetDepositSlips, callback);
      }

      function postNewDepositSlip(data, callback) {
        return postData(urlForPostNewDepositSlip, data, callback)
      }



      return {
        getPaymentsData: getPaymentsData,
        getDepositSlipsData: getDepositSlipsData,
        postNewDepositSlip: postNewDepositSlip
      }


    }])

})(window);
