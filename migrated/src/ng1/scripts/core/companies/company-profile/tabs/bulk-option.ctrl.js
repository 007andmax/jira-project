'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.bulkOptionCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'DevicesService', 'quicktech.common.services.UserConfirmationsService', '$uibModal', '$rootScope',
      function ($scope, UsersService, SubscriptionsService, DevicesService, UserConfirmationsService, $uibModal, $rootScope) {
console.log('$scope.company.id',$scope.company.id);
var onGetDevicesComplated = false;
        $scope.$watch('companyProfileHeader', function (val) {
 
          if (val.selectUsersIds.length > 0) {

            $scope.bulkOptionMode = 'users';
            $scope.selectUsersIds = val.selectUsersIds;
            $scope.usersSbscr = angular.copy(val.selectUsersSubscr);
            $scope.selectedUsersPrimaryEmails = val.selectedUsersPrimaryEmails;

          } else if (val.selectDevicesIds.length > 0) {

            $scope.bulkOptionMode = 'devices';
            $scope.selectDevicesIds = val.selectDevicesIds;
            $scope.selectDevicesAgentsId = [];
              $scope.selectDevicesIds.forEach(function(val) {
                var agent = DevicesService.getOneById(val, $scope.company.id);
                $scope.selectDevicesAgentsId.push(agent.agentId);
              })

          } else {
            $scope.bulkOptionMode = false;
            $scope.selectUsersIds = [];
            $scope.selectDevicesIds = [];
            $scope.selectDevicesAgentsId = [];
          }

        }, true);
       

        function getCompanyDevices() {
          console.log('getCompanyDevices');
          if (onGetDevicesComplated) return;
          onGetDevicesComplated  = true;
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
              DevicesService.getDevicesCredentials(devicesIds, $scope, function(resp){
                if(resp) {
                  $scope.devicesCredentials = resp;
                  $rootScope.deviceCredentialsRecived = true;
                }
              })
            }
  
          });
        }
        console.log('DevicesService.onInitCompleted',DevicesService.onInitCompleted);
        $scope.$watch('DevicesService.onInitCompleted', function (val) {
          console.log('DevicesService.onInitCompleted',val);
          if (DevicesService.onInitCompleted) getCompanyDevices();

        });
        if (DevicesService.onInitCompleted) getCompanyDevices();

        $scope.changeUserRole = function (role) {
          UsersService.changeUsersRoles($scope.selectUsersIds, role);
        };

        $scope.$watch(function() {
          return $rootScope.isAgentsRequestSending;
        }, function(val) {

          $scope.isAgentsRequestSending = val;
          console.log('agents',$scope.agents);
        })

        $scope.changeUserSubscription = function (subsc) {
          if ($scope.disabledSubscr || (subsc === 'invoice' && $scope.isInvoiceSubscriptionForbidden())) {
            return;
          }

          $scope.disabledSubscr = true;
          $scope.usersSbscr[subsc] = !$scope.usersSbscr[subsc];
          SubscriptionsService.changeSubscriptionsForUsers($scope.selectUsersIds, subsc, $scope.usersSbscr[subsc], function () {
            $scope.disabledSubscr = false;
          });
        };


        $scope.archiveUsers = function () {
          var confirmMessage = 'Do you want to archive ',
            confirmButton = 'Yes';

          confirmMessage += $scope.selectUsersIds.length === 1 ? '1 user' : $scope.selectUsersIds.length + ' users';

          UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
            try {
              UsersService.archiveUser($scope.selectUsersIds, function () {
                $scope.companyProfileHeader.unCheckAll();
              });
            } catch (err) {
              confirmButton = 'Ok';
              UserConfirmationsService.show(err, confirmButton, true);
            }
          });

        };

        $scope.removeDevices = function () {
          var confirmMessage = 'Do you want to remove ',
            confirmButton = 'Yes';
          confirmMessage += $scope.selectDevicesIds.length === 1 ? '1 device' : $scope.selectUsersIds.length + ' devices';

          function UncheckAllAndRemoveFromList() {
            $scope.companyProfileHeader.unCheckAll();
            $scope.companyProfileHeader.removeDeviceFromPage($scope.selectDevicesIds);
          }

          UserConfirmationsService.show(confirmMessage, confirmButton).then(function(){
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.selectDevicesAgentsId, UncheckAllAndRemoveFromList());
          });
        };

        $scope.shutdownDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesAgentsId, 'shutdown');
        };

        $scope.restartDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesAgentsId, 'reboot');
        };

        $scope.turnOff = function(action) {
          // console.log(action)
          var method;

          // if (action === 'restart') {
          //   method =
          // }
          $scope.turnOffAction = action;
          $uibModal.open({
            templateUrl: '/ng1/scripts/core/companies/company-profile/tabs/confirmModal.html',
            animation: true,
            backdrop: true,
            size: 'sm',
            controller: 'quicktech.core.companies.confirmModalCtrl',
            resolve: {
              action: function() {
                return action;
              },
              devices: function() {
                return $scope.selectDevicesAgentsId
              },
              companyId: function() {
                return $scope.company.id;
              }
            }
          });
        }

        $scope.getDeviceReport = function (agentIds) {
          DevicesService.getDeviceReports(agentIds, $scope.company.id, function (resp) {
            $scope.deviceReport = {};

            for (var i = 0; i < resp.reports.length; i++) {
              var report = resp.reports[i],
                agentId = report.agentId;

              delete report.agentId;
              groupSingleFields(report);
              report.agent = DevicesService.getOneById(agentId, resp.companyId);
              report.company = CompaniesService.getOneById(resp.companyId);
              report.primaryContact = $scope.getPrimaryContact(resp.companyId);
              report.address = resp.address;
              $scope.deviceReport[agentId] = report;
            }

          });
        };

        $scope.uncheckSelect = $scope.companyProfileHeader.unCheckAll;

        $scope.isInvoiceSubscriptionForbidden = function () {
          return $scope.users.filter(function (user) {
              return user.subscription && user.subscription.invoice;
            }).length === $scope.selectUsersIds.filter(function (id) {
              var user = UsersService.getOneById(id);
              return user.subscription && user.subscription.invoice;
            }).length;
        };

        function groupSingleFields(report) {
          report.general = {};
          for (var prop in report) {
            var value = report[prop];

            if (typeof value !== 'object') {
              report.general[prop] = value;
              delete report[prop];
            }
          }
        }

      }]);

}());
