'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.activitiesCtrl',
    ['$scope', 'RightPanelService', 'quicktech.common.services.SharedStateService', 'UsersService', 'TicketsService', 'ContactsService',
      function ($scope, RightPanelService, SharedStateService, UsersService, TicketsService, ContactsService) {

        var params = {};

        $scope.activities = RightPanelService.getActivities($scope, params)

      }]);

}());
