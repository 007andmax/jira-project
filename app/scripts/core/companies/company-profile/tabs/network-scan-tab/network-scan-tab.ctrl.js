'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanTabCtrl',
    [
      '$scope', 'CompaniesService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      function ($scope, CompaniesService, DevicesService, PermissionsService) {
        var lastMasterAgentId;

        $scope.isScanDevicesLoad = false; // change in services
        $scope.orderScanBy = 'hostName';

        DevicesService.getSomeInfoForDevices($scope.company.id, function (resp) {
          $scope.allowAgentInstall = resp.allowAgentInstall;
          if (resp.masterAgentId !== lastMasterAgentId) {
            lastMasterAgentId = resp.masterAgentId;

            if (lastMasterAgentId && PermissionsService.isAllowed('NETWORK_SCAN_CLIENTS')) {
              DevicesService.getLastScanDevices($scope, $scope.company.id, function (resp) {
                $scope.scanDevices = $scope.scanDevices || {};
                $scope.scanDevices.devices = resp[$scope.company.id];
                $scope.scanDevices.status = resp.status;
              });
            } else {
              $scope.scanDevices = undefined;
              $scope.isScanDevicesLoad = false;
            }
          }
        });

        $scope.runScanDevices = function () {
          $scope.isScanDevicesLoad = true;
          $scope.scanDevices = {};
          DevicesService.runScanDevices($scope, $scope.company.id, function (resp) {
            $scope.masterAgentOffline = resp.code === 400;
            if ($scope.masterAgentOffline) {
              $scope.isScanDevicesLoad = false;
            }
          });
        };

        $scope.sortNetworkScan = function (option) {
          if (option === $scope.orderScanBy) {
            if (option[0] === '-') {
              $scope.orderScanBy = $scope.orderScanBy.substring(1);
            } else {
              $scope.orderScanBy = '-' + $scope.orderScanBy;
            }
          } else {
            $scope.orderScanBy = option;
          }
        };

        $scope.$watch(function () {
          if ($scope.scanDevices) {
            return $scope.scanDevices.status;
          }
        }, function (val) {
          $scope.isScanDevicesLoad = val && val !== 'disabled' && val !== 'finished';
        });

      }
    ]);
}());
