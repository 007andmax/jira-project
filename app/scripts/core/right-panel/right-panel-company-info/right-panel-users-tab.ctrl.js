'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelUsersTabCtrl',
    ['$scope', 'RightPanelService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'CompaniesService', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, RightPanelService, TicketTagsService, $stateParams, PermissionsService, CompaniesService, SharedStateService, UsersService) {

        $scope.selectedUsers = {};

        $scope.usersFilter = function (item) {

          if ($scope.searchUserKeyword && $scope.searchUserKeyword.length > 0) {
            var fullSearchFild = (item.firstName + ' ' + item.lastName).toLowerCase();
            return fullSearchFild.indexOf($scope.searchUserKeyword.toLowerCase()) !== -1;
          }
          return true;
        };

        $scope.selectAllUsers = function () {
          for (var i = 0; i < $scope.companyGroupedData.users.length; i++) {
            $scope.selectedUsers[$scope.companyGroupedData.users[i].id] = true;
          }
        };

        $scope.deleteUsers = function () {
          var deleteUsersIds = [];

          for (var userId in $scope.selectedUsers) {
            if ($scope.selectedUsers[userId]) {
              deleteUsersIds.push(userId)
            }
          }

          UsersService.deleteOrArchiveUser(deleteUsersIds, false)

        };

        $scope.$watch('selectedUsers', function () {

          for (var userId in $scope.selectedUsers) {
            if ($scope.selectedUsers[userId]) {
              $scope.isMoreActionsShow = true;
              return;
            }
          }
          $scope.isMoreActionsShow = false;
        }, true)

      }]);

}());
