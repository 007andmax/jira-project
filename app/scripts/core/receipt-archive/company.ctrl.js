'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receiptArchive.companyCtrl',
    ['$scope',
      function ($scope) {

        var showInvoices;

        $scope.toggleReceiptArchiveInvoices = function () {
          $scope.$broadcast('toggleReceiptArchiveInvoices');
          showInvoices = !showInvoices;
        };

        $scope.$on($scope.receiptArchiveCompany.id + '-showInvoiceInCompany', function (event, invoiceId) {
          if (!showInvoices) {
            $scope.toggleReceiptArchiveInvoices();
          }
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
