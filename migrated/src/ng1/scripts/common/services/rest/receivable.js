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

    return {
      getInvoiceDataTable: getInvoiceDataTable,
      receivePayment: receivePayment,
    }
  }]);

})(window, jQuery);
