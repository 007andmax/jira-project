'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanTabCtrl',
    [
      '$scope', 'UsersService', 'CompaniesService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      function ($scope, UsersService, CompaniesService, DevicesService, PermissionsService) {
        var lastMasterAgentId;

        $scope.downloadAgentModel = {};
        $scope.isScanDevicesLoad = false;
        $scope.orderScanBy = 'hostName';
        $scope.usersWithEmails = UsersService.getAllByCompanyId($scope.company.id).filter(function (user) {
          return !!user.primaryEmail;
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

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToDownload || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.isShowingMailFormErrors = function (form, fieldName) {
          if (form[fieldName] && ($scope.triedToSendMail || form[fieldName].$dirty) && form[fieldName].$invalid) {
            if (form[fieldName].$error.required) {
              if (fieldName === 'email' && !$scope.downloadAgentModel.user) {
                return true
              }
            } else {
              return true;
            }
          }
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
              DevicesService.downloadAgent($scope.company.id, $scope.downloadAgentModel.username,
                $scope.downloadAgentModel.password, function () {
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
                agentName: $scope.downloadAgentModel.username,
                agentPassword: $scope.downloadAgentModel.password,
                companyId: $scope.company.id,
                email: $scope.downloadAgentModel.email
              };

              if ($scope.downloadAgentModel.user && $scope.downloadAgentModel.user.primaryEmail) {
                dto.email = $scope.downloadAgentModel.user.primaryEmail;
              }

              DevicesService.sendDownloadAgentLink(dto, function () {
                $scope.savingInProcess = false;
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

        $scope.$watch(function () {
          if ($scope.scanDevices) {
            return $scope.scanDevices.status;
          }
        }, function (val) {
          $scope.isScanDevicesLoad = val && val !== 'disabled' && val !== 'finished';
        });

      }
    ]);
}());
