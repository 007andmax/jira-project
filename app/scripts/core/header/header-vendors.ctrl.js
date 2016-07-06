'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.vendorsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'VendorsService',
      function ($scope, SharedStateService, VendorsService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.sharedState = SharedStateService.getSharedState('vendorsHeader');

        if (globalSearch.vendorFilter) {
          VendorsService.getOneById(globalSearch.vendorFilter, function (resp) {
            $scope.sharedState.filter.keyword = resp.name;
            globalSearch.vendorFilter = undefined;
          });
        }
      }]);

}());
