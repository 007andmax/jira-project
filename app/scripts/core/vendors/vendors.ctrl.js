'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorsCtrl',
    ['$scope', 'VendorsService', 'UsersService', 'quicktech.common.services.SharedStateService', '$rootScope',
      function ($scope, VendorsService, UsersService, SharedStateService, $rootScope) {

        var headerSharedState = SharedStateService.getSharedState('vendorsHeader');

        $scope.vendors = VendorsService.getAll($scope);
        $scope.user = UsersService.getCurrentUser();

        $scope.$watch('vendors.length', function (vendorsCount) {
          headerSharedState.count = vendorsCount;
        });

        $scope.vendorsFilter = function (value) {
          if (headerSharedState.filter.keyword && headerSharedState.filter.keyword.length > 0) {
            return value.name.toLowerCase().indexOf(headerSharedState.filter.keyword.toLowerCase()) > -1;
          }
          return true;
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
