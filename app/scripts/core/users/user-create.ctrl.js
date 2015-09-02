'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.createUserCtrl',
    ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
      $rootScope.$broadcast('cancelEditForm');

      $scope.$on('cancelEditForm', function () {
        $state.go('users');
      });
    }]);

}());
