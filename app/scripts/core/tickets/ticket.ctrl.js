'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', '$timeout',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      'DevicesService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, $timeout,
                UserConfirmationsService, UserNotificationService, DevicesService) {

        $scope.user = UsersService.getOneById($scope.ticket.createdUser.id);
        $scope.company = CompaniesService.getOneById($scope.ticket.company.id);

        DevicesService.getAgentsByCompany($scope, $scope.company.id, function (resp) {
          $scope.agentList = resp;
        });

        if ($scope.ticket.assignedUser && $scope.ticket.assignedUser.id) {
          $scope.assignedUser = UsersService.getOneById($scope.ticket.assignedUser.id);
        }

        $scope.srefToDetails = function (event) {
          if (!event.originalEvent.notOpenTicketDetails) {
            $state.go('tickets.details', { ticketId: $scope.ticket.id, remoteParams: null });
          }
        };

        $scope.doNotExpandTicket = function (event) {
          event.originalEvent.notOpenTicketDetails = true;
        };

        $scope.changeTicketPriority = function (priority, dropdowns) {
          TicketsService.changePriority($scope.ticket.id, priority, function () {
            UserNotificationService.show('The ticket “' + $scope.ticket.number + '” priority has been changed to ' + priority, true);
          });
          dropdowns[$scope.ticket.id]['priority'] = false;
        };

        $scope.changeTicketStatus = function (status, dropdowns) {
          TicketsService.changeStatus($scope.ticket.id, status, function () {
            UserNotificationService.show('The ticket “' + $scope.ticket.number + '” status has been changed to "' + $scope.userReadable(status) + '"', true);
          });
          dropdowns[$scope.ticket.id]['status'] = false;
        };

      }]);

}());
