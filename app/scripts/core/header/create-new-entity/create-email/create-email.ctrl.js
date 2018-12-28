'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createEmailCtrl',
    ['$scope', 'ProductsService', 'CompaniesService', '$rootScope', 'quicktech.common.services.PermissionsService',
      'TaxesService', '$timeout',
    function ($scope, ProductsService, CompaniesService, $rootScope, PermissionsService, TaxesService, $timeout) {

      console.log('create email template', $scope.selectedUsers)

      $scope.emails = [];

      if ($scope.selectedUsers) {
        $scope.selectedUsersCopy = Object.assign({}, $scope.selectedUsers);
        delete $scope.selectedUsersCopy.all;

        $scope.emails = $scope.usersCtrl.shownUsers.reduce(function(acc, el) {
          if ($scope.selectedUsersCopy[el.id]) {
            acc.push(el.primaryEmail);
          }

          return acc;
        }, [])


        console.log($scope.emails)
      }
    }]);

}());
