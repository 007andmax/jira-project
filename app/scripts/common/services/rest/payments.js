'use strict';

/*Payments*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PaymentsService', ['$http', 'RealTimeService', 'Utils',
    function ($http, RealTimeService, Utils) {

      var urlForGetPayments = '/payments';
      var urlForGetDepositSlips = '/payments/deposits';
      var urlForPostNewDepositSlip = ' /payments/deposits';
      var urlForGetDepositNumber = '/data/actualNumber?type=DEPOSIT';


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

      function getPaymentsData(scope, callback) {
        var payments = [];
        getData(urlForGetPayments, function(resp) {
          payments = resp;
          callback && callback(payments);
        });

        RealTimeService.subscribe('/payments', scope,  function(newChange) {
          if(newChange.action === 'PAYMENT_CREATED') {
            payments.push(newChange.data);
          } else if ( newChange.action === 'PAYMENTS_DELETED') {
            for (var i = 0; i < newChange.data.length; i++) {
              var paymentId = newChange.data[i];
              Utils.deleteById(payments, paymentId);
            }
          }
        });
      }

      function getDepositSlipsData(scope, callback) {
        var depositSlips = [];
        getData(urlForGetDepositSlips, function(resp) {
          depositSlips = resp;
          callback && callback(depositSlips);
        });

        RealTimeService.subscribe('/deposits', scope, function(newChange) {
          if(newChange.action === 'DEPOSIT_CREATED') {
            depositSlips.push(newChange.data);
          } else if ( newChange.action === 'DEPOSIT_DELETED') {
            for (var i = 0; i < newChange.data.length; i++) {
              var depositSlipId = newChange.data[i];
              Utils.deleteById(depositSlips, depositSlipId);
            }
          }
        })
      }

      function postNewDepositSlip(data, callback) {
        return postData(urlForPostNewDepositSlip, data, callback)
      }

      function rollback(paymentId, callback) {
        var future = $http.put('/payments/rollback?paymentId=' + paymentId, {});
        Utils.handleCallback(future, callback);
      }

      function getDepositNumber(callback) {
        var depositNumber;
        getData(urlForGetDepositNumber, function(resp) {
          depositNumber = resp;
          callback && callback(depositNumber);
        })
      }

      function editPayment(data) {
        $http.put('/payments/edit', data)
          .then(function(res) {
            console.log(res);
          })
      }

      return {
        getPaymentsData: getPaymentsData,
        getDepositSlipsData: getDepositSlipsData,
        postNewDepositSlip: postNewDepositSlip,
        rollback: rollback,
        getDepositNumber: getDepositNumber,
        editPayment: editPayment
      }


    }])

})(window);
