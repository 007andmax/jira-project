'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.deviceReports',
    ['$scope', 'DevicesService', '$stateParams', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, DevicesService, $stateParams, UserConfirmationsService) {

        var currentReport = {};
        $scope.$watch('data', function (value) {
          if (value) {
            currentReport = value[Object.keys(value)[0]];
            $scope.networkAdapter = currentReport.networkAdapters.find(function (net) {
              return net.is_default;
            });
            $scope.currentAgent = currentReport.agent;
            currentReport.variant = currentReport.variant || {};
            $scope.dto = {
              manufacturer: currentReport.variant.manufacturer,
              model: currentReport.variant.model,
              serial_number: currentReport.variant.serialNumber,
              asset_tag: currentReport.variant.assetTag,
              install_date: currentReport.variant.installDate,
              warranty_date: currentReport.variant.warrantyDate,
              account: currentReport.variant.account,
              password: currentReport.variant.password
            };
          }
        });

        $scope.parseDate = Date.parse.bind(Date);

        DevicesService.getAgentsByCompany($scope, $stateParams.companyId, function (resp) {
          $scope.agents = resp;
        });

        $scope.showPassword = function () {
          $scope.passwordShown = !$scope.passwordShown;
        };

        $scope.saveEditedFields = function () {
          $scope.saveInProgress = true;
          var dto = angular.copy($scope.dto);

          if (!$scope.isInstallDateChanged) {
            $scope.isInstallDateChanged = dto.install_date !== currentReport.variant.installDate;
          }
          if (!$scope.isWarrantyDateChanged) {
            $scope.isWarrantyDateChanged = dto.warranty_date !== currentReport.variant.warrantyDate;
          }
          if (dto.install_date) {
            dto.install_date = new Date(dto.install_date);
            dto.install_date = dto.install_date.getFullYear() + '-' + dto.install_date.getMonth() + '-' + dto.install_date.getDate();
          }

          if (dto.warranty_date) {
            dto.warranty_date = new Date(dto.warranty_date);
            dto.warranty_date = dto.warranty_date.getFullYear() + '-' + dto.warranty_date.getMonth() + '-' + dto.warranty_date.getDate();
          }

          DevicesService.saveReportEditedFields(currentReport.company.id, currentReport.agent.id, dto, function () {
            $scope.saveInProgress = false;
            dto.install_date = new Date(dto.install_date);
            dto.warranty_date = new Date(dto.warranty_date);
            $scope.toggleEdit();
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
          $scope.showEdit = !$scope.showEdit;
        };

        $scope.closeReport = function () {
          $scope.close();
        };

      }]);

}());
