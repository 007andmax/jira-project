'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCtrl',
    ['$scope', 'RightPanelService', 'quicktech.common.services.SharedStateService', 'UsersService', 'TicketsService',
      'ContactsService', 'CompaniesService',
      function ($scope, RightPanelService, SharedStateService, UsersService, TicketsService, ContactsService, CompaniesService) {

        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        $scope.workingWithIdsUsers = TicketsService.getCurrentlyWorkingWith($scope);
        $scope.vendorContacts = ContactsService.getSubscribedContactsOnTicket($scope, function () {
        //$scope.vendorContacts = ContactsService.getSubscribedContactsOnTicket(function () {
          $scope.vendorContactsLoad = true;
        });

        UsersService._addInitListener(function () {

          $scope.isRightPanelInitialized = true;

          $scope.rightPanelSharedState = SharedStateService.getSharedState('rightPanel');

          $scope.$watch('rightPanelSharedState.companyId', function (companyId) {

            if (companyId === undefined) {

              $scope.currentUserInfo = RightPanelService.getCurrentUserInfo($scope, function () {
                getTimeDifference($scope.currentUserInfo.lastUpdate)
              });

              $scope.clientCompaniesGroupedData = RightPanelService.getClientCompaniesGroupedData();

            } else if (companyId !== '') {

              $scope.companyGroupedData = RightPanelService.getOneCompanyGroupedData(companyId);

              if ($scope.rightPanelSharedState.createUserId) {
                $scope.createTicketUser = UsersService.getOneById($scope.rightPanelSharedState.createUserId);
              }

              $scope.clientCompanyInfo = RightPanelService.getClientCompanyInfo($scope, companyId)
            }

            //$scope.companyGroupedData = RightPanelService.getOneCompanyGroupedData("d0137bbc-bdd1-4d9c-abee-afbd0f7b2a5d");
            //
            //if($scope.rightPanelSharedState.createUserId){
            //  $scope.createTicketUser = UsersService.getOneById($scope.rightPanelSharedState.createUserId);
            //}
            //
            //$scope.clientCompanyInfo = RightPanelService.getClientCompanyInfo($scope, "d0137bbc-bdd1-4d9c-abee-afbd0f7b2a5d")

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
