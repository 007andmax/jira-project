'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyProfileCtrl',
    ['$scope', 'CompaniesService', '$stateParams', 'quicktech.common.services.SharedStateService',
      'UsersService', 'DevicesService', 'SubscriptionsService',
      function ($scope, CompaniesService, $stateParams, SharedStateService,
                UsersService, DevicesService, SubscriptionsService) {

        var companyProfileHeader = SharedStateService.getSharedState('companyProfileHeader');

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        $scope.$watch(function () {
          return companyProfileHeader;
        }, function (val) {

          if (val.selectUsersIds.length > 0) {

            $scope.bulkOptionMode = 'USERS';
            $scope.selectUsersIds = val.selectUsersIds;
            $scope.usersSbscr = angular.copy(val.selectUsersSubscr);

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
          UsersService.changeUsersRoles($scope.selectUsersIds, role);
        };

        $scope.changeUserSubscription = function (subsc) {
          $scope.disabledSubscr = true;
          $scope.usersSbscr[subsc] = !$scope.usersSbscr[subsc];
          SubscriptionsService.changeSubscriptionsForUsers($scope.selectUsersIds, subsc, $scope.usersSbscr[subsc], function () {
            $scope.disabledSubscr = false;
          })
        };

        $scope.archiveUsers = function () {
          UsersService.deleteOrArchiveUser($scope.selectUsersIds, true, function () {
            companyProfileHeader.unCheckAll();
          });
        };

        $scope.removeDevices = function () {
          DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.selectDevicesIds);
          companyProfileHeader.unCheckAll();
        };

        $scope.shutdownDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesIds, 'shutdown');
        };

        $scope.restartDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesIds, 'reboot');
        };

        $scope.uncheckSelect = companyProfileHeader.unCheckAll;

      }]);

}());
