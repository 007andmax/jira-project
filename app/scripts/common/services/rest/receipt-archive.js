'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReceiptArchiveService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function getReceiptArchiveData(scope, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!'
      }

      var data = Utils.customizeObj({
        list: [],
        companies: {}
      });

      $http.get('/receiptArchive').then(function (resp) {

        Utils.customizeArray(resp.data, data.list);

        for (var i = 0; i < resp.data.length; i++) {
          var invoice = resp[i];

          if (data.companies[invoice.companyId]) {
            data.companies[invoice.companyId].push(invoice);
          } else {
            data.companies[invoice.companyId] = [invoice];
          }
        }

        RealTimeService.subscribe('/receiptArchive', scope, function (newChange) {
          console.log(newChange);

          if (newChange.action === 'RECEIPT_ARCHIVE_ADDED') {

            for (var i = 0; i < newChange.data.length; i++) {

              var invoice = newChange.data[i];

              data.list.push(invoice);

              if (data.companies[invoice.companyId]) {
                data.companies[invoice.companyId].push(invoice);
              } else {
                data.companies[invoice.companyId] = [invoice];
              }
            }

          } else if (newChange.action === 'COMPANY_ARCHIVED') {

            for (var i = 0; i < data.list.length; i++) {
              if (data.list[i].companyId === newChange.data.id) {
                data.list.splice(i, 1);
                i--;
              }
            }

            delete data.companies[newChange.data.id];
          }
        });

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      return data;

    }


    return {
      getReceiptArchiveData: getReceiptArchiveData
    }

  }]);

})(window, jQuery);
