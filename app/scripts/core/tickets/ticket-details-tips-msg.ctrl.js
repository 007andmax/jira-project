'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsTipsMsgCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', 'TicketTagsService', 'quicktech.common.services.PermissionsService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, TicketTagsService, PermissionsService) {

        $scope.markAsOpen = function(){
          TicketsService.changeStatus($scope.ticketDetails.id, 'IN_PROGRESS', function () {
            $state.go('tickets', {listType: $stateParams.listType});
          });
        }

      }]);

}());
