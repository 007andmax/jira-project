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

        data.list.forEach(function (invoice) {
          var companyInvoices = data.companies[invoice.companyId];

          if (companyInvoices) {
            companyInvoices.push(invoice);
          } else {
            Utils.defineReadOnlyProperty(data.companies, invoice.companyId, Utils.customizeArray([invoice]))
          }
        });

        RealTimeService.subscribe('/receiptArchive', scope, function (newChange) {
          console.log(newChange);

          if (newChange.action === 'RECEIPT_ARCHIVE_ADDED') {

            var changedCompanies = [];

            for (var i = 0; i < newChange.data.length; i++) {

              var invoice = newChange.data[i],
                addInvoice;

              if (invoice.recurringInvoice) {
                var updInvoice = Utils.findById(data.list, invoice.recurringInvoice.id);

                if (updInvoice) {

                  Utils.defineReadOnlyProperty(updInvoice, 'invoicesCount', updInvoice.invoicesCount + 1);
                  Utils.defineReadOnlyProperty(updInvoice, 'sum', updInvoice.sum + invoice.sum);

                  if (invoice.date > updInvoice.date) {
                    Utils.defineReadOnlyProperty(updInvoice, 'date', invoice.date);
                    Utils.defineReadOnlyProperty(updInvoice, 'paidOn', invoice.paidOn);
                  }
                } else {

                  addInvoice = Utils.customizeObj({
                    id: invoice.recurringInvoice.id,
                    isRecurring: true,
                    frequency: invoice.recurringInvoice.frequency,
                    number: invoice.recurringInvoice.number,
                    companyId: invoice.company.id,
                    date: invoice.date,
                    paidOn: invoice.paidOn,
                    sum: invoice.sum,
                    invoicesCount: 1
                  });
                }
              } else {
                addInvoice = Utils.customizeObj({
                  id: invoice.id,
                  isRecurring: false,
                  frequency: null,
                  number: invoice.number,
                  companyId: invoice.company.id,
                  date: invoice.date,
                  paidOn: invoice.paidOn,
                  sum: invoice.sum,
                  invoicesCount: null
                });
              }

              if (addInvoice) {
                data.list.push(addInvoice);

                var companyInvoices = data.companies[addInvoice.companyId];

                if (companyInvoices) {
                  companyInvoices.push(addInvoice)
                } else {
                  Utils.defineReadOnlyProperty(data.companies, addInvoice.companyId, Utils.customizeArray([addInvoice]))
                }

                if (changedCompanies.indexOf(addInvoice.companyId) < 0) {
                  changedCompanies.push(addInvoice.companyId);
                }
              }
            }

            data.list.sort(Utils.getComparatorBy('number'));

            changedCompanies.forEach(function (companyId) {
              data.companies[companyId].sort(Utils.getComparatorBy('number'))
            })

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
