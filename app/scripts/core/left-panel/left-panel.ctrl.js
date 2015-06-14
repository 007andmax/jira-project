'use strict';

(function () {

  var app = angular.module('quicktech');

  app.controller('quicktech.core.leftPanel.leftPanelCtrl', ['$scope', 'TicketsService', 'TicketTagsService', 'quicktech.common.services.SharedStateService', '$stateParams',
    function ($scope, TicketsService, TicketTagsService, SharedStateService, $stateParams) {

      $scope.ticketCounts = TicketsService.getCounts($scope);

      $scope.$watch(function () {
        if ($stateParams.listType) {
          return $scope.ticketCounts[$stateParams.listType.toUpperCase()];
        }
      }, function (count) {
        SharedStateService.getSharedState('ticketsHeader').count = count;
      })

    }]);

}());
