'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'TicketsService', 'TicketTagsService', 'quicktech.common.services.SharedStateService', '$stateParams', 'quicktech.common.services.PermissionsService',
      function ($scope, TicketsService, TicketTagsService, SharedStateService, $stateParams, PermissionsService) {

        var ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');
        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.PermissionsService = PermissionsService;

        $scope.$watch(function () {

          if (!$stateParams.listType) {
            return 0;
          }
          return $scope.ticketCounts[$stateParams.listType.toUpperCase()];

        }, function (count) {
          $scope.listType = $stateParams.listType;
          ticketsHeaderState.count = count;
        })

      }]);

}());
