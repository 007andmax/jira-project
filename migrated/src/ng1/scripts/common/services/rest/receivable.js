'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReceivableService', ['$http', '$rootScope', 'RealTimeService', 'CompaniesService', 'Utils', function ($http, $rootScope, RealTimeService, CompaniesService, Utils) {

    function getReceivableGraphData(scope, callback) {

      var result = Utils.customizeArray([]);

      $http.get("/receivable/chart/lastDays").then(function (resp) {

        Utils.customizeArray(resp.data, result);

        RealTimeService.subscribe('/todayReceivableChartPoint/' + CompaniesService.getCurrentCompany().id, scope, function (newChange) {

          if (newChange.action === 'TODAY_RECEIVABLE_CHART_POINT') {

            var lastPoint = result[result.length - 1],
              lastPointDate = new Date(lastPoint.date),
              date = new Date(newChange.data.date);

            if (lastPointDate.getFullYear() === date.getFullYear()
              && lastPointDate.getMonth() === date.getMonth()
              && lastPointDate.getDate() + 1 === date.getDate()) {
              result.push(Utils.customizeObj(newChange.data));
              result.splice(0, 1);
            } else {
              Utils.customizeObj(newChange.data, lastPoint)
            }
          }
        });

        if (callback) {
          callback(resp.data);
        }
      }, function (response) {

        if (callback) {
          callback(response.data);
        }
      });

      return result;
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

            Utils.deleteById(data.list, newChange.data.id);
            if (data.companies[newChange.data.company.id]) {
              Utils.deleteById(data.companies[newChange.data.company.id], newChange.data.id);
            }

          } else if (newChange.action === 'PAYMENT_RECEIVED') {

            var invoiceIds = newChange.data;
            for(var i=0; i<invoiceIds.length; i++) {
              var invoice = Utils.findById(data.list, invoiceIds[i].id);
              Utils.customizeObj(invoiceIds[i], invoice);
            }


            // for (var i = 0; i < invoiceIds.length; i++) {
            //
            //   var invoiceId = invoiceIds[i].id,
            //     invoiceCompanyId = undefined;
            //
            //   for (var j = 0; j < data.list.length; j++) {
            //
            //     var inv = data.list[j];
            //
            //     if (invoiceId === inv.id) {
            //       data.list.splice(j, 1);
            //       invoiceCompanyId = inv.company.id;
            //       break;
            //     }
            //   }
            //
            //   // if (invoiceCompanyId && data.companies[invoiceCompanyId]) {
            //   //
            //   //   var invoices = data.companies[invoiceCompanyId],
            //   //     index = Utils.indexOfId(invoices, invoiceId);
            //   //
            //   //   if (invoices.length <= 1) {
            //   //     delete data.companies[invoiceCompanyId];
            //   //   } else if (index > -1) {
            //   //     invoices.splice(index, 1);
            //   //   }
            //   // }
            // }
          } else if (newChange.action === 'INVOICE_ROLLBACK') {
            var invoice = Utils.findById(data.list, newChange.data.id);
            Utils.customizeObj(newChange.data, invoice)

            // console.log(invoice, 'invoice')
            invoice.status = newChange.data.status;
          }
          /*else if (newChange.action == 'COMPANY_ARCHIVED') {

           delete data.companies[newChange.data.id];

           for (var i = 0; i < data.list.length; i++) {
           if (data.list[i].company.id === newChange.data.id) {
           data.list.splice(i, 1);
           i--;
           }
           }
           }*/

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

    function getInvoiceDataForPreview(invoiceId, callback) {
      if (!invoiceId) {
        throw 'Invoice id required!';
      }

      var future = $http.get('/invoice/getDataByInvoiceId?invoiceId=' + invoiceId);

      Utils.handleCallback(future, callback);
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

    function resendInvoice(invoiceId, callback) {
      if (!invoiceId) {
        throw 'invoiceId is required!'
      }

      resendInvoices([invoiceId], callback);
    }

    function resendInvoices(invoiceIds, callback) {
      if (!invoiceIds) {
        throw 'invoiceIds is required!'
      }

      var future = $http({
        url: '/receivable/resend',
        method: 'POST',
        data: { ids: invoiceIds }
      });

      Utils.handleCallback(future, callback);
    }

    function search(keyword) {

      if (!keyword) {
        throw 'Keyword is required!'
      }

      return $http.get("/receivable/search?keyword=" + keyword.toLowerCase()).then(function (response) {
        return response.data;
      });
    }

    function rollback(invoiceId, callback) {
      var future = $http.put('/invoice/rollback?invoiceId=' + invoiceId, {});
      Utils.handleCallback(future, callback);
    }

    function remove(invoiceId, callback) {
      var future = $http.delete('/invoice/delete?invoiceId=' + invoiceId);
      Utils.handleCallback(future, callback);
    }

    function markAsRead(invoiceId, callback) {
      var future = $http.post('/invoice/'+invoiceId+'/markAsRead');
      Utils.handleCallback(future, callback);
    }

    return {
      getReceivableGraphData: getReceivableGraphData,
      getReceivableInvoicesData: getReceivableInvoicesData,
      getInvoiceDataForPreview: getInvoiceDataForPreview,
      receivePayment: receivePayment,
      resendInvoice: resendInvoice,
      resendInvoices: resendInvoices,
      search: search,
      rollback: rollback,
      remove: remove,
      markAsRead: markAsRead
    }
  }]);

})(window, jQuery);
