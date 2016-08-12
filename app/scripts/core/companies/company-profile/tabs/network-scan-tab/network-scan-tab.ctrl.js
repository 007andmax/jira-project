'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanTabCtrl',
    ['$scope', 'CompaniesService', 'DevicesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, CompaniesService, DevicesService, UserConfirmationsService) {

        $scope.deviceStatus = {};
        $scope.deviceDescription = '';
        $scope.deviceEditDescription = $scope.device.description;
        $scope.isOpenDescrDrpdwn = false;
        $scope.patternMax40 = /^.{0,40}$/;

        $scope.changeAgentStatus = function () {
          $scope.changingStatus = true;

          if ($scope.deviceStatus.statusValue) {
            DevicesService.sendInstallAgentRequest($scope.company.id, $scope.device.discoveredByAgentId, $scope.device.id)
          } else {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.device.deviceId)
          }
        };

        $scope.saveDescription = function (option) {
          if (option === 'close') {
            $scope.deviceDescription = '';
            $scope.isOpenDescrDrpdwn = false;
            return;
          }

          $scope.disableSaveDescr = true;

          DevicesService.sendDescription($scope.company.id, $scope.device.id, $scope.deviceDescription, function () {
            $scope.device.description = $scope.deviceDescription;
            $scope.disableSaveDescr = false;
            $scope.isOpenDescrDrpdwn = false;
          })
        };

        $scope.saveEditDescription = function (option) {
          if (option === 'close') {
            $scope.deviceEditDescription = $scope.device.description;
            $scope.isOpenEditDescrDrpdwn = false;
            return;
          }

          $scope.disableEditSaveDescr = true;

          DevicesService.sendDescription($scope.company.id, $scope.device.id, $scope.deviceEditDescription, function () {
            $scope.device.description = $scope.deviceEditDescription;
            $scope.disableEditSaveDescr = false;
            $scope.isOpenEditDescrDrpdwn = false;
          })
        };

        $scope.userReadable = function (str) {
          return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
          })
        };

        $scope.$watchGroup(['device.agentStatus', 'device.message'], function () {

          if ($scope.device.agentStatus === 'installed' || $scope.device.agentStatus === 'managed') {

            $scope.changingStatus = false;

            $scope.deviceStatus.status = 'success';
            $scope.deviceStatus.statusValue = true;
            $scope.deviceStatus.online = true;

          } else if ($scope.device.agentStatus === 'error' || $scope.device.agentStatus === 'loginError') {

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
        });

      }]);

}());
