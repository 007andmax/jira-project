'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCtrl',
    ['$scope', 'RightPanelService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'CompaniesService', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, RightPanelService, TicketTagsService, $stateParams, PermissionsService, CompaniesService, SharedStateService, UsersService) {

        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        UsersService._addInitListener(function () {

          $scope.rightPanelSharedState = SharedStateService.getSharedState('rightPanel');

          $scope.$watch('rightPanelSharedState.companyId', function (companyId) {

            if (companyId === undefined) {

              $scope.currentUserInfo = RightPanelService.getCurrentUserInfo($scope, function () {
                getTimeDifference($scope.currentUserInfo.lastUpdate)
              });

              $scope.clientCompaniesGroupedData = RightPanelService.getClientCompaniesGroupedData();

            } else if (companyId !== '') {

              $scope.companyGroupedData = RightPanelService.getOneCompanyGroupedData(companyId);

              if($scope.rightPanelSharedState.createUserId){
                $scope.createTicketUser = UsersService.getOneById($scope.rightPanelSharedState.createUserId);
              }

              $scope.clientCompanyInfo = RightPanelService.getClientCompanyInfo($scope, companyId)
            }

          });
        });

        function getTimeDifference(time){
          if(!time){
            $scope.lastUpdateInHours = 'null';
            return;
          }
          var date = new Date();
          $scope.lastUpdateInHours = ((date - time)/3600000).toFixed(1)
        }

      }]);

}());
