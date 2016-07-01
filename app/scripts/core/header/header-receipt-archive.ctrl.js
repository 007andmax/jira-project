'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.receiptArchiveCtrl',
    ['$scope', '$rootScope', 'ReceiptArchiveService', '$stateParams', 'quicktech.common.services.SharedStateService',
      function ($scope, $rootScope, ReceiptArchiveService, $stateParams, SharedStateService) {

        $scope.sharedState = SharedStateService.getSharedState('receiptArchiveInvoicesHeader');

        $scope.$watch('searchValue', function (value) {
          if (!value) {
            $scope.sharedState.filter.companyId = '';
          }
        });

        $scope.$watch(function () {
          return $stateParams.mode;
        }, function () {
          $scope.searchValue = '';
          $scope.sharedState = SharedStateService.getSharedState('receiptArchiveInvoicesHeader');
        });

        $scope.isNaN = function (value) {
          return isNaN(value);
        };

        $scope.showInvoice = function (item) {
          if ($stateParams.mode === 'group-by-company') {
            if (item.name) {
              $rootScope.$broadcast(item.id + '-showReceiptArchiveCompany')
            } else {
              $rootScope.$broadcast(item.companyId + '-showInvoiceInCompany', item.id)
            }
          } else {
            if (item.name) {
              $scope.sharedState.filter.companyId = item.id;
            } else {
              $rootScope.$broadcast(item.companyId + '-showInvoiceInList', item.id)
            }
          }
        }

      }]);

}());
