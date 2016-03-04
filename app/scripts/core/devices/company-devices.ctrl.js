'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyDevicesCtrl',
    ['$scope', 'DevicesService', '$stateParams', 'quicktech.common.services.SharedStateService', '$state',
      'quicktech.common.services.UserConfirmationsService', 'CompaniesService',
      function ($scope, DevicesService, $stateParams, SharedStateService, $state,
                UserConfirmationsService, CompaniesService) {

        var tabs = ['DEVICES', 'AGENTS', 'NETWORK_SCAN'],
          devicesHeaderState = SharedStateService.getSharedState('devicesHeader'),
          agentCallbackCount = 0;

        $scope.credential = {
          name: '',
          pass: ''
        };
        $scope.selectDevices = {};
        $scope.companyId = $stateParams.companyId;
        $scope.isCollapsedGraph = true;
        $scope.isScanDevicesLoad = false; // change in services
        $scope.currentOpenTab = tabs[0];
        $scope.orderScanBy = 'hostName';

        $scope.runScanDevices = function (agentId) {
          $scope.scanDevices = DevicesService.runScanDevices($scope, $scope.companyId, agentId, function () {
            console.log($scope.scanDevices)
          });
        };

        DevicesService.getAgentsByCompany($scope, $scope.companyId, function (resp) {
          $scope.agents = resp;
          if ((!$scope.agents || $scope.agents.length === 0) && agentCallbackCount === 0) {
            agentCallbackCount++;

            var message = 'The last device was deleted. Redirect to devices page';
            var confirmButton = 'OK';

            UserConfirmationsService.show(message, confirmButton, true).then(function () {
              $state.go('devices');
              $scope.$destroy();
            });

          }

          DevicesService.getMasterAgentId($scope.companyId, function (resp) {
            $scope.masterAgentId = resp.value;

            for (var i = 0; i < $scope.agents.length; i++) {
              if ($scope.agents[i].id === $scope.masterAgentId) {
                DevicesService.getLastScanDevices($scope.companyId, $scope.agents[i].agentId, function (resp) {
                  $scope.scanDevices = resp;
                });
                return;
              }
            }

          });

        });

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

        $scope.changeSelectDevices = function () {
          var selectDevicesIds = [];

          for (var deviceId in $scope.selectDevices) {
            if ($scope.selectDevices[deviceId]) {
              selectDevicesIds.push(deviceId)
            }
          }

          devicesHeaderState.checkedDevicesId = selectDevicesIds;
        };

        $scope.saveNewCredentional = function () {
          $scope.savingCredentional = true;
          CompaniesService.changeUserAndPass($scope.credential.name, $scope.credential.pass, $scope.companyId, function () {
            $scope.credential = {
              name: '',
              pass: ''
            };
            $scope.savingCredentional = false;
          })
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

      }]);

}());
