'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receiptArchive.companyCtrl',
    ['$scope', '$timeout',
      function ($scope, $timeout) {

        $scope.showInvoices = false;

        $scope.toggleReceiptArchiveInvoices = function () {
          $scope.$broadcast('toggleReceiptArchiveInvoices');
          $scope.showInvoices = !$scope.showInvoices;
        };

        $scope.$on($scope.company.id + '-showReceiptArchiveCompany', function () {
          $scope.$broadcast('showReceiptArchiveCompany-' + $scope.company.id);
          $timeout(function () {
            $scope.setHighlightInvoiceId();
          }, 3000);

          if (!$scope.showInvoices) {
            $scope.toggleReceiptArchiveInvoices();
          }
        });

        $scope.$on($scope.company.id + '-showInvoiceInCompany', function (event, invoiceId) {
          if (!$scope.showInvoices) {
            $scope.toggleReceiptArchiveInvoices();
          }
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
