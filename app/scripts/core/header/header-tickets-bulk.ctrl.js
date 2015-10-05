'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsBulkCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService', 'TicketTagsService',
      '$stateParams', 'UsersService', 'CompaniesService', '$filter', 'TicketsService', '$rootScope',
      function ($scope, SharedStateService, PermissionsService, TicketTagsService, $stateParams, UsersService, CompaniesService, $filter, TicketsService, $rootScope) {

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

        $scope.moveIntoSpam = function (movedWay) {
          TicketsService.changeSpamFlag($scope.sharedState.checkedTicketsIds, movedWay, $scope.uncheckAllTickets);
        };

        $scope.moveToTrash = function (movedWay) {
          TicketsService.changeTrashFlag($scope.sharedState.checkedTicketsIds, movedWay, $scope.uncheckAllTickets);
        };

        $scope.restoreTickets = function () {
          $scope.listType === 'trash' ? $scope.moveToTrash(false) : $scope.moveIntoSpam(false);
        };

        $scope.deleteForever = function () {
          TicketsService.deleteForever($scope.sharedState.checkedTicketsIds, $scope.uncheckAllTickets);
        };

        $scope.$on('uncheckAllTickets', function(){
          $scope.sharedState.checkedTicketsIds = [];
        })

      }]);

}());
