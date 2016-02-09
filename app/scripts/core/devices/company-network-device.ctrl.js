'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyNetworkDeviceCtrl',
    ['$scope', 'CompaniesService', 'DevicesService',
      function ($scope, CompaniesService, DevicesService) {

        console.log($scope.device)

        $scope.isDeviceOnline = function () {
          if ($scope.device.agentStatus && $scope.device.agentStatus !== 'unknown') {

            return $scope.device.agentStatus === 'managed';

          } else {

            return false;

          }
        };

        $scope.agentInstalled = ($scope.device.agentStatus === 'managed');

        $scope.changeAgentStatus = function () {
          $scope.changingStatus = true;

          if ($scope.agentInstalled) {
            DevicesService.sendInstallAgentRequest($scope.companyId, $scope.device.discoveredByAgentId, $scope.device.id, function (resp) {
              $scope.changingStatus = false;
              $scope.agentInstalled = ($scope.device.agentStatus === 'managed');
            })
          } else {
            DevicesService.sendUninstallAgentRequest($scope.companyId, $scope.device.discoveredByAgentId, $scope.device.deviceId, function (resp) {
              $scope.changingStatus = false;
              $scope.agentInstalled = ($scope.device.agentStatus === 'managed');
            })
          }
        }

      }]);

}());
