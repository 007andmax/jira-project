'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyDevicesCtrl',
    ['$scope', 'DevicesService', '$stateParams',
      function ($scope, DevicesService, $stateParams) {

        var tabs = ['DEVICES', 'AGENTS', 'NETWORK_SCAN']

        $scope.companyId = $stateParams.companyId
        $scope.isCollapsedGraph = true;
        $scope.currentOpenTab = tabs[0];

        $scope.agents = DevicesService.getAgents($scope, $scope.companyId, function () {
          console.log($scope.agents)

          if ($scope.agents && $scope.agents[$stateParams.companyId][0]) {
            $scope.scanDevices($scope.agents[$stateParams.companyId][0].agentId, false)
          }

        });

        $scope.scanDevices = function (agentId, refresh) {
          $scope.scanDevices = DevicesService.scanDevices($scope, $scope.companyId, agentId, refresh, function () {
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
        }

      }]);

}());
