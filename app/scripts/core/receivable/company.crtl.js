'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.companyCtrl',
    ['$scope', 'ReceivableService',
      function ($scope, ReceivableService) {

        var showInvoices;

        $scope.toggleReceivableInvoices = function () {
          $scope.$broadcast('toggleReceivableInvoices');
          showInvoices = !showInvoices;
        };

        $scope.$on('indicatorInvoice', function () {
          $scope.showIndicator = true;
        });

        $scope.$watch('invoiceToSent[company.id]', function (invoices) {

          if (!invoices) {
            return;
          }

          $scope.countInvoicesInCompany = 0;

          var checkedCounter = 0,
            companyInvoices = $scope.invoiceToSent[$scope.company.id];

          for (var invoiceId in companyInvoices.invoices) {

            $scope.countInvoicesInCompany++;
            if (companyInvoices.invoices[invoiceId]) {
              checkedCounter++;
            }
          }
          companyInvoices.checked = ($scope.receivableInvoicesData.companies[$scope.company.id].length === checkedCounter);
        }, true);

        $scope.sentInvoices = function () {
          var companyInvoices = $scope.invoiceToSent[$scope.company.id].invoices,
            invoiceToSentId = [];

          for (var invoice in companyInvoices) {
            if (companyInvoices[invoice]) {
              invoiceToSentId.push(invoice);
            }
          }
          ReceivableService.resendInvoices(invoiceToSentId);
        };

        $scope.$on($scope.company.id + '-showInvoiceInCompany', function (event, invoiceId) {
          if (!showInvoices) {
            $scope.toggleReceivableInvoices();
          }
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
