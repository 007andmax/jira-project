'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.companyCtrl',
    ['$scope', 'CompaniesService', 'ReceivableService', '$timeout', '$rootScope',
      function ($scope, CompaniesService, ReceivableService, $timeout, $rootScope) {

        $scope.company = CompaniesService.getOneById($scope.receivableCompany.id);

        $scope.totalSum.companies[$scope.company.id] = 0;

        $scope.toggleReceivableInvoices = function () {
          $scope.$broadcast('toggleReceivableInvoices');
        };

        $scope.$on('indicatorInvoice', function () {
          $scope.showIndicator = true;
        });

        $scope.$on('calculateTotalCompanySum', function (event, data) {
          $scope.totalSum.companies[$scope.company.id] += data;
        });

        $scope.$watch('invoiceToSent[company.id].invoices', function () {
          var countObj = 0,
            companyInvoices = $scope.invoiceToSent[$scope.company.id];

          for (var invoiceId in (companyInvoices.invoices)) {
            if (companyInvoices.invoices[invoiceId]) {
              countObj++;
            }
          }
          companyInvoices.checked = ($scope.receivableCompany.invoices.length === countObj);
        }, true);

        $scope.sentInvoices = function () {
          var companyInvoices = $scope.invoiceToSent[$scope.company.id].invoices;
          var invoiceToSentId = [];
          for (var invoice in companyInvoices) {
            if (companyInvoices[invoice]) {
              invoiceToSentId.push(invoice)
            }
          }
          ReceivableService.resendInvoices(invoiceToSentId)
        };

      }]);

}());
