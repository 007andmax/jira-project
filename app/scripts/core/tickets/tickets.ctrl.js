'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketsCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', 'ActionRightsService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, ActionRightsService) {

        $scope.ActionRightsService = ActionRightsService;

        var availableTypes = ['unassigned', 'user', 'shared', 'spam'];

        if ($scope.currentUser.role === 'ADMIN' || $scope.currentUser.role === 'SUPER_TECH_ADMIN') {
          availableTypes.push('open');
          availableTypes.push('closed');
          availableTypes.push('trash');
        }

        $scope.$watch(function () {
          return $stateParams;
        }, function (stateParams) {

          if (availableTypes.indexOf(stateParams.listType) < 0) {
            $state.go('tickets', {
              listType: availableTypes[0]
            });
          } else {
            $scope.listType = stateParams.listType;
            $scope.currentOpeningTicket = stateParams.ticketId;
          }
        }, true);

        $scope.ticketStatusToCssFormat = function (status) {
          if (status === 'IN_PROGRESS') {
            return 'progress';
          } else if (status === 'COMPLETED') {
            return 'completed';
          } else if (status === 'ON_HOLD') {
            return 'onhold';
          }
        };

      }]);

}());
