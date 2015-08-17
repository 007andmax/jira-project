'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.companyInvoiceCtrl',
    ['$scope', 'ReceivableService',
      function ($scope, ReceivableService) {

        $scope.totalInvoiceSum = $scope.calculateTotalInvoiceSum($scope.invoice);

        $scope.invoiceProperty = function (property) {
          var invoice = $scope.invoice;
          return invoice.isRecurring ? invoice.invoices[invoice.invoices.length - 1][property] : invoice[property]
        };

        if ($scope.invoiceProperty('dueDate') < Date.now()) {
          $scope.dueDate = {
            over: false,
            value: $scope.invoiceProperty('dueDate')
          }
        } else {
          $scope.$emit('indicatorInvoice');
          $scope.dueDate = {
            over: true,
            value: Math.floor(($scope.invoiceProperty('dueDate') - Date.now()) / 1000 / 60 / 60 / 24)
          }
        }

        $scope.$watch('totalInvoiceSum', function () {
          $scope.$emit('calculateTotalCompanySum', $scope.totalInvoiceSum);
        });

        $scope.sentInvoice = function () {
          ReceivableService.resendInvoice($scope.invoice.id)
        };

      }]);

}());
