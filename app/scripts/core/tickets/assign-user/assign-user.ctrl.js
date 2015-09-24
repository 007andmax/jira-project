'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.assignUserCtrl',
    ['$scope', 'TicketsService', 'UsersService', '$stateParams', '$state',
      function ($scope, TicketsService, UsersService, $stateParams, $state) {

        $scope.userToAssign = {};
        $scope.assignToModel = '';

        if ($stateParams.listType !== 'user' && $scope.ticket.assignedUser && $scope.ticket.assignedUser.id !== $scope.currentUser.id) {
          $scope.assignedUser = UsersService.getOneById($scope.ticket.assignedUser.id);
        }

        $scope.setUserToAssign = function (user) {
          $scope.userToAssign = user;
        };

        $scope.filterAssignUser = function (item) {

          if ($scope.assignToModel && $scope.assignToModel.length > 0) {
            return ((item.firstName + ' ' + item.lastName + ' ' + item.primaryEmail).toLowerCase()).indexOf($scope.assignToModel.toLowerCase()) !== -1;
          }

          return true;
        };

        $scope.$watch('assignToModel', function (typedUserName) {

          var userName = $scope.getUserName($scope.userToAssign);

          if (typedUserName && userName && userName.toLowerCase() === typedUserName.toLowerCase()) {
            return;
          }

          $scope.userToAssign = undefined;

          for (var i = 0; i < $scope.usersCurrentCompany.length; i++) {

            var user = $scope.usersCurrentCompany[i];

            userName = $scope.getUserName(user);

            if (typedUserName && userName && userName.toLowerCase() === typedUserName.toLowerCase()) {
              $scope.userToAssign = user;
            }
          }
        });

        $scope.$watch('userToAssign.id', function (userId) {
          if (userId) {
            $scope.assignToModel = $scope.getUserName($scope.userToAssign);
          }
        });

        $scope.assignUserToTicket = function () {
          if ($scope.userToAssign && $scope.userToAssign.id) {
            TicketsService.assignTo($scope.ticket.id, $scope.userToAssign.id, function(){
              $state.go('tickets', {listType: $stateParams.listType});
            });
          }
        }

      }]);

}());
