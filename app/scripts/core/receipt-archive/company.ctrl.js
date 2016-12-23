'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receiptArchive.companyCtrl',
    ['$scope', function ($scope) {

      $scope.showInvoices = false;

      $scope.toggleReceiptArchiveInvoices = function () {
        $scope.$broadcast('toggleReceiptArchiveInvoices');
        $scope.showInvoices = !$scope.showInvoices;
      };

      $scope.$watch('headerSharedState.filter.companyId', function (value) {
        if (value && !$scope.showInvoices) {
          $scope.toggleReceiptArchiveInvoices();
        }
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
        companyInvoices.checked = ($scope.receiptArchiveData.companies[$scope.company.id].length === checkedCounter);
      }, true);

    }]);

}());
