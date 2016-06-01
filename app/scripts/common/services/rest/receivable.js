'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReceivableService', ['$http', '$rootScope', 'RealTimeService', 'CompaniesService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, CompaniesService, Utils) {

    function getReceivedPaymentsSumByCompany(companyId, scope, callback) {

      if (!companyId) {
        throw 'companyId is required!'
      }

      if (!scope || !scope.$id) {
        throw 'Second argument must be Angularjs scope!'
      }

      var result = Utils.customizeObj({});

      $http.get('/receivable/paymentSum/' + companyId).then(function (resp) {

        Utils.customizeObj(resp.data, result);

        RealTimeService.subscribe('/companyPaymentReceived?targetId=' + companyId, scope, function (newChange) {

          console.log(newChange);

          if (newChange.action === 'COMPANY_PAYMENT_RECEIVED') {
            Utils.defineReadOnlyProperty(result, 'value', result.value + newChange.data);
            if (callback) {
              callback(result);
            }
          } else if (newChange.action === 'RECEIVED_PAYMENTS_SUM') {
            Utils.defineReadOnlyProperty(result, 'value', newChange.data);
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

    function getReceivableGraphData(scope, callback) {

      var result = Utils.customizeArray([]);

      $http.get("/receivable/chart/lastDays").then(function (resp) {

        Utils.customizeArray(resp.data, result);

        RealTimeService.subscribe('/todayReceivableChartPoint?targetId=' + CompaniesService.getCurrentCompany().id, scope, function (newChange) {

          console.log(newChange);

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

      var data = Utils.customizeObj({
        list: [],
        companies: {}
      });

      $http.get('/receivable').then(function (resp) {

        //invoices should be grouped by recurring
        var groupedList = Utils.customizeArray([]);

        for (var i = 0; i < resp.data.length; i++) {

          var invoice = Utils.customizeObj(resp.data[i]);

          if (!invoice.recurringInvoice) {
            groupedList.push(invoice);
          } else {

            var recurring = Utils.findById(groupedList, invoice.recurringInvoice.id);

            if (!recurring || recurring.invoices.length == 1) {
              recurring = invoice.recurringInvoice;
              Utils.defineReadOnlyProperty(recurring, "isRecurring", true);
              Utils.defineReadOnlyProperty(recurring, "company", invoice.company);
              Utils.defineReadOnlyProperty(recurring, "number", invoice.number);
              Utils.defineReadOnlyProperty(recurring, "invoices", Utils.customizeArray([]));
              groupedList.push(recurring);
            }

            Utils.defineReadOnlyProperty(invoice, "recurringInvoice", {
              id: recurring.id,
              frequency: recurring.frequency
            });

            recurring.invoices.push(invoice);
          }
        }

        groupedList.sort(Utils.getComparatorBy('number'));

        for (var i = 0; i < groupedList.length; i++) {
          var invoice = groupedList[i];

          if (!data.companies[invoice.company.id]) {
            Utils.defineReadOnlyProperty(data.companies, invoice.company.id, Utils.customizeArray([]));
          }

          data.companies[invoice.company.id].push(invoice);
        }

        Utils.defineReadOnlyProperty(data, "list", groupedList);

        RealTimeService.subscribe('/receivableInvoice', scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'INVOICE_SAVED') {

            var invoice = newChange.data,
              addInvoice;

            if (!invoice.recurringInvoice) {
              addInvoice = invoice;
            } else {

              var recurring = Utils.findById(data.list, invoice.recurringInvoice.id);

              if (!recurring) {
                recurring = invoice.recurringInvoice;
                recurring.isRecurring = true;
                recurring.company = invoice.company;
                recurring.invoices = [];

                addInvoice = recurring;
              }

              invoice.recurringInvoice = {
                id: recurring.id,
                frequency: recurring.frequency
              };

              recurring.invoices.push(invoice);
            }

            if (addInvoice) {

              addInvoice = Utils.customizeObj(addInvoice);

              if (!data.companies[addInvoice.company.id]) {
                Utils.defineReadOnlyProperty(data.companies, addInvoice.company.id, []);
              }

              data.companies[addInvoice.company.id].push(addInvoice);
              data.list.push(addInvoice);
            }

          } else if (newChange.action === 'INVOICE_STATUS') {

            var invoice;

            if (newChange.data.recurringInvoice) {
              var recurringInvoice = Utils.findById(data.list, newChange.data.recurringInvoice.id);

              if (!recurringInvoice) {
                console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING RECURRING INVOICE-----!!!!!!!")
              }

              invoice = Utils.findById(recurringInvoice.invoices, newChange.data.id);

              if (!invoice) {
                invoice = recurringInvoice;
              }

            } else {
              invoice = Utils.findById(data.list, newChange.data.id);
            }

            if (invoice) {
              Utils.defineReadOnlyProperty(invoice, 'status', newChange.data.status);
            } else {
              console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING INVOICE-----!!!!!!!!")
            }
          } else if (newChange.action === 'PAYMENT_RECEIVED') {

            var invoiceIds = newChange.data;

            for (var i = 0; i < invoiceIds.length; i++) {

              var invoiceId = invoiceIds[i],
                recurringId = undefined,
                invoiceCompanyId = undefined;

              for (var d = 0; d < data.list.length && !invoiceCompanyId; d++) {

                var inv = data.list[d];

                if (inv.isRecurring) {
                  for (var r = 0; r < inv.invoices.length && !invoiceCompanyId; r++) {
                    var invoiceUnderRecurring = inv.invoices[r];
                    if (invoiceId === invoiceUnderRecurring.id) {
                      inv.invoices.splice(r, 1);
                      invoiceCompanyId = invoiceUnderRecurring.company.id;
                      recurringId = inv.id;

                      if (inv.invoices.length === 0) {
                        data.list.splice(d, 1);
                      }
                    }
                  }
                } else if (invoiceId === inv.id) {
                  data.list.splice(d, 1);
                  invoiceCompanyId = inv.company.id;
                }
              }

              if (invoiceCompanyId && data.companies[invoiceCompanyId]) {

                var invoices = data.companies[invoiceCompanyId];

                if (recurringId) {
                  var recIndex = Utils.indexOfId(invoices, recurringId);

                  if (recIndex > -1) {

                    var invIndex = Utils.indexOfId(invoices[recIndex].invoices, invoiceId);

                    if (invIndex > -1) {
                      invoices[recIndex].invoices.splice(recIndex, 1);
                    }

                    if (invoices[recIndex].invoices.length === 0) {
                      invoices.splice(recIndex, 1);
                    }
                  }
                } else {
                  var index = Utils.indexOfId(invoices, invoiceId);

                  if (index > -1) {
                    invoices.splice(index, 1);
                  }
                }

                if (invoices.length === 0) {
                  delete data.companies[invoiceCompanyId];
                }
              }
            }
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

    function getInvoiceDataForPreview(invoiceId, callback) {
      if (!invoiceId) {
        throw 'Invoice id required!';
      }

      var future = $http.get('/invoice/getDataByInvoiceId?invoiceId=' + invoiceId);

      Utils.handleCallback(future, callback);
    }

    function receivePayment(paymentMethod, invoiceIds, isSendNotification, callback) {

      if (!paymentMethod) {
        throw 'paymentMethod is required!'
      }

      if (!invoiceIds || invoiceIds.length === 0) {
        throw 'invoiceIds is required!'
      }

      if (isSendNotification === undefined) {
        throw 'isSendNotification is required!';
      }

      var future = $http({
        url: '/receivable/receivePayment',
        method: 'POST',
        params: { paymentMethod: paymentMethod.toUpperCase(), isSendNotification: isSendNotification },
        data: invoiceIds
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
        data: invoiceIds
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

    return {
      getReceivedPaymentsSumByCompany: getReceivedPaymentsSumByCompany,
      getReceivableGraphData: getReceivableGraphData,
      getReceivableInvoicesData: getReceivableInvoicesData,
      getInvoiceDataForPreview: getInvoiceDataForPreview,
      receivePayment: receivePayment,
      resendInvoice: resendInvoice,
      resendInvoices: resendInvoices,
      search: search
    }
  }]);

})(window, jQuery);
