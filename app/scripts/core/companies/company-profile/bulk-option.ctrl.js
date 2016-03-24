'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.bulkOptionCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'DevicesService',
      function ($scope, UsersService, SubscriptionsService, DevicesService) {

        $scope.$watch('companyProfileHeader', function (val) {

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
            $scope.companyProfileHeader.unCheckAll();
          });
        };

        $scope.removeDevices = function () {
          DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.selectDevicesIds);
          $scope.companyProfileHeader.unCheckAll();
        };

        $scope.shutdownDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesIds, 'shutdown');
        };

        $scope.restartDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesIds, 'reboot');
        };

        $scope.uncheckSelect = $scope.companyProfileHeader.unCheckAll;

      }]);

}());
