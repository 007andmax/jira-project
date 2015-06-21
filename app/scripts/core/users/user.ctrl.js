'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.userCtrl',
    ['$scope',
      function ($scope) {

        $scope.startEditUser = function () {
          $scope.isEdit = true;
        };

        $scope.cancelEditUser = function () {
          $scope.isEdit = false;
        };

      }]);

}());
