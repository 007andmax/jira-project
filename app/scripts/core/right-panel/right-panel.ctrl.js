'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCtrl',
    ['$scope', 'RightPanelService', 'quicktech.common.services.SharedStateService', 'UsersService', 'TicketsService',
      'quicktech.common.services.PermissionsService',
      function ($scope, RightPanelService, SharedStateService, UsersService, TicketsService, PermissionsService) {

        $scope.PermissionsService = PermissionsService;
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        $scope.workingWithIdsUsers = TicketsService.getCurrentlyWorkingWith($scope);

        UsersService._addInitListener(function () {

          $scope.isRightPanelInitialized = true;

          $scope.rightPanelSharedState = SharedStateService.getSharedState('rightPanel');

          $scope.$watch('rightPanelSharedState.companyId', function (companyId) {

            if (companyId === undefined) {

              $scope.currentUserInfo = RightPanelService.getCurrentUserInfo($scope, function () {
                getTimeDifference($scope.currentUserInfo.lastUpdate)
              });

              RightPanelService.getClientCompaniesGroupedData(function (resp) {
                $scope.clientCompaniesGroupedData = resp.filter(function (item) {
                  if (!item.company.isDefault) return item;
                });
              });

            } else if (companyId !== '') {

              $scope.companyGroupedData = RightPanelService.getOneCompanyGroupedData(companyId);

              if ($scope.rightPanelSharedState.createUserId) {
                $scope.createTicketUser = UsersService.getOneById($scope.rightPanelSharedState.createUserId);
              }

              $scope.clientCompanyInfo = RightPanelService.getClientCompanyInfo($scope, companyId)
            }

          });
        });

        function getTimeDifference(time) {
          if (!time) {
            $scope.lastUpdateInHours = 'null';
            return;
          }
          var date = new Date();
          $scope.lastUpdateInHours = ((date - time) / 3600000).toFixed(1)
        }

      }]);

}());
