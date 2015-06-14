'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.usersCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'ActionRightsService', 'TicketTagsService',
      function ($scope, SharedStateService, ActionRightsService, TicketTagsService) {

        $scope.sharedState = SharedStateService.getSharedState('usersHeader');

      }]);

}());
