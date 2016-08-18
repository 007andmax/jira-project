'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorsCtrl',
    ['$scope', 'VendorsService', 'UsersService', 'quicktech.common.services.SharedStateService', '$rootScope',
      function ($scope, VendorsService, UsersService, SharedStateService, $rootScope) {

        var headerSharedState = SharedStateService.getSharedState('vendorsHeader');
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.vendors = VendorsService.getAll($scope);
        $scope.user = UsersService.getCurrentUser();

        $scope.$watch('shownVendors.length', function (vendorsCount) {
          globalSearch.count = vendorsCount;
        });

        $scope.vendorsFilter = function (value) {
          if (headerSharedState.filter.vendorId) {
            return headerSharedState.filter.vendorId === value.id;
          }

          if (headerSharedState.filter.companyId) {
            return headerSharedState.filter.companyId === value.company.id;
          }
          return true;
        };

        $scope.orderCompaniesBy = function (associationsCompany) {
          return associationsCompany.company.name;
        };

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('vendorsHeader');
        });

        $scope.attachEvents = function (element) {
          $('.popover').on('mouseenter', function () {
            $rootScope.insidePopover = true;
          });
          $('.popover').on('mouseleave', function () {
            $rootScope.insidePopover = false;
            $(element).popover('hide');
          });
        };

      }]);

}());
