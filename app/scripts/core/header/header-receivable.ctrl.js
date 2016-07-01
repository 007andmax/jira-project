'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.receivableCtrl',
    ['$scope', '$rootScope', 'ReceivableService', '$stateParams', 'quicktech.common.services.SharedStateService',
      function ($scope, $rootScope, ReceivableService, $stateParams, SharedStateService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.sharedState = SharedStateService.getSharedState('receivableHeader');

        $scope.searchInvoice = ReceivableService.search;

        $scope.$watch('searchValue', function (value) {
          if (!value) {
            $scope.sharedState.filter.companyId = '';
          }
        });

        $scope.$watch(function () {
          return $stateParams.mode;
        }, function () {
          $scope.searchValue = '';
          $scope.sharedState = SharedStateService.getSharedState('receivableHeader');
        });

        $scope.isNaN = function (value) {
          return isNaN(value);
        };

        $scope.showInvoice = function (item) {
          if ($stateParams.mode === 'group-by-company') {
            if (item.name) {
              $rootScope.$broadcast(item.id + '-showReceivableCompany')
            } else {
              $rootScope.$broadcast(item.company.id + '-showInvoiceInCompany', item.id)
            }
          } else {
            if (item.name) {
              $scope.sharedState.filter.companyId = item.id;
            } else {
              $rootScope.$broadcast(item.company.id + '-showInvoiceInList', item.id)
            }
          }
        }

      }]);

}());
