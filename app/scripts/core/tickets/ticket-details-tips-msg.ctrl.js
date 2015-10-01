'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsTipsMsgCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', 'TicketTagsService', 'quicktech.common.services.PermissionsService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, TicketTagsService, PermissionsService) {

        $scope.isCanBeReOpened = function(){

          var thirtyDaysInMs = 2592000000,
            now = new Date(),
            isWithinThirtyDays;

          isWithinThirtyDays = $scope.ticketDetails.closedAt >= (now - thirtyDaysInMs);

          return isWithinThirtyDays;
        };

        $scope.markAsOpen = function(){
          TicketsService.changeStatus($scope.ticketDetails.id, 'IN_PROGRESS', function () {
            $state.go('tickets', {listType: $stateParams.listType});
          });
        }

      }]);

}());
