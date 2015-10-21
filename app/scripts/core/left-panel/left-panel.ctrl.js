'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'TicketsService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      function ($scope, TicketsService, TicketTagsService, $stateParams, PermissionsService) {

        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.PermissionsService = PermissionsService;

        $scope.$watch(function () {

          if (!$stateParams.listType) {
            return 0;
          }
          return $scope.ticketCounts[$stateParams.listType.toUpperCase()];

        }, function () {
          $scope.listType = $stateParams.listType;
        })

      }]);

}());
