'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, UserConfirmationsService) {

        $scope.ticketTags = {};
        $scope.user = UsersService.getOneById($scope.ticket.createdUser.id);
        $scope.company = CompaniesService.getOneById($scope.ticket.company.id);

        if ($scope.ticket.assignedUser && $scope.ticket.assignedUser.id) {
          $scope.assignedUser = UsersService.getOneById($scope.ticket.assignedUser.id);
        }

        $scope.setTicketTags = function () {
          for (var j = 0; j < $scope.ticket.tags.length; j++) {
            $scope.ticketTags[$scope.ticket.tags[j].id] = true;
          }
        };

        $scope.srefToDetails = function (event) {
          if (!event.originalEvent.notOpenTicketDetails) {
            $state.go('tickets.details', {ticketId: $scope.ticket.id});
          }
        };

        $scope.doNotExpandTicket = function (event) {
          event.originalEvent.notOpenTicketDetails = true;
        };

        $scope.changeTicketPriority = function (priority) {
          TicketsService.changePriority($scope.ticket.id, priority);
        };

        $scope.changeTicketStatus = function (status) {
          TicketsService.changeStatus($scope.ticket.id, status);
        };

        $scope.moveIntoSpam = function () {
          var confirmMesage = 'Do you want to ' + ($scope.currentUser.role === 'USER' ? 'report' : 'mark') + ' the ticket as spam?',
            confirmButton = 'Spam';
          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            if ($scope.currentUser.role === "USER") {
              TicketsService.reportAsSpam($scope.ticket.id);
            } else {
              TicketsService.markAsSpam($scope.ticket.id);
            }
          });
        };

        $scope.restoreFromSpam = function () {
          TicketsService.restoreFromSpam($scope.ticket.id);
        };

        $scope.moveToTrash = function (movedWay) {
          TicketsService.changeTrashFlag($scope.ticket.id, movedWay);
        };

        $scope.deleteForever = function () {
          var confirmMesage = 'The ticket will become inaccessible. Continue with permanent deletion?',
            confirmButton = 'Delete';
          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            TicketsService.deleteForever($scope.ticket.id);
          });
        };

        $scope.claimTicket = function () {
          TicketsService.assignTo($scope.ticket.id, $scope.currentUser.id, function () {
            $state.go('tickets', {listType: 'user'}).then(function () {
              $state.go('tickets.details', {ticketId: $scope.ticket.id});
            });
          });
        };

      }]);

}());
