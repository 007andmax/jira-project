'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyListTabCtrl',
    ['$scope', 'RightPanelService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'CompaniesService', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, RightPanelService, TicketTagsService, $stateParams, PermissionsService, CompaniesService, SharedStateService, UsersService) {

        $scope.selectedCompanyUsers = {};

        $scope.openCompanyInfo = function (companyId) {
          $scope.currentOpenCompany = companyId;
          $scope.selectedCompanyUsers = {};
        };

        $scope.selectAllUsers = function () {
          for (var i = 0; i < $scope.clientCompaniesGroupedData.length; i++) {

            if ($scope.currentOpenCompany === $scope.clientCompaniesGroupedData[i].company.id) {

              for (var j = 0; j < $scope.clientCompaniesGroupedData[i].users.length; j++) {
                $scope.selectedCompanyUsers[$scope.clientCompaniesGroupedData[i].users[j].id] = true;
              }
              return;
            }

          }
        };

        $scope.archiveUsers = function () {
          var archiveUsersIds = [];

          for (var userId in $scope.selectedCompanyUsers) {
            if ($scope.selectedCompanyUsers[userId]) {
              archiveUsersIds.push(userId)
            }
          }

          UsersService.deleteOrArchiveUser(archiveUsersIds, true)

        };

        $scope.$watch('selectedCompanyUsers', function () {

          for (var userId in $scope.selectedCompanyUsers) {
            if ($scope.selectedCompanyUsers[userId]) {
              $scope.isMoreActionsShow = true;
              return;
            }
          }

          $scope.isMoreActionsShow = false;
        }, true)

      }]);

}());
