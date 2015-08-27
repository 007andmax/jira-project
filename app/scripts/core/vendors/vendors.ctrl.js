'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorsCtrl',
    ['$scope', 'VendorsService', 'UsersService',
      function ($scope, VendorsService, UsersService) {

        $scope.vendors = VendorsService.getAll($scope);

        $scope.user = UsersService.getCurrentUser();

      }]);

}());
