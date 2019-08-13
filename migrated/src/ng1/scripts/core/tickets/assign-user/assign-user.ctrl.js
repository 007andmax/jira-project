'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.assignUserCtrl',
    ['$scope', 'TicketsService', 'UsersService', '$stateParams', '$rootScope',
      'quicktech.common.services.UserNotificationService',
      function ($scope, TicketsService, UsersService, $stateParams, $rootScope, UserNotificationService) {
        $scope.usersToAssign = [];
        $scope.userToAssign = {};
        $scope.assignToModel = '';
        console.log('$scope',$scope);
        $scope.setUserToAssign = function (user) {
          $scope.userToAssign = user;

          if (!$scope.createTicket) {
            $scope.assignUserToTicket();
          }

        };

        $scope.filterAssignUser = function (item) {

          var isAssignedUser = item.id === $scope.ticketAssignedUserId;

          if (isAssignedUser) {
            return false;
          }

          // if ($scope.assignToModel && $scope.assignToModel.length > 0) {
          //   var fullSearchFild = (item.firstName + ' ' + item.lastName + ' ' + item.primaryEmail).toLowerCase();
          //   return fullSearchFild.indexOf($scope.assignToModel.toLowerCase()) !== -1;
          // }

          return true;
        };

        // $scope.$watch()

        $scope.$watch('assignToModel', function (typedUserName) {

          var userName = $scope.getUserName($scope.userToAssign),
            currentUserName = $scope.getUserName($scope.currentUser);

          if (typedUserName && userName && userName.toLowerCase() === typedUserName.toLowerCase()) {
            return;
          }

          if(typedUserName && currentUserName && currentUserName.toLowerCase() === typedUserName.toLowerCase()){
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


          $scope.disabledAssignToButton = true;

          if (!$scope.ticketId || !$scope.userToAssign.id) return;

          TicketsService.assignTo($scope.ticketId, $scope.userToAssign.id, function () {

            $scope.disabledAssignToButton = false;

            if ($scope.isBulkOperation) {
              UserNotificationService.show('The selected tickets have been assigned to ' + $scope.getUserName($scope.userToAssign), true);
              $rootScope.$broadcast('uncheckAllTickets')

            } else {
              UserNotificationService.show('Ticket “' + $scope.ticketNumber + '” has been assigned to ' + $scope.getUserName($scope.userToAssign), true);
            }
          });
        };

      }]);

}());
