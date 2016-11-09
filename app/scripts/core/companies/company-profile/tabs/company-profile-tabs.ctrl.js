'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.companies.companyProfileTabsCtrl',
    ['$scope', 'DevicesService', '$state', '$stateParams', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.UserConfirmationsService', 'CompaniesService', 'UsersService', 'SubscriptionsService',
      'Utils', 'quicktech.common.services.PermissionsService', 'ProductsService',
      function ($scope, DevicesService, $state, $stateParams, SharedStateService,
                UserConfirmationsService, CompaniesService, UsersService, SubscriptionsService,
                Utils, PermissionsService, ProductsService) {

        var tabs = ['users', 'devices', 'agents', 'network-scan', 'settings', 'products'],
          devicesHeaderState = SharedStateService.getSharedState('devicesHeader'),
          lastMasterAgentId;

        $scope.PermissionsService = PermissionsService;
        $scope.selectDevices = {};
        $scope.isCollapsedGraph = true;
        $scope.isScanDevicesLoad = false; // change in services
        if (tabs.indexOf($stateParams.tabName) === -1) {
          $state.go('companyProfile', { tabName: 'devices' });
        }
        $scope.orderScanBy = 'hostName';
        $scope.orderDevicesBy = 'hostName';
        $scope.currentOpenTab = $stateParams.tabName || 'devices';


        $scope.credential = {
          name: '',
          pass: ''
        };
        $scope.companyProfileHeader = {
          selectUsersIds: [],
          selectDevicesIds: [],
          isOfflineDeviceSelected: false
        };

        if ($scope.company.clientType.toLowerCase() === 'vendor') {
          CompaniesService.isVendorHasProducts($scope.company.id, function (resp) {
            $scope.company.hasProducts = resp.isProductExist;

            if ($scope.isHasDevices) {
              $state.go('companyProfile', { tabName: 'devices' });
            } else {
              $state.go('companyProfile', { tabName: PermissionsService.isAllowed('VIEW_USERS') ? 'users' : 'settings' });
            }
          });

          ProductsService.getProductsByCompany($scope, $scope.company.id, function (resp) {
            $scope.productsData = resp;
          });
        }

        $scope.users = UsersService.getAllByCompanyId($scope.company.id);
        $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($scope.company.id, $scope);

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
          }

        });

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

        $scope.$watch('agents.length', function (val) {
          if (val && (val > 0)) {
            $scope.isHasDevices = true;
          } else {
            $scope.isHasDevices = false;
            if ($scope.currentOpenTab !== 'users' && $scope.currentOpenTab !== 'settings' && $scope.currentOpenTab !== 'products') {
              $state.go('companyProfile', {
                tabName: PermissionsService.isAllowed('VIEW_USERS') ? 'users' : 'settings'
              });
            }

          }
        });

        $scope.$watch(function () {
          if ($scope.scanDevices) {
            return $scope.scanDevices.status;
          }
        }, function (val) {
          $scope.isScanDevicesLoad = val && val !== 'disabled' && val !== 'finished';
        });

        $scope.$watch(function () {
          return $stateParams.tabName;
        }, function (tabName, prevTab) {
          if (tabs.indexOf(tabName) < 0) {
            $scope.currentOpenTab = tabs[0];
          } else {
            $scope.currentOpenTab = tabName;

            if ((tabName === 'devices' || tabName === 'network-scan') && !$scope.isHasDevices) {
              $scope.currentOpenTab = prevTab;
            }

            if (tabName === 'network-scan' && PermissionsService.isAllowed('NETWORK_SCAN_CLIENTS')) {
              DevicesService.getAgentSettingsByCompany($scope.company.id, function (resp) {
                var isAutoRescanEnable = resp.autoScanNetwork;

                $scope.masterAgentOffline = false;
                if (isAutoRescanEnable && !$scope.isScanDevicesLoad) {
                  $scope.isScanDevicesLoad = true;
                  $scope.scanDevices = {};
                  DevicesService.runScanDevices($scope, $scope.company.id, function (resp) {
                    $scope.masterAgentOffline = resp.code === 400;
                  });
                }
              });
            }
          }

          $scope.companyProfileHeader.unCheckAll();
        });

        $scope.getPrimaryContact = function (companyId) {
          return UsersService.getAllByCompanyId(companyId).find(function (user) {
            return user.isContact;
          });
        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        };

        $scope.saveDescription = function (deviceId, description) {
          if (deviceId && description) {
            // console.log('save ' + description + '; devicesId =  ' + deviceId);
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

        $scope.changeSelectedUsers = function (selectedUsers) {
          var selectUsersIds = [];
          var selectUsersSbscr = {
            invoice: 0,
            ticket: 0
          };

          for (var userId in selectedUsers) {
            if (userId === 'all') {
              continue;
            }

            if (selectedUsers[userId]) {
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

          $scope.selectedUsers['all'] = (selectUsersIds.length > 0) && (selectUsersIds.length === $scope.users.length);
          $scope.companyProfileHeader.selectUsersIds = selectUsersIds;
        };

        $scope.selectAllUsers = function (isSelectAllUsers) {

          for (var i = 0, len = $scope.users.length; i < len; i++) {
            $scope.selectedUsers[$scope.users[i].id] = isSelectAllUsers;
          }

          $scope.changeSelectedUsers($scope.selectedUsers);
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

          $scope.isSelectAllDevices = (selectDevicesIds.length > 0) && (selectDevicesIds.length === $scope.agents.length);
          $scope.companyProfileHeader.isOfflineDeviceSelected = selectDevicesIds.length !== countOnlineDevices;
          $scope.companyProfileHeader.selectDevicesIds = selectDevicesIds;
        };

        $scope.selectAllDevices = function () {
          $scope.isSelectAllDevices = !$scope.isSelectAllDevices;

          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            $scope.selectDevices[$scope.agents[i].agentId] = $scope.isSelectAllDevices;
          }

          $scope.changeSelectDevices();
        };

        $scope.companyProfileHeader.unCheckAll = function () {
          $scope.selectDevices = {};
          $scope.selectedUsers = {};
          $scope.changeSelectedUsers();
          $scope.changeSelectDevices();
        };

      }]);
}());
