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

          var countObj = 0,
            companyInvoices = $scope.invoiceToSent[$scope.company.id];

          for (var invoiceId in (companyInvoices.invoices)) {

            $scope.countInvoicesInCompany++;

            if (companyInvoices.invoices[invoiceId]) {
              countObj++;
            }
          }
          companyInvoices.checked = ($scope.receivableInvoicesData.companies[$scope.company.id].length === countObj);
        }, true);

        $scope.sentInvoices = function () {
          var companyInvoices = $scope.invoiceToSent[$scope.company.id].invoices;
          var invoiceToSentId = [];
          var listInvoices = $scope.receivableInvoicesData.list;
          for (var invoice in companyInvoices) {
            if (companyInvoices[invoice]) {
              for (var i = 0; i < listInvoices.length; i++) {
                if (invoice === listInvoices[i].id) {
                  if (listInvoices[i].isRecurring) {
                    invoiceToSentId.push(listInvoices[i].invoices[listInvoices[i].invoices.length - 1].id);
                  } else {
                    invoiceToSentId.push(invoice);
                  }
                }
              }
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

        $scope.sortInvoice = function (invoice) {
          return invoice.dueDate || invoice.invoices[invoice.invoices.length - 1].dueDate;
        }

      }]);

}());
