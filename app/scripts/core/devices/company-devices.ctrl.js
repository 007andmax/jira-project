'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyDevicesCtrl',
    ['$scope', 'DevicesService', '$stateParams', 'quicktech.common.services.SharedStateService',
      function ($scope, DevicesService, $stateParams, SharedStateService) {

        var tabs = ['DEVICES', 'AGENTS', 'NETWORK_SCAN'],
          devicesHeaderState = SharedStateService.getSharedState('devicesHeader');

        $scope.selectDevices = {};
        $scope.companyId = $stateParams.companyId;
        $scope.isCollapsedGraph = true;
        $scope.currentOpenTab = tabs[0];

        $scope.agents = DevicesService.getAgentsByCompany($scope, $scope.companyId, function () {
          console.log($scope.agents)
        });

        $scope.runScanDevices = function (agentId) {
          $scope.isScanDevicesLoad = true;

          $scope.scanDevices = DevicesService.runScanDevices($scope, $scope.companyId, agentId, function () {
            $scope.isScanDevicesLoad = false;
            console.log($scope.scanDevices)
          });
        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        };

        $scope.openTab = function (tabName) {

          if (tabs.indexOf(tabName) < 0) {
            $scope.currentOpenTab = tabs[0];
          } else {
            $scope.currentOpenTab = tabName
          }
        };

        $scope.saveDescription = function (deviceId, description) {
          if (deviceId && description) {
            console.log('save ' + description + '; devicesId =  ' + deviceId);
          }
        };

        $scope.changeSelectDevices = function(){
          var selectDevicesIds = [];

          for(var deviceId in $scope.selectDevices){
            if($scope.selectDevices[deviceId]){
              selectDevicesIds.push(deviceId)
            }
          }

          devicesHeaderState.checkedDevicesId = selectDevicesIds;
        }

      }]);

}());
