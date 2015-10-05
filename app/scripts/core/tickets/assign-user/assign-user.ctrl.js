'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.assignUserCtrl',
    ['$scope', 'TicketsService', 'UsersService', '$stateParams', '$state', '$rootScope',
      function ($scope, TicketsService, UsersService, $stateParams, $state, $rootScope) {

        $scope.userToAssign = {};
        $scope.assignToModel = '';

        //if ($stateParams.listType !== 'user' && $scope.ticket.assignedUser && $scope.ticket.assignedUser.id !== $scope.currentUser.id) {
        //  $scope.assignedUser = UsersService.getOneById($scope.ticket.assignedUser.id);
        //}

        $scope.setUserToAssign = function (user) {
          $scope.userToAssign = user;
        };

        $scope.filterAssignUser = function (item) {

          if(item.id === $scope.currentUser.id){
            return false;
          }

          if ($scope.assignToModel && $scope.assignToModel.length > 0) {
            var fullSearchFild = (item.firstName + ' ' + item.lastName + ' ' + item.primaryEmail).toLowerCase();
            return fullSearchFild.indexOf($scope.assignToModel.toLowerCase()) !== -1;
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
            TicketsService.assignTo($scope.ticketId, $scope.userToAssign.id, function(){
              if($scope.ticketId instanceof Array){
                $rootScope.$broadcast('uncheckAllTickets')
              }
              $state.go('tickets', {listType: $stateParams.listType});
            });
          }
        }

      }]);

}());
