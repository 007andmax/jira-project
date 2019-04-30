'use strict';

/*Payments*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PaymentsService', ['$http', 'RealTimeService', 'Utils', '$rootScope',
    function ($http, RealTimeService, Utils, $rootScope) {

      var urlForGetPayments = '/payments';
      var urlForGetDepositSlips = '/payments/deposits';
      var urlForPostNewDepositSlip = ' /payments/deposits';
      var urlForGetDepositNumber = '/data/actualNumber?type=DEPOSIT';
      var payments = [];
      var wasSubscribed = false;

      function getData(url, callback, data) {
        var getFuture = $http({
          url: url,
          method: 'post',
          data: data ? data : null
        });

        Utils.handleCallback(getFuture, callback)
      }

      var isRequestSent = false;

      function getPaymentsDataTable(scope, callback, data) {
        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }
        return $http.post('/payments', data).then(function (resp) {
          if (callback) {
            if (resp.data.list) {
              payments = [...resp.data.list, ...payments];
              callback(resp.data.list);
            } else {
              callback(resp.data);
              payments = [...resp.data, ...payments];
            }
          }
        });
      }


      function postData(url, data, callback) {
        var postFuture = $http({
          url: url,
          method: 'POST',
          body: data
        });
        Utils.handleCallback(postFuture, callback)
      }

      function getPaymentsData(data, scope, callback) {

        // if (payments && payments.length) {
        //   callback && callback(payments);
        //   return;
        // }


        if (data) {
          getData(urlForGetPayments, function(resp) {
            payments = resp;
            callback && callback(payments);
          }, data);
        }



        wasSubscribed = true;
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

      function editPayment(data, callback) {
        $http.put('/payments/edit', data)
          .then(function(res) {

            if (callback) callback(res);
          })
      }

      function deletePayment(id) {
        $http.put('/payments/delete?paymentId=' + id)
          .then(function() {
            console.log(res, 'RES');
            if (callback) callback(res)
          })
      }

      function refundPayment(data, callback) {
        $http.put('/payments/refund', data)
          .then(function(res) {
            // if (callback) callback(res);
          })
      }

      return {
        getPaymentsData: getPaymentsData,
        getDepositSlipsData: getDepositSlipsData,
        postNewDepositSlip: postNewDepositSlip,
        rollback: rollback,
        getDepositNumber: getDepositNumber,
        editPayment: editPayment,
        deletePayment: deletePayment,
        refundPayment: refundPayment,
        getPaymentsDataTable: getPaymentsDataTable
      }


    }])

})(window);
