'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.companies.companyProfileTabsCtrl',
    ['$scope', 'DevicesService', '$state', '$stateParams', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.UserConfirmationsService', 'CompaniesService', 'UsersService', 'SubscriptionsService',
      'Utils', 'quicktech.common.services.PermissionsService', 'ProductsService', '$rootScope',
      function ($scope, DevicesService, $state, $stateParams, SharedStateService,
                UserConfirmationsService, CompaniesService, UsersService, SubscriptionsService,
                Utils, PermissionsService, ProductsService, $rootScope) {
 
        var tabs = ['dashboard', 'users', 'devices', 'network-scan', 'products'/*, 'agents', 'settings'*/,'contracts','tickets-all'],
          devicesHeaderState = SharedStateService.getSharedState('devicesHeader');

        $scope.PermissionsService = PermissionsService;
        $scope.selectDevices = {};
       
        if (tabs.indexOf($stateParams.tabName) === -1) {
         
          $state.go('companyProfile', {tabName: 'devices-all'});
        }
        $scope.orderDevicesBy = 'hostName';
        $scope.uptimeOrder = '';
        $scope.currentOpenProfileTab = $stateParams.tabName || 'devices';

        $scope.credential = {
          name: '',
          pass: ''
        };
        $scope.companyProfileHeader = {
          selectUsersIds: [],
          selectDevicesIds: [],
          isOfflineDeviceSelected: false
        };
      
        if($scope.company) {
          $rootScope.isAgentsRequestSending = true;
          if ($scope.company.clientType.toLowerCase() === 'vendor') {
            CompaniesService.isVendorHasProducts($scope.company.id, function (resp) {
              $scope.company.hasProducts = resp.isProductExist;

              if ($scope.isHasDevices) {
                $state.go('companyProfile', {tabName: 'devices'});
              } else {
              
                $state.go('companyProfile', {tabName: PermissionsService.isAllowed('VIEW_USERS') ? 'dashboard' : 'network-scan'});
              }
            });

            ProductsService.getProductsByCompany($scope, $scope.company.id, function (resp) {
              $scope.productsData = resp;
            });
          }
          $scope.users = UsersService.getAllByCompanyId($scope.company.id);
          $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($scope.company.id, $scope);
          function getCompanyDevices() {
           
          
           // if (onGetDevicesComplated) return;
        //    onGetDevicesComplated = true;
            DevicesService.getAgentsAndReportsDataByCompanyId($scope, $scope.company.id, function (resp) {
              if (resp && resp.length) {
                //var agentsList = resp;
                // $scope.agents = agentsList.sort(function (a, b) {
                //   return a.hostName > b.hostName
                // });
                $scope.agents = resp;
  
  
                var devicesIds = [];
                $scope.agents.forEach(function (device) {
                  devicesIds.push(device.id);
                });
                $rootScope.deviceCredentialsRecived = false;
                DevicesService.getDevicesCredentials(devicesIds, $scope, function (resp) {
                  console.log("resp",resp);
                  if (resp) {
                    $scope.devicesCredentials = resp;
                    $rootScope.deviceCredentialsRecived = true;
                  }
                })
              }
  
            });
          }
         
          if ($rootScope.onInitDevciesCompleted) getCompanyDevices();
          $rootScope.$on('onDevicesComplated', function (evt, val) {
           
            getCompanyDevices();
          });
        }


        $scope.checkClientType = function(type) {
          if($scope.company && type) {
            return $scope.company.clientType.toLowerCase() === type
          }
        };
       
        $scope.getUsersNumber = function () {
          var usersInfo = {
            number: '',
            name: ''
          };
          var allUserNumber = [];
          var tabName = $scope.getOpenedTab();

          if (tabName === 'users-all') {
            allUserNumber = $scope.users.filter(function (user) {
              return !user.deletedAt
            });
            usersInfo.name = 'All Users';
            usersInfo.number = allUserNumber.length;
          } else if (tabName === 'users-managers') {
            allUserNumber = $scope.users.filter(function (user) {
              return !user.deletedAt && user.role === 'ADMIN'
            });
            usersInfo.name = 'Managers';
            usersInfo.number = allUserNumber.length;
          } else if (tabName === 'users-clients') {
            allUserNumber = $scope.users.filter(function (user) {
              return !user.deletedAt && (user.role === 'USER' || !user.role)
            });
            usersInfo.name = 'Users';
            usersInfo.number = allUserNumber.length;
          }
          return usersInfo;

        };

     /*   DevicesService.getAgentsAndReportsDataByCompanyId($scope, $stateParams.companyId, function (resp) {
          if (resp && resp.length) {
            //var agentsList = resp;
            // $scope.agents = agentsList.sort(function (a, b) {
            //   return a.hostName > b.hostName
            // });
            $scope.agents = resp;


            var devicesIds = [];
            $scope.agents.forEach(function (device) {
              devicesIds.push(device.id);
            });
            $rootScope.deviceCredentialsRecived = false;
            DevicesService.getDevicesCredentials(devicesIds, $scope, function(resp){
              if(resp) {
                $scope.devicesCredentials = resp;
                $rootScope.deviceCredentialsRecived = true;
              }
            })
          }

        });*/

        $scope.$watch('agents.length', function (val) {
          if (val && (val > 0)) {
            $scope.isHasDevices = true;
          } else {
            $scope.isHasDevices = false;
            if ($scope.currentOpenProfileTab === 'devices') {
             
              if ($stateParams.tabName == 'dashboard') {
                $state.go('companyProfile', {
                  tabName: PermissionsService.isAllowed('VIEW_USERS') ? 'dashboard' : 'network-scan'
                });
              }
            
            }

          }
        });

        $scope.$watch(function () {
          return $stateParams.tabName;
        }, function (tabName, prevTab) {
          if (tabs.indexOf(tabName) < 0) {
            $scope.currentOpenProfileTab = tabs[0];
          } else {
            $scope.currentOpenProfileTab = tabName;
          }

          $scope.companyProfileHeader.unCheckAll();
        });

        $scope.getPrimaryContact = function (companyId) {
          return UsersService.getAllByCompanyId(companyId).find(function (user) {
            return user.isContact;
          });
        };

        $scope.selectAllDevices = function () {
          $scope.isSelectAllDevices = !$scope.isSelectAllDevices;

          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            if ($scope.agents[i].online) {
              $scope.selectDevices[$scope.agents[i].id] = $scope.isSelectAllDevices;
            } else {
              $scope.selectDevices[$scope.agents[i].id] = false;
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

        $scope.sortDevicesTab = function (option, uptimeOption) {
          if (option === $scope.orderDevicesBy) {
            if (option[0] === '-') {
              $scope.orderDevicesBy = $scope.orderDevicesBy.substring(1);
            } else {
              $scope.orderDevicesBy = '-' + $scope.orderDevicesBy;
            }
          } else {
            $scope.orderDevicesBy = option;
          }
          if(uptimeOption) {
            if( $scope.uptimeOrder) {
              $scope.uptimeOrder = '';
              $scope.orderDevicesBy = 'label'
            }else {
              $scope.uptimeOrder = 'timing.uptimeForOrdering';
            }
          }
        };

        $scope.changeSelectedUsers = function (selectedUsers) {
          var selectUsersIds = [];
          var selectedUsersPrimaryEmails = [];
          var selectUsersSbscr = {
            invoice: 0,
            ticket: 0,
            ticketManager: 0
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
              if (user.subscription.ticketManager) {
                selectUsersSbscr.ticketManager++;
              }
              if (user.primaryEmail && user.primaryEmail.length) {
                selectedUsersPrimaryEmails.push(user.primaryEmail);
              }

            }
          }

          $scope.companyProfileHeader.selectUsersSubscr = {
            invoice: selectUsersSbscr.invoice === selectUsersIds.length,
            ticket: selectUsersSbscr.ticket === selectUsersIds.length,
            ticketManager: selectUsersSbscr.ticketManager === selectUsersIds.length
          };

          $scope.selectedUsers['all'] = (selectUsersIds.length > 0) && (selectUsersIds.length === $scope.users.filter(function (user) {
            return !user.deletedAt;
          }).length);
          $scope.companyProfileHeader.selectUsersIds = selectUsersIds;
          $scope.companyProfileHeader.selectedUsersPrimaryEmails = selectedUsersPrimaryEmails;

        };

        $scope.selectAllUsers = function (isSelectAllUsers) {

          var users = $scope.users.filter(function (user) {
            return !user.deletedAt;
          });
          for (var i = 0, len = users.length; i < len; i++) {
            $scope.selectedUsers[users[i].id] = isSelectAllUsers;
          }

          $scope.changeSelectedUsers($scope.selectedUsers);
        };

        $scope.changeSelectDevices = function () {
          var selectDevicesIds = [];
          var countOnlineDevices = 0;

          for (var deviceId in $scope.selectDevices) {
            if ($scope.selectDevices[deviceId]) {
              for (var j = 0, le = $scope.agents.length; j < le; j++) {
                if ($scope.agents[j].id === deviceId) {
                  selectDevicesIds.push($scope.agents[j].id);
                  if($scope.agents[j].online) {
                    countOnlineDevices++
                  }
                }
              }
            }
          }

          // if ($scope.selectDevices && $scope.agents) {
          //   for (var i = 0, len = $scope.selectDevices.length; i < len; i++) {
          //     if ($scope.selectDevices[i].online) {
          //       countOnlineDevices++
          //     }
          //   }
          // }

          $scope.isSelectAllDevices = (selectDevicesIds.length > 0) && (selectDevicesIds.length === $scope.agents.length);
          $scope.companyProfileHeader.isOfflineDeviceSelected = selectDevicesIds.length !== countOnlineDevices;
          $scope.companyProfileHeader.selectDevicesIds = selectDevicesIds;
        };

        $scope.selectAllDevices = function () {
          $scope.isSelectAllDevices = !$scope.isSelectAllDevices;

          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            $scope.selectDevices[$scope.agents[i].id] = $scope.isSelectAllDevices;
          }

          $scope.changeSelectDevices();
        };

        $scope.filterDeleted = function (users) {
          return !users.deletedAt;
        };

        $scope.getTabTemplateUrl = function (tab) {
          if (tab !== 'dashboard') {
            return '/ng1/scripts/core/companies/company-profile/tabs/' + tab + '-tab/' + tab + '-tab.tpl.html';
          }  
        };

        $scope.companyProfileHeader.unCheckAll = function () {
          $scope.selectDevices = {};
          $scope.selectedUsers = {};
          $scope.changeSelectedUsers();
          $scope.changeSelectDevices();
        };

        $scope.companyProfileHeader.removeDeviceFromPage = function (idForRemove) {
          for (var i = 0; i < idForRemove.length; i++) {
            for (var j = 0; j < $scope.agents.length; j++) {
              if ($scope.agents[j].id === idForRemove[i]) {
                $scope.agents.splice(j, 1);
              }
            }
          }
        }

      }]);
}());
