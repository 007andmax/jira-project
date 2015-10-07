'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsBulkCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService', 'TicketTagsService',
      'UsersService', 'CompaniesService', 'TicketsService', '$rootScope', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, SharedStateService, PermissionsService, TicketTagsService, UsersService,
                CompaniesService, TicketsService, $rootScope, UserConfirmationsService) {

        $scope.PermissionsService = PermissionsService;
        $scope.tags = TicketTagsService.getList($scope);
        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

        $scope.uncheckAllTickets = function () {
          $rootScope.$broadcast('uncheckAllTickets')
        };

        $scope.changeTicketPriority = function (priority) {
          TicketsService.changePriority($scope.sharedState.checkedTicketsIds, priority, function () {
            $scope.uncheckAllTickets();
          });
        };

        $scope.changeTicketStatus = function (status) {
          TicketsService.changeStatus($scope.sharedState.checkedTicketsIds, status, function () {
            $scope.uncheckAllTickets();
          });
        };

        $scope.moveIntoSpam = function () {
          var confirmMesage = 'Do you want to ' + ($scope.currentUser.role === 'USER' ? 'report' : 'mark') + ' ' + $scope.sharedState.checkedTicketsIds.length + ' tickets as spam?',
            confirmButton = 'Spam';
          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            if ($scope.currentUser.role === "USER") {
              TicketsService.reportAsSpam($scope.sharedState.checkedTicketsIds, $scope.uncheckAllTickets);
            } else {
              TicketsService.markAsSpam($scope.sharedState.checkedTicketsIds, $scope.uncheckAllTickets);
            }
          });
        };

        $scope.restoreFromSpam = function () {
          TicketsService.restoreFromSpam($scope.sharedState.checkedTicketsIds, $scope.uncheckAllTickets)
        };

        $scope.moveToTrash = function (movedWay) {
          TicketsService.changeTrashFlag($scope.sharedState.checkedTicketsIds, movedWay, $scope.uncheckAllTickets);
        };

        $scope.restoreTickets = function () {
          $scope.listType === 'trash' ? $scope.moveToTrash(false) : $scope.restoreFromSpam();
        };

        $scope.deleteForever = function () {
          var confirmMesage = 'The selected ' + $scope.sharedState.checkedTicketsIds.length + ' tickets will become inaccessible. Continue with permanent deletion?',
            confirmButton = 'Delete';
          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            TicketsService.deleteForever($scope.sharedState.checkedTicketsIds, $scope.uncheckAllTickets);
          });
        };

        $scope.$on('uncheckAllTickets', function () {
          $scope.sharedState.checkedTicketsIds = [];
        })

      }]);

}());
