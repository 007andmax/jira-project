'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsBulkCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      '$timeout', 'UsersService', 'CompaniesService', 'TicketsService', '$rootScope',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, SharedStateService, $timeout, UsersService,
                CompaniesService, TicketsService, $rootScope, UserConfirmationsService, UserNotificationService) {

        $scope.usersCurrentCompany = UsersService.getAllByCompanyIdNonArchived(CompaniesService.getCurrentCompany().id);

        $scope.ticketStatus = {
          IN_PROGRESS: 'IN PROGRESS',
          ON_HOLD: 'ON HOLD',
          COMPLETED: 'CLOSED'
        };

        $scope.uncheckAllTickets = function () {
          $rootScope.$broadcast('uncheckAllTickets')
        };

        $scope.changeTicketPriority = function (priority) {
          TicketsService.changePriority($scope.ticketsSharedState.checkedTicketsIds, priority, function () {
            UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets priorities have been change to ' + priority, true);
            $scope.uncheckAllTickets();
          });
        };

        $scope.changeTicketStatus = function (status) {
          TicketsService.changeStatus($scope.ticketsSharedState.checkedTicketsIds, status, function () {
            UserNotificationService.show('The tickets “' + $scope.ticketsSharedState.checkedTicketsIds.length + '” status has been changed to "' + $scope.ticketStatus[status] + '"', true);
            $scope.uncheckAllTickets();
          });
        };

        $scope.moveIntoSpam = function () {
          var confirmMesage = 'Do you want to ' + ($scope.currentUser.isOwner ? 'mark' : 'report') + ' ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets as spam?',
            confirmButton = 'Spam';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {

            if ($scope.currentUser.isOwner) {

              TicketsService.markAsSpam($scope.ticketsSharedState.checkedTicketsIds, function () {
                UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets have been marked as spam', true);
                $scope.uncheckAllTickets();
              });
            } else {

              TicketsService.reportAsSpam($scope.ticketsSharedState.checkedTicketsIds, function () {
                UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets have been reported as spam', true);
                $scope.uncheckAllTickets();
              });

            }
          });
        };

        $scope.restoreFromSpam = function () {
          TicketsService.restoreFromSpam($scope.ticketsSharedState.checkedTicketsIds, $scope.uncheckAllTickets)
        };

        $scope.moveToTrash = function (movedWay) {
          TicketsService.changeTrashFlag($scope.ticketsSharedState.checkedTicketsIds, movedWay, function () {
            if (movedWay) {
              UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets have been moved to Trash', true);
            }
            $scope.uncheckAllTickets()
          });
        };

        $scope.deleteForever = function () {
          var confirmMesage = 'The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets will become inaccessible. Continue with permanent deletion?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            TicketsService.deleteForever($scope.ticketsSharedState.checkedTicketsIds, function () {

              UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets have been deleted', true);
              $scope.uncheckAllTickets()
            });
          });
        };

        $scope.bulkLinkAgent = function (ids, agentId, agentName) {
          TicketsService.changeLinkedAgent(ids, agentId, function () {
            if (agentName) {
              UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets linked agents have been change to ' + agentName, true);
            } else {
              UserNotificationService.show('The selected ' + $scope.ticketsSharedState.checkedTicketsIds.length + ' tickets agents have been unlinked', true);
            }
            $scope.uncheckAllTickets();
          });
        };

        $scope.$on('uncheckAllTickets', function () {
          $scope.ticketsSharedState.checkedTicketsIds = [];
          $scope.ticketsSharedState.selectedTickets = [];
        });

      }]);

}());
