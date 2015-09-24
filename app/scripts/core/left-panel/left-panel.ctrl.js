'use strict';

(function () {

  var app = angular.module('quicktech');

  app.controller('quicktech.core.leftPanel.leftPanelCtrl', ['$scope', 'TicketsService', 'TicketTagsService', 'quicktech.common.services.SharedStateService', '$stateParams',
    function ($scope, TicketsService, TicketTagsService, SharedStateService, $stateParams) {

      var ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');
      $scope.ticketCounts = TicketsService.getCounts($scope);

      $scope.$watch(function () {

        if (!$stateParams.listType) {
          return 0;
        }

        return $scope.ticketCounts[$stateParams.listType.toUpperCase()];

      }, function (count) {
        ticketsHeaderState.count = count;
      })

    }]);

}());
