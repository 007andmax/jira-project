'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyNetworkDeviceCtrl',
    ['$scope', 'CompaniesService', 'DevicesService',
      function ($scope, CompaniesService, DevicesService) {

        $scope.deviceStatus = {};
        $scope.deviceDescription = '';
        $scope.isOpenDescrDrpdwn = false;
        $scope.patternMax40 = /^.{0,40}$/;

        $scope.changeAgentStatus = function () {
          $scope.changingStatus = true;

          if ($scope.deviceStatus.statusValue) {
            DevicesService.sendInstallAgentRequest($scope.companyId, $scope.device.discoveredByAgentId, $scope.device.id)
          } else {
            DevicesService.sendUninstallAgentRequest($scope.companyId, $scope.device.deviceId)
          }
        };

        $scope.saveDescription = function (option) {
          if (option === 'close') {
            $scope.deviceDescription = '';
            $scope.isOpenDescrDrpdwn = false;
            return;
          }

          $scope.disableSaveDescr = true;

          DevicesService.sendDescription($scope.companyId, $scope.device.id, $scope.deviceDescription, function () {
            $scope.device.description = $scope.deviceDescription;
            $scope.disableSaveDescr = false;
            $scope.isOpenDescrDrpdwn = false;
          })
        };

        $scope.$watchGroup(['device.agentStatus', 'device.message'], function () {

          if ($scope.device.agentStatus === 'installed' || $scope.device.agentStatus === 'managed') {

            $scope.changingStatus = false;

            $scope.deviceStatus.status = 'success';
            $scope.deviceStatus.statusValue = true;
            $scope.deviceStatus.online = true;

          } else if ($scope.device.agentStatus === 'error' || $scope.device.agentStatus === 'login error') {

            $scope.changingStatus = false;

            $scope.deviceStatus.status = 'error';
            $scope.deviceStatus.statusValue = false;
            $scope.deviceStatus.online = false;

          } else if ($scope.device.agentStatus === 'init' || $scope.device.agentStatus === 'inProgress') {

            $scope.changingStatus = true;

          } else {

            $scope.changingStatus = false;

            $scope.deviceStatus.status = 'success';
            $scope.deviceStatus.statusValue = false;
            $scope.deviceStatus.online = false;

          }
        })

      }]);

}());
