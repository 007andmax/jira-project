'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'ActionRightsService', 'TicketTagsService', '$stateParams',
      function ($scope, SharedStateService, ActionRightsService, TicketTagsService, $stateParams) {

        var labels = {
          'unassigned': 'Unassigned Tickets'
        };

        $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');

        $scope.$watch(function () {
          return $stateParams.listType;
        }, function (filter) {

          if (filter) {
            filter = filter.toLowerCase()
          }

          $scope.headerLabel = labels[filter];

        });

        //TODO Review!!!
        $scope.ActionRightsService = ActionRightsService;

        var tags = TicketTagsService.getList($scope, function () {
          SharedStateService.getSharedState('ticketsHeader').allTags = tags.staticCopy();
        });

      }]);

}());
