'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.headerTicketsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'ActionRightsService', 'TicketTagsService',
      function ($scope, SharedStateService, ActionRightsService, TicketTagsService) {

        $scope.sharedState = SharedStateService.getSharedState('header');

        //TODO Review!!!
        $scope.ActionRightsService = ActionRightsService;

        var tags = TicketTagsService.getList($scope, function () {
          SharedStateService.getSharedState('header').allTags = tags.staticCopy();
        });

      }]);

}());
