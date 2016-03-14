'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyProfileCtrl',
    ['$scope', 'CompaniesService', '$stateParams', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, CompaniesService, $stateParams, SharedStateService, UsersService) {

        var companyProfileHeader = SharedStateService.getSharedState('companyProfileHeader');

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        $scope.$watch(function () {
          return companyProfileHeader;
        }, function (val) {

          if (val.selectUsersIds.length > 0) {

            $scope.bulkOptionMode = 'USERS';
            $scope.selectUsersIds = val.selectUsersIds;

          } else if (val.selectDevicesIds.length > 0) {

            $scope.bulkOptionMode = 'DEVICES';
            $scope.selectDevicesIds = val.selectDevicesIds;

          } else {
            $scope.bulkOptionMode = false;
            $scope.selectUsersIds = [];
            $scope.selectDevicesIds = [];
          }

        }, true);

        $scope.changeUserRole = function (role) {
          var roleMap = {};
          for (var i = 0, len = $scope.selectUsersIds.length; i < len; i++) {
            roleMap[$scope.selectUsersIds[i]] = role
          }
          UsersService.changeUsersRoles(roleMap);
        };

        $scope.changeUserSubscription = function (subsc) {
          console.log('changeUserSubscription ' + subsc);
          console.log($scope.selectUsersIds);
          //TODO
          //SubscriptionsService.saveList(userSubscriptions)
        };

        $scope.archiveUsers = function () {
          UsersService.deleteOrArchiveUser($scope.selectUsersIds, true, function(){
            companyProfileHeader.unCheckAll();
          });
        }

      }]);

}());
