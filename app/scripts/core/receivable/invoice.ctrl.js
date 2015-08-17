'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceCtrl',
    ['$scope', 'ReceivableService', '$rootScope', 'CompaniesService',
      function ($scope, ReceivableService, $rootScope, CompaniesService) {

        $scope.totalInvoiceSum = 0;

        $scope.chooseInvoice = [];

        $scope.invoiceProperty = function (property) {
          var invoice = $scope.invoice;
          return invoice.isRecurring ? invoice.invoices[invoice.invoices.length - 1][property] : invoice[property]
        };

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);

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

        if ($scope.invoice.sum !== undefined) {
          $scope.totalInvoiceSum = $scope.invoice.sum;
        } else {
          for (var i = 0; i < $scope.invoice.invoices.length; i++) {
            $scope.totalInvoiceSum += $scope.invoice.invoices[i].sum;
          }
        }

        $scope.$watch('invoiceToSent.invoices', function () {
          var countObj = 0,
            invoices = $scope.invoiceToSent.invoices;

          for (var invoiceId in invoices) {
            if (invoices[invoiceId]) {
              countObj++;
            }
          }

          $scope.invoiceToSent.chooseAll = ($scope.receivableInvoicesData.list.length === countObj );

        }, true);

        $scope.sentInvoice = function () {
          ReceivableService.resendInvoice($scope.invoice.id)
        };

      }]);

}());
