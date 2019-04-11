'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanItemCtrl',
    [
      '$scope', 'CompaniesService', 'DevicesService', '$filter', '$uibModal', '$timeout',
      function ($scope, CompaniesService, DevicesService, $filter, $uibModal, $timeout) {

        $scope.deviceDescription = $filter('unknownFilter')($scope.device.description);
        $scope.deviceEditDescription = $scope.device.description;
        $scope.isOpenDescrDrpdwn = false;
        $scope.patternMax40 = /^.{0,40}$/;
        $scope.showEditDeviceField =  false;

        $scope.device.realTimeChecker = false;

        $scope.uninstallAgent = function () {
          if ($scope.device.status.statusValue) {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.device.deviceId);
          }
        };


        $scope.saveDescription = function (deviceDescription) {
          if (deviceDescription && deviceDescription.length > 30) {
            deviceDescription = deviceDescription.slice(0, 30);
          }

          $scope.device.savedDescription = true;

          $timeout(function() {
            $scope.device.savedDescription = false;
          }, 200)

          DevicesService.sendDescription($scope.company.id, $scope.device.id, deviceDescription, function () {
            $scope.device.description = deviceDescription;
            $scope.isEditDescrOpened = false;
          })
        };

        $scope.closeDescription = function(e, wait) {
          if (e) e.stopPropagation();

          if (wait) {
            $timeout(function() {
              if (!$scope.device.savedDescription) {
                $scope.isEditDescrOpened = false;
                $scope.device.description = $scope.device.deviceNameToRemember;
              }
            }, 100)
          } else {
            $scope.isEditDescrOpened = false;
            $scope.device.description = $scope.device.deviceNameToRemember;
          }

        }

        $scope.$on('toggleEditDeviceDescription', function (event, deviceId) {
          $scope.isEditDescrOpened = $scope.device.id === deviceId;

          if ($scope.isEditDescrOpened) {

            var vals = [$scope.device.description, $scope.device.hostName, $scope.device.ipAddress];
            for (var i = 0; i < vals.length; i++) {
              if (vals[i] && vals[i] !== 'unknown') {

                $scope.device.description = vals[i];
                break;
              }
            }

            $scope.device.deviceNameToRemember = $scope.device.description;

          }
        });

        $scope.userReadable = function (str) {
          return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
          })
        };

        $scope.getStatusClass = function () {
          if ($scope.device.changingStatus) {
            return 'status-warning';
          } else if ($scope.device.status && ($scope.device.status.statusValue || $scope.device.status.message === 'Correct')) {
            return 'status-success';
          } else {
            return 'status-danger';
          }
        };

        // var vals = [$scope.device.description, $scope.device.hostName, $scope.device.ipAddress];
        //
        // for (var i = 0; i < vals.length; i++) {
        //   if (vals[i] && vals[i] !== 'unknown') {
        //
        //     $scope.device.description = vals[i];
        //     return;
        //   }
        // }

        $scope.$watchGroup(['device.agentStatus', 'device.agentPassword.status'], function () {
          $scope.device.status = $scope.device.status || {};

          $scope.device.status.tooltip = $scope.device.agentStatusTooltip;


          if ( $scope.device.agentStatus === 'managed') {
            $scope.device.changingStatus = false;
            $scope.device.status.message = 'Managed';
            $scope.device.status.statusValue = true;
            $scope.device.status.online = true;

          } else if ($scope.device.agentStatus === 'Installed') {

            $scope.device.changingStatus = false;
            $scope.device.status.message = 'Installed';
            $scope.device.status.statusValue = true;
            $scope.device.status.online = true;

          } else if ($scope.device.agentStatus === 'Install error' ) {

            $scope.device.changingStatus = false;
            $scope.device.status.message = 'Install error';
            $scope.device.status.statusValue = false;
            $scope.device.status.online = false;

          } else if ( $scope.device.agentStatus === 'Bad password') {

            $scope.device.changingStatus = false;
            $scope.device.status.message = 'Bad password';
            $scope.device.status.statusValue = false;
            $scope.device.status.online = false;

          } else if ( $scope.device.agentStatus === 'Installing'
            || ($scope.device.agentPassword && $scope.device.agentPassword.status === 'PROCEED')) {

            $scope.device.status.message = 'Installing';
            $scope.device.changingStatus = true;

          } else if ($scope.device.agentStatus === 'init' ) {

            $scope.device.status.message = 'Copy install files';
            $scope.device.changingStatus = true;

          } else if ($scope.device.agentStatus === 'Blocked' ) {

            $scope.device.status.message = 'Blocked';
            $scope.device.changingStatus = true;

          } else {

            $scope.device.changingStatus = false;

            if ($scope.device.agentPassword && $scope.device.agentPassword.status === 'SUCCESS') {
              $scope.device.status.message = 'Correct';
            } else {
              $scope.device.status.message = 'Not Monitored';
            }
            $scope.device.status.statusValue = false;
            $scope.device.status.online = false;

          }
        });

        var unsubscribe = $scope.$on('masterAgentWrongCredentials-' + $scope.device.deviceId, function () {
          if (!$scope.modalInstance) {
            $scope.modalInstance = openChangeMasterAgentCredentialsModal($scope.device.deviceId);
          }
        });

        $scope.$on('$destroy', function () {
          unsubscribe();
        });

        function openChangeMasterAgentCredentialsModal(deviceId) {
          var modalInstance = $uibModal.open({
            templateUrl: '/ng1/scripts/core/companies/company-profile/tabs/network-scan-tab/change-credentials-modal.tpl.html',
            controller: [
              '$scope', '$uibModalInstance', 'companyId', 'discoveredByAgentId', 'deviceIds', 'DevicesService',
              function ($scope, $uibModalInstance, companyId, discoveredByAgentId, deviceIds, DevicesService) {
                $scope.dto = {
                  login: '',
                  password: '',
                  companyId: companyId,
                  discoveredByAgentId: discoveredByAgentId,
                  deviceIds: deviceIds
                };
                $scope.close = $uibModalInstance.dismiss;

                $scope.isShowingErrors = function (form, fieldName) {
                  return form[fieldName] && ($scope.triedToUpdate || form[fieldName].$dirty) && form[fieldName].$invalid;
                };

                $scope.testAndUpdateCredentials = function (form) {
                  if (form.$valid) {
                    $scope.isUpdateInProgress = true;
                    $scope.triedToUpdate = false;
                    DevicesService.testCredentials($scope.dto, function () {
                      $uibModalInstance.dismiss();
                      $scope.isUpdateInProgress = false;
                    });
                  } else {
                    $scope.triedToUpdate = true;
                  }
                };
              }
            ],
            windowClass: 'wrong-credentials-modal',
            backdrop: true,
            animation: true,
            resolve: {
              companyId: function () {
                return $scope.company.id;
              },
              discoveredByAgentId: function () {
                return $scope.discoveredByAgentId;
              },
              deviceIds: function () {
                return [deviceId];
              },
              testAndUpdateCredentials: function () {
                return $scope.testCredentials;
              }
            }
          });

          modalInstance.opened.then(function () {
            $('body').addClass('non-body-scroll');
          });

          modalInstance.result.finally(function () {
            $('body').removeClass('non-body-scroll');
            $scope.modalInstance = null;
          });

          return modalInstance;
        }

      }
    ]);

}());
