'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReceiptArchiveService', ['$http', '$rootScope', 'RealTimeService', 'Utils', function ($http, $rootScope, RealTimeService, Utils) {

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
          var invoice = resp.data[i];

          if (data.companies[invoice.company.id]) {
            data.companies[invoice.company.id].push(invoice);
          } else {
            data.companies[invoice.company.id] = [invoice];
          }
        }

        if (callback) {
          callback(data);
        }

        RealTimeService.subscribe('/receiptArchive', scope, function (newChange) {

          if (newChange.action === 'RECEIPT_ARCHIVE_ADDED') {

            for (var i = 0; i < newChange.data.length; i++) {

              var invoice = newChange.data[i];

              data.list.push(invoice);

              if (data.companies[invoice.company.id]) {
                data.companies[invoice.company.id].push(invoice);
              } else {
                data.companies[invoice.company.id] = [invoice];
              }
            }

          } else if (newChange.action === 'RECEIPT_ARCHIVE_DELETED') {

            for (var i = 0; i < newChange.data.length; i++) {
              var changedInvoice = newChange.data[i];
              var invoice = Utils.findById(data.list, changedInvoice.id);
              Utils.customizeObj(changedInvoice, invoice);
            }

          } else if (newChange.action === 'COMPANY_ARCHIVED') {

            for (var i = 0; i < data.list.length; i++) {
              if (data.list[i].company.id === newChange.data.id) {
                data.list.splice(i, 1);
                i--;
              }
            }

            delete data.companies[newChange.data.id];
          }

          if (callback) {
            callback(data);
          }
        });

      }, function (err) {
        if (callback) {
          callback(err.code, err.message);
        }
      });

      return data;

    }

    function resendInvoices(invoiceIds, callback) {
      if (!invoiceIds) {
        throw 'invoiceIds is required!'
      }

      var future = $http({
        url: '/receiptArchive/resend',
        method: 'POST',
        data: { ids: invoiceIds }
      });

      Utils.handleCallback(future, callback);
    }

    function deleteInvoices(invoiceIds, callback) {
      if (!invoiceIds) {
        throw 'invoiceIds is required!'
      }

      var future = $http({
        url: '/receiptArchive/delete',
        method: 'POST',
        data: { ids: invoiceIds }
      });

      Utils.handleCallback(future, callback);
    }


    return {
      getReceiptArchiveData: getReceiptArchiveData,
      resendInvoices: resendInvoices,
      deleteInvoices: deleteInvoices
    }

  }]);

})(window, jQuery);
