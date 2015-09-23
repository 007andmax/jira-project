'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.sharedUsersCtrl',
      ['$scope', 'UsersService',
        function ($scope, UsersService) {

          $scope.user = UsersService.getOneById($scope.share ? $scope.share.user.id : $scope.sharedBetweenUser.id);

        }]);
  }()
);
