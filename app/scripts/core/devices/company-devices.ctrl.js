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
        $scope.orderAgentBy = 'hostName';
        $scope.orderDevicesBy = 'hostName';

        DevicesService.getDefaultCompanyCredentials($scope.companyId, function (resp) {
          var info = resp.value.split(':');
          $scope.defaultPass = info[1] || '';
          $scope.defaultName = info[0] || '';
        });

        DevicesService.getDeviceSettingsByCompanyIdAndType($scope, $scope.companyId, 'NET_SCAN', function (resp) {
          $scope.customizeDevices = {};

          for (var i = 0, len = resp.length; i < len; i++) {
            $scope.customizeDevices[resp[i].deviceId] = {
              login: resp[i].login,
              password: resp[i].password,
              id: resp[i].id
            }
          }

        });

        DevicesService.getDeviceSettingsByCompanyIdAndType($scope, $scope.companyId, 'AGENT', function (resp) {
          $scope.customizeAgents = {};

          for (var i = 0, len = resp.length; i < len; i++) {
            $scope.customizeAgents[resp[i].deviceId] = {
              login: resp[i].login,
              password: resp[i].password,
              id: resp[i].id
            }
          }
        });

        $scope.runScanDevices = function (agentId) {
          DevicesService.runScanDevices($scope, $scope.companyId, agentId);
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
                DevicesService.getLastScanDevices($scope, $scope.companyId, $scope.agents[i].agentId, function (resp) {
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

        $scope.sortAgentTab = function (option) {
          if (option === $scope.orderAgentBy) {
            if (option[0] === '-') {
              $scope.orderAgentBy = $scope.orderAgentBy.substring(1);
            } else {
              $scope.orderAgentBy = '-' + $scope.orderAgentBy;
            }
          } else {
            $scope.orderAgentBy = option;
          }
        };

        $scope.sortDevicesTab = function (option) {
          if (option === $scope.orderDevicesBy) {
            if (option[0] === '-') {
              $scope.orderDevicesBy = $scope.orderDevicesBy.substring(1);
            } else {
              $scope.orderDevicesBy = '-' + $scope.orderDevicesBy;
            }
          } else {
            $scope.orderDevicesBy = option;
          }
        };

        $scope.$watch(function(){
          if($scope.scanDevices && $scope.scanDevices.networkScan){
            return $scope.scanDevices.networkScan.netScanStatus;
          }
        }, function(val){
          $scope.isScanDevicesLoad = val !== 'finished';
      })

      }]);

}());
