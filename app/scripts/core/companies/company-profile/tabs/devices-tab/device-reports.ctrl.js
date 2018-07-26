'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.deviceReports',
    ['$scope', 'DevicesService', '$stateParams', 'quicktech.common.services.UserConfirmationsService', '$timeout', '$uibModal',
      function ($scope, DevicesService, $stateParams, UserConfirmationsService, $timeout, $uibModal) {

        var currentReport = {};
        $scope.$watch('data', function (value) {
          if (value) {
            currentReport = value[Object.keys(value)[0]];
            $scope.networkAdapter = currentReport.networkAdapters.find(function (net) {
              return net.is_default;
            });
            $scope.currentAgent = currentReport.agent;
            currentReport.editableFields = currentReport.editableFields || {};

            if (currentReport.editableFields.installDate) {
              currentReport.editableFields.installDate = new Date(currentReport.editableFields.installDate);
            }
            if (currentReport.editableFields.warrantyDate) {
              currentReport.editableFields.warrantyDate = new Date(currentReport.editableFields.warrantyDate);
            }

            $scope.dto = {
              manufacturer: currentReport.system.manufacturer,
              model: currentReport.system.model,
              serialNumber: currentReport.system.serial_number,
              assetTag: currentReport.system.asset_tag,
              installDate: currentReport.system.install_date,
              warrantyDate: currentReport.editableFields.warrantyDate,
              officeAccount: currentReport.editableFields.officeAccount,
              password: currentReport.editableFields.password,
              agentId: currentReport.agent.agentId,
              companyId: currentReport.company.id
            };
          }
        });

        $scope.parseDate = Date.parse.bind(Date);

        DevicesService.getAgentsByCompany($scope, $stateParams.companyId, function (resp) {
          $scope.agents = resp;
        });

        $scope.showPassword = function () {
          if ($scope.passwordShown || $scope.showEdit) {
            if (!$scope.showEdit) {
              $scope.dto.password = undefined;
            }
            $scope.passwordShown = !$scope.passwordShown;
          } else {
            DevicesService.reportPasswordShow($scope.dto.agentId, $scope.dto.companyId, function (resp) {
              $scope.dto.password = resp.password;
              $scope.passwordShown = !$scope.passwordShown;
            });
          }
        };

        $scope.saveEditedFields = function () {
          $scope.saveInProgress = true;
          var dto = angular.copy($scope.dto);

          if (!$scope.isInstallDateChanged) {
            $scope.isInstallDateChanged = dto.installDate !== currentReport.editableFields.installDate;
          }
          if (!$scope.isWarrantyDateChanged) {
            $scope.isWarrantyDateChanged = dto.warrantyDate !== currentReport.editableFields.warrantyDate;
          }
          if (dto.installDate) {
            dto.installDate = new Date(dto.installDate);
            dto.installDate = dto.installDate.getFullYear() + '/' + dto.installDate.getMonth() + '/' + dto.installDate.getDate();
          }

          if (dto.warrantyDate) {
            dto.warrantyDate = new Date(dto.warrantyDate);
            dto.warrantyDate = dto.warrantyDate.getFullYear() + '/' + dto.warrantyDate.getMonth() + '/' + dto.warrantyDate.getDate();
          }

          $scope.toggleEdit();

          DevicesService.saveReportEditedFields(dto, function () {
            $scope.saveInProgress = false;
            dto.installDate = new Date(dto.installDate);
            dto.warrantyDate = new Date(dto.warrantyDate);

            if ($scope.passwordShown) {
              $scope.dto.password = undefined;
              $scope.passwordShown = !$scope.passwordShown;
            }

            $timeout(function () {
              $scope.buildPdf();
            })
          });
        };

        $scope.restart = function (agent) {
          DevicesService.sendPowerAction($stateParams.companyId, agent.agentId, 'reboot');
        };

        $scope.shutdown = function (agent) {
          DevicesService.sendPowerAction($stateParams.companyId, agent.agentId, 'shutdown');
        };

        $scope.remove = function (agent) {
          var confirmMesage = 'Do you want to remove ' + (agent.hostName || agent.ip) + ' device?';
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            DevicesService.sendUninstallAgentRequest($stateParams.companyId, agent.id);
          });
        };

        $scope.findDiskByIndex = function (disks, index) {
          if (disks && disks.length) {
            return disks.find(function (disk) {
              return disk.disk_index === index;
            })
          } else {
            return {};
          }
        };

        $scope.getPrimaryPhoneNumber = function (phoneNumbers) {
          if (phoneNumbers && phoneNumbers.length) {
            var maxPriority = -1,
              primaryPhoneNumber = '';
            for (var i = 0; i < phoneNumbers.length; i++) {
              var phoneNumber = phoneNumbers[i];
              if (maxPriority === -1 || maxPriority > phoneNumber.priority) {
                maxPriority = phoneNumber.priority;
                primaryPhoneNumber = phoneNumber.number;
              }
            }
            return primaryPhoneNumber;
          } else {
            return '';
          }
        };

        $scope.formatMacAddress = function (mac) {
          if (!mac) {
            return '';
          }
          return mac.match(/.{1,2}/g).join(' ');
        };

        $scope.getFilledSpacePercents = function (size, free) {
          return Math.round((size - free) * 10 / (size || 1));
        };

        $scope.toggleEdit = function () {
          if (!$scope.dto.password) {
            DevicesService.reportPasswordShow($scope.dto.agentId, $scope.dto.companyId, function (resp) {
              $scope.dto.password = resp.password;
              $scope.showEdit = !$scope.showEdit;
            });
          } else {
            $scope.showEdit = !$scope.showEdit;
          }
        };

        $scope.setInstallDate = function (dates) {
          if (dates && dates.length) {
            $scope.dto.installDate = dates[0];
          }
        };

        $scope.setWarrantyDate = function (dates) {
          if (dates && dates.length) {
            $scope.dto.warrantyDate = dates[0];
          }
        };

        $scope.buildPdf = function () {
          var currentAgent = $scope.currentAgent;
          $scope.$broadcast('buildPdf-' + (currentAgent ? (currentAgent.hostName || currentAgent.ip) : ''));
        };

        $scope.closeReport = function () {
          $scope.close();
        };

      }]);

}());
