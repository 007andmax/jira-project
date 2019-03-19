'use strict';

(function () {

  angular.module('quicktech.core.passwordManager').controller('quicktech.core.passwordManager.passwordModalCtrl',
    [
      '$scope', '$uibModalInstance', 'PasswordManagerService', 'CompaniesService', 'UsersService', 'DevicesService',
      'quicktech.common.services.UserConfirmationsService', 'resolvedExistedItem', 'isEditable', 'quicktech.common.services.SharedStateService', 'presetupCompany',
      function ($scope, $uibModalInstance, PasswordManagerService, CompaniesService, UsersService, DevicesService,
                UserConfirmationsService, resolvedExistedItem, isEditable, SharedStateService, presetupCompany) {
        $scope.editedPassword = angular.copy(resolvedExistedItem);
        $scope.presetupCompany = angular.copy(presetupCompany);
        var isEdit = resolvedExistedItem && resolvedExistedItem.id;
        $scope.isEditable = isEditable;

        $scope.passwordSharedState = SharedStateService.getSharedState('passwordsHeader');
        if($scope.passwordSharedState && $scope.passwordSharedState.filter && $scope.passwordSharedState.filter.companyId) {
          $scope.editedPasswordCompany = CompaniesService.getOneById($scope.passwordSharedState.filter.companyId)
        }
        if($scope.presetupCompany) {
          $scope.editedPasswordCompany = CompaniesService.getOneById($scope.presetupCompany.id)
        }
        $scope.templates = [
          'Office 365 account',
          'Microsoft account',
          'Email account',
          'Hosting',
          'Device',
          'Generic',
          'Agent',
          'Local user account',
          'Wifi network'
        ];
        $scope.showCompanyError = false;
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
        DevicesService.getGadgets(function (resp) {
          if (resp && resp.length) {
            $scope.gadgets = isEdit
              ?
              resp.filter(function (gadget) {
                return !gadget.deletedAt || existInPassword(gadget.id, $scope.editedPassword);
              })
              :
              resp.filter(function (gadget) {
                return !gadget.deletedAt;
              });

            var links = $scope.password.links;
            if (isEdit && links && links.length && links[0] && links[0].gadgetId) {
              $scope.password.firstLinkName = getLinkName(links[0], $scope.password.companyId);
            }
          } else {
            $scope.gadgets = [];
          }
        });

        $scope.password = { links: [], selectionMap: {} };
        $scope.openedTab = 'user';
        $scope.userTabDisabled = false;
        $scope.deviceTabDisabled = false;
        $scope.generateRandomPassword = PasswordManagerService.generateRandomPassword;
        $scope.getLinkName = getLinkName;
        $scope.getCompanyById = CompaniesService.getOneById;

        if (isEdit) {
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
            $scope.password.selectionMap[link.deviceId || link.userId || link.gadgetId] = true;
          }
          $scope.password.companyId = $scope.editedPasswordCompany.id;
          $scope.password.firstLinkName = getLinkName($scope.password.links[0], $scope.password.companyId);
          var managedById = $scope.editedPassword.managedById;
          if (managedById) {
            if ($scope.currentUser.isOwner && managedById !== $scope.currentUser.id) {
              $scope.password.onlyForMe = true;
              $scope.password.managedBy = $scope.getUserName(UsersService.getOneById(managedById));
            } else {
              $scope.password.onlyForMe = managedById === $scope.currentUser.id;
            }
          }
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

        $scope.toggleCreationGadget = function (isOpen, event) {
          if (!isOpen) {
            $scope.password.newGadgetName = '';
          }
          $scope.addingGadget = isOpen;
          event && event.stopPropagation();
        };

        $scope.toggleLock = function () {
          $scope.password.onlyForMe = !$scope.password.onlyForMe;
          if (!$scope.password.onlyForMe) {
            $scope.password.managedBy = '';
          }
        };

        $scope.onSelectDate = function (dates) {
          $scope.editedPassword.expiredDate = dates[0];
        };

        $scope.validateLinks = function (type, itemId, companyId) {
          var password = $scope.password;
          var firstLink = password.links[0];

          if (password.selectionMap[itemId]) {
            if (firstLink) {
              if (firstLink.userId && type !== 'user' || firstLink.deviceId && type !== 'agent' || firstLink.gadgetId && type !== 'gadget' || companyId !== $scope.password.companyId) {
                clearLinks();
                password.selectionMap[itemId] = true;
              }
            }

            var newLink = {};
            newLink[getKeyByType(type)] = itemId;
            password.links.push(newLink);
          } else {
            for (var i = 0; i < password.links.length; i++) {
              var link = password.links[i];
              if (link[getKeyByType(type)] === itemId) {
                password.links.splice(i, 1);
                break;
              }
            }
          }

          if (companyId && (!firstLink || !$scope.editedPasswordCompany)) {
            $scope.editedPasswordCompany = CompaniesService.getOneById(companyId);
            $scope.editedPassword.companyId = companyId;
            $scope.password.companyId = companyId;
          }

          $scope.password.firstLinkName = getLinkName(password.links[0], companyId);

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

          if (template === 'Device' || template === 'Wifi network') {
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

        $scope.removeGadget = function (id, event) {
          toggleGadget(false, id);
          var gadgets = $scope.gadgets;
          for (var i = 0; i < gadgets.length; i++) {
            var gadget = gadgets[i];
            if (gadget.id === id) {
              gadgets.splice(i, 1);
              break;
            }
          }
          DevicesService.removeGadget(id);
          event.stopPropagation();
        };

        $scope.addNewGadget = function (companyId, event) {
          var name = $scope.password.newGadgetName;
          if (name && name.length > 30) {
            name = name.slice(0, 30);
          }
          if (name && companyId) {
            var gadgets = $scope.gadgets;
            var selectionMap = $scope.password.selectionMap;
            for (var i = 0; i < gadgets.length; i++) {
              var gadget = gadgets[i];
              if (gadget.name === name && gadget.clientCompanyId === companyId) {
                if (!selectionMap[gadget.id]) {
                  toggleGadget(true, gadget.id, gadget.clientCompanyId);
                }
                $scope.toggleCreationGadget(false);
                event.stopPropagation();
                return;
              }
            }

            DevicesService.saveGadget(name, companyId, function (resp) {
              $scope.gadgets.push(resp);
              toggleGadget(true, resp.id, resp.clientCompanyId);
              $scope.toggleCreationGadget(false);
            });
          } else {
            $scope.toggleCreationGadget(false);
          }
          event.stopPropagation();
        };

        $scope.save = function (form) {
          $scope.showCompanyError = false;
          if (form.$valid) {
            // additional checking is  due to dropdown bug - after open and clicking outside there are no value(only viewValue and saved company ID)
            if($scope.editedPassword.companyId || $scope.editedPasswordCompany) {
              if($scope.editedPasswordCompany && !$scope.editedPassword.companyId) {
                $scope.setCompanyId();
              }
              $scope.loadingInProgress = true;
              $scope.editedPassword.links = angular.copy($scope.password.links);
              $scope.editedPassword.onlyForMe = $scope.password.onlyForMe;
              var toSave = buildDto($scope.editedPassword);
              PasswordManagerService.save(toSave, function () {
                $scope.loadingInProgress = false;
                $uibModalInstance.dismiss();
              })
            } else {
              $scope.showCompanyError = true;
            }

          } else {
            $scope.triedToSavePassword = true;
          }
        };

        function getKeyByType(type) {
          switch (type) {
            case 'user': return 'userId';
            case 'agent': return 'deviceId';
            case 'gadget': return 'gadgetId';
            default: throw new Error('Unresolved link type!')
          }
        }

        function getLinkName(link, companyId) {
          if (!link) {
            return '';
          }

          if (link.userId) {
            var user = UsersService.getOneById(link.userId);
            if (user) {
              return $scope.getUserName(user);
            }
          } else if (link.deviceId) {
            var device = DevicesService.getOneByDeviceId(link.deviceId, companyId);
            if (device) {
              return getDeviceName(device);
            } else {
              return link.deviceId;
            }
          } else if (link.gadgetId) {
            var gadgets = $scope.gadgets;
            if (gadgets && gadgets.length) {
              for (var i = 0; i < gadgets.length; i++) {
                var gadget = gadgets[i];
                if (gadget.id === link.gadgetId) {
                  return gadget.name;
                }
              }
            } else {
              return '';
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

          if (password.onlyForMe) {
            dto.managedById = $scope.currentUser.id;
          }
          if(password.note) {
            dto.note = password.note;
          }

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
            case 'LOCAL_USER_ACCOUNT':
            case 'WIFI_NETWORK': {
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
            case 'AGENT': {
              dto.description = 'Agent Network Credentials';
              break;
            }
          }

          return dto;
        }

        function formatDate(date) {
          if (!date || !date.getTime()) {
            return null;
          }
          return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        }

        function toggleGadget(isSelected, id, clientCompanyId) {
          $scope.password.selectionMap[id] = isSelected;
          $scope.validateLinks('gadget', id, clientCompanyId);
        }

        function isDataChanged(form) {
          var data = $scope.editedPassword;
          return (data.username || data.password || data.description) && (!data.id || form.$dirty);
        }

        function existInPassword(gadgetId, password) {
          var links = password.links;
          if (!links || !links.length || !links[0] || !links[0].gadgetId) {
            return false;
          }

          for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.gadgetId === gadgetId) {
              return true;
            }
          }
        }

        function getDeviceName(device) {
          return device.hostName || device.ip || device.ipAddress;
        }

        function clearLinks() {
          var password = $scope.password;
          password.links = [];
          password.selectionMap = {};
          password.firstLinkName = '';
        }

      }
    ]);

}());
