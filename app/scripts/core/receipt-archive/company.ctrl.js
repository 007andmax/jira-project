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

    }]);

}());
