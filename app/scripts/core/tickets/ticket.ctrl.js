'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams) {

        $scope.ticketTags = {};
        $scope.user = UsersService.getOneById($scope.ticket.createdUser.id);
        $scope.company = CompaniesService.getOneById($scope.ticket.company.id);

        (function setTicketTags() {
          for (var j = 0; j < $scope.ticket.tags.length; j++) {
            $scope.ticketTags[$scope.ticket.tags[j].id] = true;
          }
        })();

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

        $scope.moveIntoSpam = function (movedWay) {
          TicketsService.changeSpamFlag($scope.ticket.id, movedWay);
        };

        $scope.moveToTrash = function (movedWay) {
          TicketsService.changeTrashFlag($scope.ticket.id, movedWay);
        };

        $scope.deleteForever = function () {
          TicketsService.deleteForever($scope.ticket.id);
        };

        $scope.claimTicket = function () {
          TicketsService.assignTo($scope.ticket.id, $scope.currentUser.id)
        };

      }]);

}());
