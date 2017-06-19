'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanTabCtrl',
    [
      '$scope', 'UsersService', 'CompaniesService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      'quicktech.common.services.UserNotificationService', 'Utils',
      function ($scope, UsersService, CompaniesService, DevicesService, PermissionsService, UserNotificationService, Utils) {
        var lastMasterAgentId;

        $scope.testCredentialsModel = {};
        $scope.downloadAgentModel = {};
        $scope.isAllSelected = false;
        $scope.selectedDevices = {};
        $scope.isScanDevicesLoad = false;
        $scope.orderScanBy = 'hostName';
        $scope.usersWithEmails = UsersService.getAllByCompanyId($scope.company.id).filter(function (user) {
          return !!user.primaryEmail;
        });

        DevicesService.getSomeInfoForDevices($scope.company.id, function (resp) {
          $scope.allowAgentInstall = resp.allowAgentInstall;
          if (resp.masterAgentId !== lastMasterAgentId) { // this check is needed when realtime comes
            lastMasterAgentId = resp.masterAgentId;
            $scope.discoveredByAgentId = lastMasterAgentId;

            if (lastMasterAgentId) {
              $scope.masterAgent = DevicesService.getOneByAgentId(lastMasterAgentId, $scope.company.id);
              $scope.lastMasterAgent = $scope.masterAgent;
            }
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

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToDownload || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.isShowingMailFormErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSendMail || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.filterUserFullName = function (value) {
          return function (item) {
            if (value && value !== '[$empty$]') {
              return $scope.getUserName(item).toLowerCase().indexOf(value.toLowerCase()) !== -1;
            }
            return true;
          };
        };

        $scope.downloadAgent = function (form) {
          if (form.$valid) {
            if (!$scope.savingInProcess) {
              $scope.triedToDownload = false;
              $scope.savingInProcess = true;
              DevicesService.downloadAgent($scope.company.id, $scope.downloadAgentModel.username || '',
                $scope.downloadAgentModel.password || '', !!$scope.downloadAgentModel.autoInstall, function () {
                  $scope.savingInProcess = false;
                  form.$setPristine();
                });
            }
          } else {
            $scope.triedToDownload = true;
          }
        };

        $scope.sendEmailWithAgent = function (form) {
          if (form.$valid) {
            if (!$scope.savingInProcess) {
              $scope.triedToSendMail = false;
              $scope.savingInProcess = true;

              var dto = {
                agentName: $scope.downloadAgentModel.username || '',
                agentPassword: $scope.downloadAgentModel.password || '',
                companyId: $scope.company.id,
                email: $scope.downloadAgentModel.email,
                autoGlobalRemoteInstall: !!$scope.downloadAgentModel.autoInstall
              };

              DevicesService.sendDownloadAgentLink(dto, function () {
                $scope.savingInProcess = false;
                $scope.downloadAgentModel.email = '';
                $scope.downloadAgentModel.showSendMailForm = false;
                UserNotificationService.show('Email was successfully sent!', true);
                form.$setPristine();
              });
            }
          } else {
            $scope.triedToSendMail = true;
          }
        };

        $scope.clearEmail = function () {
          $scope.downloadAgentModel.email = '';
        };

        $scope.toggleAll = function () {
          var devices = $scope.scanDevices.devices;
          for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            $scope.selectedDevices[device.id] = $scope.isAllSelected;
          }
        };

        $scope.checkSelection = function () {
          var keys = Object.keys($scope.selectedDevices);
          var devices = $scope.scanDevices.devices;
          if (keys.length === devices.length) {
            $scope.isAllSelected = keys.each(function (key) {
              return $scope.selectedDevices[key];
            });
          } else {
            $scope.isAllSelected = false;
          }
        };

        $scope.isDeviceSelected = function () {
          var keys = Object.keys($scope.selectedDevices);
          return keys.length && keys.some(function (key) {
              return $scope.selectedDevices[key];
            });
        };

        $scope.isAnyHasPassword = function () {
          for (var deviceId in $scope.selectedDevices) {
            if ($scope.selectedDevices[deviceId]) {
              var device = Utils.findById($scope.scanDevices.devices, deviceId);
              if (device && device.agentPassword) {
                return true;
              }
            }
          }
        };

        $scope.isAnyHasValidPassword = function () {
          for (var deviceId in $scope.selectedDevices) {
            if ($scope.selectedDevices[deviceId]) {
              var device = Utils.findById($scope.scanDevices.devices, deviceId);
              if (device && device.agentPassword && device.agentPassword.status === 'SUCCESS') {
                return true;
              }
            }
          }
        };

        $scope.testCredentials = function (form) {
          if (form.$valid) {
            $scope.isTestInProgress = true;
            $scope.triedToDownload = false;
            var deviceIds = [];
            for (var deviceId in $scope.selectedDevices) {
              if ($scope.selectedDevices[deviceId]) {
                deviceIds.push(deviceId);
              }
            }

            if (deviceIds.length) {
              var dto = {
                login: $scope.testCredentialsModel.agentName,
                password: $scope.testCredentialsModel.agentPassword,
                companyId: $scope.company.id,
                discoveredByAgentId: $scope.discoveredByAgentId,
                deviceIds: deviceIds
              };
              DevicesService.testCredentials(dto, function () {
                $scope.isTestInProgress = false;
                $scope.testCredentialsModel = {};
                form.$setPristine();
              });
            }
          } else {
            $scope.triedToDownload = true;
          }
        };

        $scope.installAgents = function () {
          $scope.isInstallInProgress = true;

          var deviceIds = [];
          for (var deviceId in $scope.selectedDevices) {
            if ($scope.selectedDevices[deviceId]) {
              deviceIds.push(deviceId);
              $scope.selectedDevices[deviceId] = false;
            }
          }

          var dto = {
            companyId: $scope.company.id,
            deviceIds: deviceIds,
            discoveredByAgentId: $scope.discoveredByAgentId
          };
          DevicesService.sendInstallAgentRequests(dto, function () {
            $scope.isInstallInProgress = false;
          });
        };

        $scope.saveMasterAgent = function (masterAgent) {
          if (!$scope.saveMasterAgentInProgress) {
            $scope.saveMasterAgentInProgress = true;
            DevicesService.saveMasterAgent($scope.company.id, masterAgent.agentId, function () {
              $scope.saveMasterAgentInProgress = false;
            });
          }
        };

        $scope.runScanDevices = function () {
          $scope.runScan = true;
          $scope.scanDevices = {};
          $scope.discoveredByAgentId = $scope.masterAgent && $scope.masterAgent.agentId;
          $scope.lastMasterAgent = $scope.masterAgent;
          DevicesService.runScanDevices($scope, $scope.company.id, function (resp) {
            $scope.masterAgentOffline = resp.code === 400;
            if ($scope.masterAgentOffline) {
              $scope.isScanDevicesLoad = false;
            }
            $scope.runScan = false;
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

        $scope.toggleDescription = function (deviceId) {
          $scope.isEditDescrOpened = true;
          $scope.$broadcast('toggleEditDeviceDescription', deviceId);
        };

        $scope.$watch(function () {
          if ($scope.scanDevices) {
            return $scope.scanDevices.status;
          }
        }, function (val) {
          $scope.isScanDevicesLoad = val && val !== 'disabled' && val !== 'finished' || $scope.runScan;
        });

      }
    ]);
}());
