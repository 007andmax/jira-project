'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyDevicesCtrl',
    ['$scope', 'DevicesService', '$stateParams', 'quicktech.common.services.SharedStateService', '$state',
      'quicktech.common.services.UserConfirmationsService', 'CompaniesService',
      function ($scope, DevicesService, $stateParams, SharedStateService, $state,
                UserConfirmationsService, CompaniesService) {

        var tabs = ['DEVICES', 'AGENTS', 'NETWORK_SCAN', 'SETTINGS'],
          devicesHeaderState = SharedStateService.getSharedState('devicesHeader'),
          agentCallbackCount = 0,
          lastMasterAgentId;

        var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');
        rightPanelSharedState.companyId = $stateParams.companyId;

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

        $scope.runScanDevices = function () {
          DevicesService.runScanDevices($scope, $scope.companyId, function (resp) {
            $scope.masterAgentOffline = resp.code === 400;
          });
        };

        DevicesService.getAgentsByCompany($scope, $scope.companyId, function (resp) {
          $scope.agents = resp;

          if (resp && resp.length) {
            DevicesService.getAllAgentsAndLogin($scope.companyId, function (logins) {
              for (var i = 0; i < $scope.agents.length; i++) {
                var agent = $scope.agents[i];
                for (var id in logins) {
                  if (agent.id === id) {
                    agent.login = logins[id];
                  }
                }
              }
            });
          }

          if ((!$scope.agents || $scope.agents.length === 0) && agentCallbackCount === 0) {
            agentCallbackCount++;

            var message = 'The last device was deleted. Redirect to devices page';
            var confirmButton = 'OK';

            UserConfirmationsService.show(message, confirmButton, true).then(function () {
              $state.go('devices');
              $scope.$destroy();
            });

          }

        });

        DevicesService.getSomeInfoForDevices($scope.companyId, function (resp) {
          $scope.allowAgentInstall = resp.allowAgentInstall;
          if (resp.masterAgentId !== lastMasterAgentId) {
            lastMasterAgentId = resp.masterAgentId;

            DevicesService.getLastScanDevices($scope, $scope.companyId, function (resp) {
              $scope.scanDevices = resp;
            });
          }
        });

        $scope.toggleCollapsed = function () {
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        };

        $scope.openTab = function (tabName) {

          if (tabs.indexOf(tabName) < 0) {
            $scope.currentOpenTab = tabs[0];
          } else {
            $scope.currentOpenTab = tabName;

            if (tabs.indexOf(tabName) === 2) {
              DevicesService.getAgentSettingsByCompany($scope.companyId, function (resp) {
                var isAutoRescanEnable = resp.autoScanNetwork;

                if (isAutoRescanEnable) {
                  DevicesService.runScanDevices($scope, $scope.companyId, function (resp) {
                    $scope.masterAgentOffline = resp.code === 400;
                  });
                } else {
                  $scope.masterAgentOffline = false;
                }
              });
            }
          }
        };

        $scope.saveDescription = function (deviceId, description) {
          if (deviceId && description) {
            console.log('save ' + description + '; devicesId =  ' + deviceId);
          }
        };

        $scope.selectAllDevices = function () {
          $scope.isSelectAllDevices = !$scope.isSelectAllDevices;

          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            if ($scope.agents[i].online) {
              $scope.selectDevices[$scope.agents[i].agentId] = $scope.isSelectAllDevices;
            } else {
              $scope.selectDevices[$scope.agents[i].agentId] = false
            }
          }

          $scope.changeSelectDevices();
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

        $scope.ifHasAgentToScan = function () {
          if ($scope.agents) {
            for (var i = 0, len = $scope.agents.length; i < len; i++) {
              if ($scope.agents[i].agentId && ($scope.agents[i].agentId !== 'unknown') && $scope.agents[i].online) {
                return true;
              }
            }
          }
          return false;
        };

        $scope.$watch(function () {
          if ($scope.scanDevices && $scope.scanDevices.networkScan) {
            return $scope.scanDevices.networkScan.netScanStatus;
          }
        }, function (val) {
          $scope.isScanDevicesLoad = val !== 'finished';
        });

        $scope.$on('$destroy', function () {
          rightPanelSharedState.companyId = undefined;
        });

      }]);

}());
