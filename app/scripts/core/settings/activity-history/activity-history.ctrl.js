'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.activityHistoryCtrl',
    ['$scope', 'UsersService', 'Utils',
      function ($scope, UsersService, Utils) {
        var currentDevice;

        $scope.selectedDevice = {};

        UsersService.getActivityHistory(function (resp) {
          $scope.activityHistory = resp;
          $scope.selectedDevice = currentDevice = resp.find(function (device) {
            return device.current;
          })
        });

        UsersService.get2FA(function (resp) {
          $scope.enableTwoFactorAuthentication = resp;
        });

        $scope.closeSession = function (event, device) {
          var idsForDelete;

          if (device) {
            if ($scope.selectedDevice.id === device.id) {
              $scope.selectedDevice = currentDevice;
            }

            idsForDelete = [device.id];
            Utils.deleteById($scope.activityHistory, device.id);
          } else {
            idsForDelete = [];
            for (var i = 0; i < $scope.activityHistory.length; i++) {
              var deviceId = $scope.activityHistory[i].id;
              if (deviceId !== currentDevice.id) {
                idsForDelete.push(deviceId);
              } else {
                $scope.activityHistory = [currentDevice];
                $scope.selectedDevice = currentDevice;
              }
            }
          }

          UsersService.closeSessions(idsForDelete);
          event.stopPropagation();
        };

        $scope.selectDevice = function (device) {
          $scope.selectedDevice = device;
        };

        $scope.toggle2FA = function (isEnabled) {
          UsersService.toggle2FA(isEnabled);
        };

      }]);

}());
