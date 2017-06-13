'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanItemCtrl',
    ['$scope', 'CompaniesService', 'DevicesService', '$filter',
      function ($scope, CompaniesService, DevicesService, $filter) {

        $scope.deviceDescription = $filter('unknownFilter')($scope.device.description);
        $scope.deviceEditDescription = $scope.device.description;
        $scope.isOpenDescrDrpdwn = false;
        $scope.patternMax40 = /^.{0,40}$/;

        $scope.uninstallAgent = function () {
          if ($scope.device.status.statusValue) {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.device.deviceId);
          }
        };

        $scope.saveDescription = function (deviceDescription) {
          DevicesService.sendDescription($scope.company.id, $scope.device.id, deviceDescription, function () {
            $scope.device.description = deviceDescription;
            $scope.isEditDescrOpened = false;
          })
        };

        $scope.$on('toggleEditDeviceDescription', function (event, deviceId) {
          $scope.isEditDescrOpened = $scope.device.id === deviceId;
        });

        $scope.userReadable = function (str) {
          return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
          })
        };

        $scope.getStatusClass = function () {
          if ($scope.device.changingStatus) {
            return 'changing-status';
          } else if ($scope.device.status && ($scope.device.status.statusValue || $scope.device.status.message === 'Correct')) {
            return 'success-status';
          } else {
            return 'error-status';
          }
        };

        $scope.$watchGroup(['device.agentStatus', 'device.agentPassword.status'], function () {
          $scope.device.status = $scope.device.status || {};

          if ($scope.device.agentStatus === 'installed' || $scope.device.agentStatus === 'managed') {

            $scope.device.changingStatus = false;

            $scope.device.status.message = 'Managed';
            $scope.device.status.statusValue = true;
            $scope.device.status.online = true;

          } else if ($scope.device.agentPassword && $scope.device.agentPassword.status === 'FAIL') {

            $scope.device.changingStatus = false;
            $scope.device.status.message = 'Incorrect';
            $scope.device.status.statusValue = false;
            $scope.device.status.online = false;

          } else if ($scope.device.agentStatus === 'error' || $scope.device.agentStatus === 'loginError') {

            $scope.device.changingStatus = false;

            $scope.device.status.message = 'Error';
            $scope.device.status.statusValue = false;
            $scope.device.status.online = false;

          } else if ($scope.device.agentStatus === 'init' || $scope.device.agentStatus === 'inProgress'
            || ($scope.device.agentPassword && $scope.device.agentPassword.status === 'PROCEED')) {

            $scope.device.status.message = 'Changing';
            $scope.device.changingStatus = true;

          } else {

            $scope.device.changingStatus = false;

            if ($scope.device.agentPassword && $scope.device.agentPassword.status === 'SUCCESS') {
              $scope.device.status.message = 'Correct';
            } else {
              $scope.device.status.message = 'Unknown';
            }
            $scope.device.status.statusValue = false;
            $scope.device.status.online = false;

          }
        });

      }]);

}());
