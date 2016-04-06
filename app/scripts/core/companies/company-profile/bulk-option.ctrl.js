'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.bulkOptionCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'DevicesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, SubscriptionsService, DevicesService, UserConfirmationsService) {

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
          var archiver = $scope.selectUsersIds.length === 1 ? '1 user' : $scope.selectUsersIds.length + ' users';
          var confirmMesage = 'Do you want to archive ' + archiver;
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            UsersService.deleteOrArchiveUser($scope.selectUsersIds, true, function () {
              $scope.companyProfileHeader.unCheckAll();
            });
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
