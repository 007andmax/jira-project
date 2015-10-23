'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.recentActivitiesCtrl',
    ['$scope', 'RightPanelService', 'quicktech.common.services.SharedStateService', 'UsersService', 'TicketsService', 'ContactsService',
      function ($scope, RightPanelService, SharedStateService, UsersService, TicketsService, ContactsService) {

        var params = {quantity: 4};

        $scope.activities = RightPanelService.getRecentActivities($scope, params)

      }]);

}());
