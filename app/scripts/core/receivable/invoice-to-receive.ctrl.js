'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceToReceiveCtrl',
    ['$scope',
      function ($scope) {

        $scope.totalInvoiceSum = $scope.calculateTotalInvoiceSum($scope.invoice);

        $scope.invoiceProperty = function (property) {
          var invoice = $scope.invoice;
          return invoice.isRecurring ? invoice.invoices[invoice.invoices.length - 1][property] : invoice[property]
        };

      }]);

}());

