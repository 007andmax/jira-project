'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receiptArchive.companyCtrl',
    ['$scope',
      function ($scope) {

        $scope.showInvoices = false;

        $scope.toggleReceiptArchiveInvoices = function () {
          $scope.$broadcast('toggleReceiptArchiveInvoices');
          $scope.showInvoices = !$scope.showInvoices;
        };

        $scope.$on($scope.company.id + '-showInvoiceInCompany', function (event, invoiceId) {
          if (!$scope.showInvoices) {
            $scope.toggleReceiptArchiveInvoices();
          }
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
