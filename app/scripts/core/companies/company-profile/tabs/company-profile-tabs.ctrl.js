'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.companies.companyProfileTabsCtrl',
    ['$scope', 'DevicesService', '$stateParams', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.UserConfirmationsService', 'CompaniesService', 'UsersService', 'SubscriptionsService', 'Utils',
      function ($scope, DevicesService, $stateParams, SharedStateService,
                UserConfirmationsService, CompaniesService, UsersService, SubscriptionsService, Utils) {

        var tabs = ['USERS', 'DEVICES', 'AGENTS', 'NETWORK_SCAN', 'SETTINGS'], /*... ['VENDORS', 'ACTIVITIES']*/
          devicesHeaderState = SharedStateService.getSharedState('devicesHeader'),
          agentCallbackCount = 0,
          lastMasterAgentId,
          tabsPathMap = {
            USERS: 'users-tab/users-tab.tpl.html',
            DEVICES: 'devices-tab/devices-tab.tpl.html',
            AGENTS: 'agents-tab/agents-tab.tpl.html',
            NETWORK_SCAN: 'network-scan-tab/network-scan-tab.tpl.html',
            SETTINGS: 'settings-tab/settings-tab.tpl.html'
          };

        $scope.selectDevices = {};
        $scope.isCollapsedGraph = true;
        $scope.isScanDevicesLoad = false; // change in services
        $scope.currentOpenTab = tabs[0];
        $scope.tabPath = tabsPathMap[$scope.currentOpenTab];
        $scope.orderScanBy = 'hostName';
        $scope.orderAgentBy = 'hostName';
        $scope.orderDevicesBy = 'hostName';

        $scope.credential = {
          name: '',
          pass: ''
        };
        $scope.companyProfileHeader = {
          selectUsersIds: [],
          selectDevicesIds: []
        };

        $scope.users = UsersService.getAllByCompanyId($scope.company.id);
        $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($scope.company.id, $scope);

        $scope.runScanDevices = function () {
          $scope.isScanDevicesLoad = true;
          DevicesService.runScanDevices($scope, $scope.company.id, function (resp) {
            $scope.masterAgentOffline = resp.code === 400;
            if ($scope.masterAgentOffline) {
              $scope.isScanDevicesLoad = false;
            }
          });
        };

        DevicesService.getAgentsByCompany($scope, $scope.company.id, function (resp) {
          $scope.agents = resp;

          if (resp && resp.length) {
            DevicesService.getAllAgentsAndLogin($scope.company.id, function (logins) {
              for (var i = 0; i < $scope.agents.length; i++) {
                var agent = $scope.agents[i];
                for (var id in logins) {
                  if (agent.id === id) {
                    agent.login = logins[id];
                  }
                }
              }
            });

            DevicesService.getSomeInfoForDevices($scope.company.id, function (resp) {
              $scope.allowAgentInstall = resp.allowAgentInstall;
              if (resp.masterAgentId !== lastMasterAgentId) {
                lastMasterAgentId = resp.masterAgentId;

                if (lastMasterAgentId) {
                  DevicesService.getLastScanDevices($scope, $scope.company.id, function (resp) {
                    $scope.scanDevices = resp;
                  });
                } else {
                  $scope.scanDevices = undefined;
                }
              }
            });
          }

        });

        $scope.toggleCollapsed = function () {
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        };

        $scope.openTab = function (tabName) {
          if ($scope.currentOpenTab === tabName) {
            return
          }

          if (tabs.indexOf(tabName) < 0) {
            $scope.currentOpenTab = tabs[0];
          } else {
            $scope.currentOpenTab = tabName;

            if (tabName === 'NETWORK_SCAN') {
              DevicesService.getAgentSettingsByCompany($scope.company.id, function (resp) {
                var isAutoRescanEnable = resp.autoScanNetwork;

                $scope.masterAgentOffline = false;
                if (isAutoRescanEnable) {
                  $scope.isScanDevicesLoad = true;
                  DevicesService.runScanDevices($scope, $scope.company.id, function (resp) {
                    $scope.masterAgentOffline = resp.code === 400;
                  });
                }
              });
            }
          }

          $scope.companyProfileHeader.unCheckAll();
          $scope.tabPath = tabsPathMap[$scope.currentOpenTab];
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
          CompaniesService.changeUserAndPass($scope.credential.name, $scope.credential.pass, $scope.company.id, function () {
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

        $scope.changeSelectedUsers = function () {
          var selectUsersIds = [];
          var selectUsersSbscr = {
            invoice: 0,
            ticket: 0
          };

          for (var userId in $scope.selectedUsers) {
            if ($scope.selectedUsers[userId]) {
              selectUsersIds.push(userId);

              var user = Utils.findById($scope.users, userId);

              if (user.subscription.invoice) {
                selectUsersSbscr.invoice++;
              }
              if (user.subscription.ticket) {
                selectUsersSbscr.ticket++;
              }

            }
          }

          $scope.companyProfileHeader.selectUsersSubscr = {
            invoice: selectUsersSbscr.invoice === selectUsersIds.length,
            ticket: selectUsersSbscr.ticket === selectUsersIds.length
          };

          $scope.isSelectAllUsers = (selectUsersIds.length > 0) && (selectUsersIds.length === $scope.users.length);
          $scope.companyProfileHeader.selectUsersIds = selectUsersIds;
        };

        $scope.selectAllUsers = function () {
          $scope.isSelectAllUsers = !$scope.isSelectAllUsers;

          for (var i = 0, len = $scope.users.length; i < len; i++) {
            $scope.selectedUsers[$scope.users[i].id] = $scope.isSelectAllUsers;
          }

          $scope.changeSelectedUsers();
        };

        $scope.changeSelectDevices = function () {
          var selectDevicesIds = [];
          var countOnlineDevices = 0;

          for (var deviceId in $scope.selectDevices) {
            if ($scope.selectDevices[deviceId]) {
              selectDevicesIds.push(deviceId)
            }
          }

          if ($scope.agents) {
            for (var i = 0, len = $scope.agents.length; i < len; i++) {
              if ($scope.agents[i].online) {
                countOnlineDevices++
              }
            }
          }

          $scope.isSelectAllDevices = (selectDevicesIds.length > 0) && (selectDevicesIds.length === countOnlineDevices);
          $scope.companyProfileHeader.selectDevicesIds = selectDevicesIds;
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

        $scope.companyProfileHeader.unCheckAll = function () {
          $scope.selectDevices = {};
          $scope.selectedUsers = {};
          $scope.changeSelectedUsers();
          $scope.changeSelectDevices();
        };

        $scope.$watch('agents.length', function (val) {
          if (val && (val > 0)) {
            $scope.isHasDevices = true;
          } else {
            $scope.isHasDevices = false;
            $scope.openTab('USERS');
          }
        })

      }]);
}());
