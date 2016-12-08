'use strict';

(function () {

  angular.module('quicktech.core.passwordManager').controller('quicktech.core.passwordManager.passwordModalCtrl',
    ['$scope', '$uibModalInstance', 'PasswordManagerService', 'CompaniesService', 'UsersService', 'DevicesService',
      'quicktech.common.services.UserConfirmationsService', 'resolvedExistedItem',
      function ($scope, $uibModalInstance, PasswordManagerService, CompaniesService, UsersService, DevicesService,
                UserConfirmationsService, resolvedExistedItem) {
        $scope.templates = [
          'Office 365 account',
          'Microsoft account',
          'Email account',
          'Hosting',
          'Device',
          'Generic',
          'Agent',
          'Local user account'
        ];
        $scope.companies = CompaniesService.getClientCompanies();
        $scope.users = UsersService.getClientUsers();
        DevicesService.getDevicesCount($scope, function (resp) {
          $scope.devicesByCompanies = resp;
          $scope.devices = [];
          for (var companyId in resp) {
            var devicesByCompany = resp[companyId];
            if (companyId !== 'staticCopy') {
              for (var i = 0; i < devicesByCompany.length; i++) {
                var device = devicesByCompany[i];
                device.companyId = companyId;
                $scope.devices.push(device);
              }
            }
          }
        });
        $scope.password = { links: [], selectionMap: {} };
        $scope.openedTab = 'user';
        $scope.userTabDisabled = false;
        $scope.deviceTabDisabled = false;
        $scope.generateRandomPassword = PasswordManagerService.generateRandomPassword;
        $scope.getLinkName = getLinkName;
        $scope.editedPassword = angular.copy(resolvedExistedItem);

        if ($scope.editedPassword && $scope.editedPassword.id) {
          var template = $scope.editedPassword.template;
          $scope.editedPassword.template = template.charAt(0) + template.slice(1).toLowerCase().split('_').join(' ');
          $scope.editedPasswordCompany = CompaniesService.getOneById($scope.editedPassword.companyId);
          PasswordManagerService.getPasswordByRecord($scope.editedPassword.id, function (resp) {
            $scope.editedPassword.password = resp.password;
          });

          var links = $scope.editedPassword.links;
          $scope.password.links = links.concat([]);
          for (var i = 0; i < links.length; i++) {
            var link = links[i];
            $scope.password.selectionMap[link.agentId || link.userId] = true;
          }
          $scope.password.companyId = $scope.editedPasswordCompany.id;
          $scope.password.firstLinkName = getLinkName($scope.password.links[0], $scope.password.companyId);
        } else {
          $scope.editedPassword = {
            template: 'Office 365 account'
          }
        }

        $scope.setOpenedTab = function (tab, isEnabled, event) {
          if (isEnabled) {
            $scope.openedTab = tab;
          }
          event.stopPropagation();
        };

        $scope.onSelectDate = function (dates) {
          $scope.editedPassword.expiredDate = dates[0];
        };

        $scope.validateLinks = function (type, item) {
          var password = $scope.password;
          var firstLink = password.links[0];

          if (!firstLink || !$scope.editedPasswordCompany) {
            if (type === 'user') {
              $scope.editedPasswordCompany = CompaniesService.getOneById(item.company.id);
            } else {
              $scope.editedPasswordCompany = CompaniesService.getOneById(item.companyId);
            }
            $scope.editedPassword.companyId = $scope.editedPasswordCompany.id;
            $scope.password.companyId = $scope.editedPasswordCompany.id;
          }

          if (password.selectionMap[item.agentId || item.id]) {
            if (firstLink) {
              if (firstLink.userId && type === 'agent' || firstLink.agentId && type === 'user') {
                clearLinks();
                password.selectionMap[item.agentId || item.id] = true;
              }
            }

            var newLink = {};
            newLink[type + 'Id'] = item.agentId || item.id;
            password.links.push(newLink);
          } else {
            for (var i = 0; i < password.links.length; i++) {
              var link = password.links[i];
              if (link.agentId === item.agentId || link.userId === item.id) {
                password.links.splice(i, 1);
                break;
              }
            }
          }

          $scope.password.firstLinkName = getLinkName($scope.password.links[0], $scope.password.companyId);
        };

        $scope.closeWindowWithConfirm = function (form) {
          var message = 'Do you want to close this window? All entered information will be lost.';
          if (isDataChanged(form)) {
            UserConfirmationsService.show(message, 'Yes').then(function () {
              $uibModalInstance.dismiss();
            });
          } else {
            $uibModalInstance.dismiss();
          }
        };

        $scope.setTemplate = function (template, form) {
          $scope.editedPassword.template = template;
          $scope.userTabDisabled = false;
          $scope.deviceTabDisabled = false;
          $scope.triedToSavePassword = false;

          if (template === 'Device') {
            $scope.userTabDisabled = true;
            clearLinks();
            $scope.openedTab = 'device';
          } else if (template === 'Email account') {
            $scope.deviceTabDisabled = true;
            clearLinks();
            $scope.openedTab = 'user';
          }

          form.$setPristine();
        };

        $scope.setCompanyId = function () {
          if ($scope.editedPasswordCompany && $scope.editedPasswordCompany.id) {
            if ($scope.editedPasswordCompany.id !== $scope.editedPassword.companyId) {
              clearLinks();
              $scope.editedPassword.companyId = $scope.editedPasswordCompany.id;
              $scope.password.companyId = $scope.editedPasswordCompany.id;
            }
          } else {
            clearLinks();
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSavePassword || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.getFormError = function (form) {
          if (form.$invalid) {
            var errors = Object.keys(form.$error),
              primaryError;

            for (var i = 0, len = errors.length; i < len; i++) {
              var error = errors[i];
              if (error === 'pattern' || error === 'number' || error === 'min' || error === 'max') {
                primaryError = error;
                break;
              }
            }

            if (primaryError === 'pattern') {
              return form.ip && from.ip.$invalid ? 'IP address has invalid format' : 'Link has invalid format';
            } else if (primaryError === 'number') {
              return 'Port must be a number';
            } else if (primaryError === 'min') {
              return 'Port mustn\'t be less then 0';
            } else if (primaryError === 'max') {
              return 'Port must be less then 65535';
            } else if (errors.indexOf('required') > -1) {
              return 'Required fields can\'t be left empty.';
            }
          }
        };

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.editedPassword.links = angular.copy($scope.password.links);
            var toSave = buildDto($scope.editedPassword);
            PasswordManagerService.save(toSave, function () {
              $uibModalInstance.dismiss();
            })
          } else {
            $scope.triedToSavePassword = true;
          }
        };

        function getLinkName(link, companyId) {
          if (!link) {
            return '';
          }

          if (link.userId) {
            var user = UsersService.getOneById(link.userId);
            if (user) {
              return $scope.getUserName(user);
            }
          } else {
            var device = DevicesService.getOneByAgentId(link.agentId, companyId);
            if (device) {
              return getDeviceName(device);
            }
          }
        }

        function buildDto(password) {
          var dto = {
            id: password.id,
            template: password.template.toUpperCase().split(' ').join('_'),
            companyId: password.companyId,
            username: password.username,
            password: password.password,
            expiredDate: formatDate(new Date(password.expiredDate))
          };

          switch (dto.template) {
            case 'OFFICE_365_ACCOUNT': {
              dto.key = password.key;
              dto.links = password.links;
              dto.url = password.url;
              dto.description = password.description;
              break;
            }
            case 'MICROSOFT_ACCOUNT': {
              dto.links = password.links;
              dto.url = password.url;
              dto.description = password.description;
              break;
            }
            case 'EMAIL_ACCOUNT':
            case 'LOCAL_USER_ACCOUNT': {
              dto.links = password.links;
              dto.description = password.description;
              break;
            }
            case 'HOSTING': {
              dto.url = password.url;
              dto.description = password.description;
              break;
            }
            case 'DEVICE': {
              dto.links = password.links;
              dto.ip = password.ip;
              dto.port = password.port;
              dto.http = password.http;
              dto.ssh = password.ssh;
              dto.telnet = password.telnet;
              dto.description = password.description;
              break;
            }
            case 'GENERIC': {
              dto.key = password.key;
              dto.links = password.links;
              dto.description = password.description;
              break;
            }
          }

          return dto;
        }

        function formatDate(date) {
          if (!date || !date.getTime()) {
            return null;
          }
          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }

        function isDataChanged(form) {
          var data = $scope.editedPassword;
          return (data.username || data.password || data.description) && (!data.id || form.$dirty);
        }

        function getDeviceName(device) {
          return device.hostName || device.ip || device.ipAddress;
        }

        function clearLinks() {
          $scope.password.links = [];
          $scope.password.selectionMap = {};
        }

      }]);

}());
