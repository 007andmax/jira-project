'use strict';

(function () {

  var app = angular.module('quicktech');

  app.controller('quicktech.core.leftPanel.leftPanelCtrl', ['$scope', 'TicketsService', 'TicketTagsService', 'quicktech.common.services.SharedStateService', '$stateParams',
    function ($scope, TicketsService, TicketTagsService, SharedStateService, $stateParams) {

      var ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');
      $scope.ticketCounts = TicketsService.getCounts($scope);

      $scope.$watch(function () {
        return $stateParams.listType;
      }, function (filter) {

        if (filter) {
          ticketsHeaderState.count = $scope.ticketCounts[filter.toUpperCase()];
          ticketsHeaderState.panelTitle = filter === 'user' ? 'My Tickets'
            : (filter[0].toUpperCase() + filter.substring(1, filter.length));
        }
      })

    }]);

}());
