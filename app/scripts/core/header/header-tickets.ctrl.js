'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'ActionRightsService', 'TicketTagsService',
      function ($scope, SharedStateService, ActionRightsService, TicketTagsService) {

        $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');

        //TODO Review!!!
        $scope.ActionRightsService = ActionRightsService;

        var tags = TicketTagsService.getList($scope, function () {
          SharedStateService.getSharedState('ticketsHeader').allTags = tags.staticCopy();
        });

      }]);

}());
