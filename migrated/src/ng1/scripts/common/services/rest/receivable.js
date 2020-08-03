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

    return {
      getReceivableGraphData: getReceivableGraphData,
      getInvoiceDataTable: getInvoiceDataTable,
      receivePayment: receivePayment,
    }
  }]);

})(window, jQuery);
