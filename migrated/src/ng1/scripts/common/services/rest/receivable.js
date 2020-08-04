'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReceivableService', ['$http', '$rootScope', 'RealTimeService', 'CompaniesService', 'Utils', function ($http, $rootScope, RealTimeService, CompaniesService, Utils) {
    function getInvoiceDataTable(scope, callback, data) {
      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!'
      }
      return $http.post('/receivable', data).then(function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
    }

    function receivePayment(paymentMethod, invoiceIds, isSendNotification, note, callback, additionalData) {
      if (!paymentMethod) {
        throw 'paymentMethod is required!'
      }

      if (!invoiceIds || invoiceIds.length === 0) {
        throw 'invoiceIds is required!'
      }

      if (isSendNotification === undefined) {
        throw 'isSendNotification is required!';
      }

      var data = {
        paymentMethod: paymentMethod.toUpperCase(),
        isSendNotification: isSendNotification,
        invoiceIds: invoiceIds,
        note: note
      }

      data = Object.assign(data, additionalData);

      var future = $http({
        url: '/receivable/receivePayment',
        method: 'POST',
        data: data
      });

      Utils.handleCallback(future, callback);

    }
    function getReceivableInvoicesData(scope, callback) {
      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!'
      }
      var data = {
        list: [],
        companies: {}
      };
      $http.post('/receivable', {}).then(function (resp) {
        Utils.customizeArray(resp.data, data.list);
        for (var i = 0; i < resp.data.length; i++) {
          var invoice = resp.data[i];
          if (data.companies[invoice.company.id]) {
            data.companies[invoice.company.id].push(invoice);
          } else {
            data.companies[invoice.company.id] = [invoice];
          }
        }
        $rootScope.allInvoices = data.list.map(function(el) {
          el.companyName = CompaniesService.getOneById(el.company.id).name;
          return el;
        });
        if (callback) {
          callback(data);
        }
        RealTimeService.subscribe('/receivableInvoice', scope, function (newChange) {
          if (newChange.action == 'INVOICE_SAVED') {
           
            $rootScope.$emit('receivableInvoice', newChange);
            var invoice = Utils.findById(data.list, newChange.data.id);
            if (invoice) {
              // Utils.customizeObj(newChange.data, invoice);
            } else {
              // data.list.push(newChange.data);
              if (data.companies[newChange.data.company.id]) {
                // data.companies[newChange.data.company.id].push(newChange.data);
              } else {
                // data.companies[newChange.data.company.id] = [newChange.data];
              }
            }
          } else if (newChange.action === 'INVOICE_STATUS') {
            var invoice = Utils.findById(data.list, newChange.data.id);
            if (invoice) {
              Utils.defineReadOnlyProperty(invoice, 'status', newChange.data.status);
              Utils.defineReadOnlyProperty(invoice, 'readedAt', newChange.data.readedAt);
            } else {
              console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING INVOICE-----!!!!!!!!");
            }
          } else if (newChange.action === 'INVOICE_DELETED') {
            $rootScope.$emit('receivableInvoice', newChange);
            Utils.deleteById(data.list, newChange.data.id);
            if (data.companies[newChange.data.company.id]) {
              Utils.deleteById(data.companies[newChange.data.company.id], newChange.data.id);
            }
          } else if (newChange.action === 'PAYMENT_RECEIVED') {
         
            $rootScope.$emit('receivableInvoicePayment', newChange);
          
          } else if (newChange.action === 'INVOICE_ROLLBACK') {
            $rootScope.$emit('receivableInvoice', newChange);
            var invoice = Utils.findById(data.list, newChange.data.id);
            Utils.customizeObj(newChange.data, invoice);
            invoice.status = newChange.data.status;
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
    return {
      getInvoiceDataTable: getInvoiceDataTable,
      receivePayment: receivePayment,
      getReceivableInvoicesData:getReceivableInvoicesData
    }
  }]);

})(window, jQuery);
