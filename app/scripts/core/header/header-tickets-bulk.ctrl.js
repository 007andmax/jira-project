'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsBulkCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService',
      '$timeout', 'UsersService', 'CompaniesService', 'TicketsService', '$rootScope',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, SharedStateService, PermissionsService, $timeout, UsersService,
                CompaniesService, TicketsService, $rootScope, UserConfirmationsService, UserNotificationService) {

        $scope.PermissionsService = PermissionsService;
        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
        $scope.ticketStatus = {
          IN_PROGRESS: 'IN PROGRESS',
          ON_HOLD: 'ON HOLD',
          COMPLETED: 'CLOSED'
        };

        $scope.uncheckAllTickets = function () {
          $rootScope.$broadcast('uncheckAllTickets')
        };

        $scope.changeTicketPriority = function (priority) {
          TicketsService.changePriority($scope.sharedState.checkedTicketsIds, priority, function () {
            UserNotificationService.show('The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets priorities have been change to ' + priority, true);
            $scope.uncheckAllTickets();
          });
        };

        $scope.changeTicketStatus = function (status) {
          TicketsService.changeStatus($scope.sharedState.checkedTicketsIds, status, function () {
            UserNotificationService.show('The tickets “' + $scope.sharedState.checkedTicketsIds.length + '” status has been changed to "' + $scope.ticketStatus[status] + '"', true);
            $scope.uncheckAllTickets();
          });
        };

        $scope.moveIntoSpam = function () {
          var confirmMesage = 'Do you want to ' + ($scope.currentUser.role === 'USER' ? 'report' : 'mark') + ' ' + $scope.sharedState.checkedTicketsIds.length + ' tickets as spam?',
            confirmButton = 'Spam';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {

            if ($scope.currentUser.role === "USER") {

              TicketsService.reportAsSpam($scope.sharedState.checkedTicketsIds, function () {
                UserNotificationService.show('The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets have been reported as spam', true);
                $scope.uncheckAllTickets();
              });

            } else {

              TicketsService.markAsSpam($scope.sharedState.checkedTicketsIds, function () {
                UserNotificationService.show('The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets have been marked as spam', true);
                $scope.uncheckAllTickets();
              });
            }
          });
        };

        $scope.restoreFromSpam = function () {
          TicketsService.restoreFromSpam($scope.sharedState.checkedTicketsIds, $scope.uncheckAllTickets)
        };

        $scope.moveToTrash = function (movedWay) {
          TicketsService.changeTrashFlag($scope.sharedState.checkedTicketsIds, movedWay, function () {
            if (movedWay) {
              UserNotificationService.show('The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets have been moved to Trash', true);
            }
            $scope.uncheckAllTickets()
          });
        };

        $scope.restoreTickets = function () {
          $scope.listType === 'trash' ? $scope.moveToTrash(false) : $scope.restoreFromSpam();
        };

        $scope.isMoveToTrashVisible = function () {
          if (!$scope.sharedState.checkedBillableTicket) {
            return true;
          } else if ($scope.sharedState.checkedHasInvoiceTicket) {
            return true;
          }

          return false;
        };

        $scope.deleteForever = function () {
          var confirmMesage = 'The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets will become inaccessible. Continue with permanent deletion?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            TicketsService.deleteForever($scope.sharedState.checkedTicketsIds, function () {

              UserNotificationService.show('The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets have been deleted', true);
              $scope.uncheckAllTickets()
            });
          });
        };

        $scope.$on('uncheckAllTickets', function () {
          $scope.sharedState.checkedTicketsIds = [];
        });

      }]);

}());
