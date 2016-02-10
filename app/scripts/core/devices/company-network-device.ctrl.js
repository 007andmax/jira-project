'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyNetworkDeviceCtrl',
    ['$scope', 'CompaniesService', 'DevicesService',
      function ($scope, CompaniesService, DevicesService) {

        $scope.deviceStatus = {};

        $scope.changeAgentStatus = function () {
          $scope.changingStatus = true;

          if ($scope.deviceStatus.statusValue) {
            DevicesService.sendInstallAgentRequest($scope.companyId, $scope.device.discoveredByAgentId, $scope.device.id, function (resp) {
              if(!($scope.device.agentStatus === 'init' || $scope.device.agentStatus === 'inProgress')){
                $scope.changingStatus = false;
              }
            })
          } else {
            DevicesService.sendUninstallAgentRequest($scope.companyId, $scope.device.discoveredByAgentId, $scope.device.deviceId, function (resp) {
              if(!($scope.device.agentStatus === 'init' || $scope.device.agentStatus === 'inProgress')){
                $scope.changingStatus = false;
              }
            })
          }
        };

        $scope.$watchGroup(['device.agentStatus', 'device.message'], function () {

          if ($scope.device.agentStatus === 'installed' || $scope.device.agentStatus === 'managed') {

            $scope.deviceStatus.status = 'success';
            $scope.deviceStatus.statusValue = true;
            $scope.deviceStatus.online = true;

          } else if ($scope.device.agentStatus === 'error' || $scope.device.agentStatus === 'login error') {

            $scope.deviceStatus.status = 'error';
            $scope.deviceStatus.statusValue = false;
            $scope.deviceStatus.online = false;

          } else {

            $scope.deviceStatus.status = 'success';
            $scope.deviceStatus.statusValue = false;
            $scope.deviceStatus.online = false;

          }
        })

      }]);

}());
