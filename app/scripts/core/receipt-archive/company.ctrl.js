'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receiptArchive.companyCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        var showInvoices;

        $scope.company = CompaniesService.getOneById($scope.receiptArchiveCompany.id);

        $scope.toggleReceiptArchiveInvoices = function () {
          $scope.$broadcast('toggleReceiptArchiveInvoices');
          showInvoices = !showInvoices;
        };

        $scope.$on($scope.company.id + '-showInvoiceInCompany', function (event, invoiceId) {
          if (!showInvoices) {
            $scope.toggleReceiptArchiveInvoices();
          }
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
