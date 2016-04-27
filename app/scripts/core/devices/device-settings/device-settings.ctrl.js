'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.deviceSettingsCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.UserConfirmationsService', '$filter',
      function ($scope, DevicesService, UserConfirmationsService, $filter) {
        var copySelectedAgents = {},
          copySelectedDevices = {},
          credentialsForSend = [],
          scannedDevices = $scope.scanDevices.networkScan.devices;

        $scope.credentialTypeUpdated = false;
        $scope.assignRequiredError = false;
        $scope.deviceSearchQuery = '';

        $scope.triedToSave = false;
        $scope.rescanIntervals = [
          { label: '1 hour', value: 3600000 },
          { label: '4 hour', value: 14400000 },
          { label: '1 day', value: 86400000 },
          { label: '7 days', value: 604800000 },
          { label: '30 days', value: 18144000000 }
        ];
        $scope.credentialTypes = [{
          label: 'Domain',
          disabled: false
        }, {
          label: 'User',
          disabled: false
        }, {
          label: 'Router',
          disabled: false
        }, {
          label: 'Switch',
          disabled: false
        }, {
          label: 'Nas',
          disabled: false
        }];

        $scope.editedCredential = {};
        $scope.passwordShown = [];
        $scope.agentsAllowedForCredential = [];
        $scope.devicesAllowedForCredential = [];
        $scope.allowedAgents = [];
        $scope.allowedDevices = [];
        $scope.selectedAgents = {};
        $scope.selectedDevices = {};

        DevicesService.getCredentialsByCompany($scope.companyId, function (resp) {
          $scope.credentials = angular.copy(resp);
          resetPermissions();
        });

        DevicesService.getAgentSettingsByCompany($scope.companyId, function (resp) {
          $scope.settings = resp;
          for (var i = 0, len = $scope.rescanIntervals.length; i < len; i++) {
            var obj = $scope.rescanIntervals[i];
            if (obj.value === resp.rescanTime) {
              $scope.settings.rescanTime = obj;
              break;
            }
          }
        });

        $scope.isShowingErrors = function (form, field) {
          return !$scope.updating && (!form[field] || (form[field].$dirty || $scope.triedToSave) && form[field].$invalid);
        };

        $scope.setDeviceType = function (typeIndex, disabled, event) {
          if (!disabled) {
            var type = $scope.credentialTypes[typeIndex];

            if ($scope.editedCredential.credentialType !== 'USER' && $scope.editedCredential.credentialType !== 'WORKSTATION') {
              var credentialType = findDeviceType($scope.editedCredential.credentialType);
              if (credentialType && credentialType.disabled) {
                credentialType.disabled = false;
              }
            }

            $scope.editedCredential.credentialType = type.label.toUpperCase();
            if ($scope.editedCredential.credentialType !== 'USER') {
              type.disabled = true;
            }
            $scope.credentialTypeUpdated = true;
            $scope.deviceSettingsForm.$setDirty();
          } else {
            event.stopPropagation();
          }
        };

        $scope.setSelectedDevices = function (open) {
          if (!open && $scope.needSetAssign) {
            $scope.deviceSearchQuery = '';
            setCredentialAssign();
          } else {
            $scope.needSetAssign = true;
          }
        };

        $scope.hasEnabledType = function (credentialTypes) {
          for (var i = 0, len = credentialTypes.length; i < len; i++) {
            if (!credentialTypes[i].disabled) {
              return true;
            }
          }
          return false;
        };

        $scope.hasEnabledDevice = function (credential) {
          return $scope.agentsAllowedForCredential.length || $scope.devicesAllowedForCredential.length
            || (credential.devices && credential.devices.length);
        };

        $scope.setTabOpened = function (tab) {
          if (tab === 'TYPE' && $scope.hasEnabledType($scope.credentialTypes)) {
            $scope.assignedTabOpened = 'TYPE';
          } else if ($scope.hasEnabledDevice($scope.editedCredential, $scope.agentsAllowedForCredential)) {
            $scope.assignedTabOpened = 'DEVICE';
          }
        };

        $scope.$watchCollection('[editedCredential.passwordConfirm, editedCredential.password]', function (values) {
          if ($scope.deviceSettingsForm.password && $scope.deviceSettingsForm.passwordConfirm) {
            if ($scope.deviceSettingsForm.password.$dirty || $scope.deviceSettingsForm.passwordConfirm.$dirty) {
              $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal', values[0] === values[1]);
            }
          }
        });

        $scope.removeCredential = function (index) {
          var confirmMessage = 'Do you want to delete ' + $scope.credentials[index].login + '?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
            var devices = $scope.credentials[index].devices;

            if (devices && devices.length) {
              for (var i = 0; i < devices.length; i++) {
                var device = devices[i];

                if (device.deviceId) {
                  $scope.allowedAgents.push(getAgentById(device.deviceId));
                } else {
                  $scope.allowedDevices.push(getDeviceById(device.netscanId));
                }
              }
            }

            credentialsForSend = angular.copy($scope.credentials);
            credentialsForSend.splice(index, 1);

            $scope.selectedAgents = {};
            copySelectedAgents = {};
            $scope.selectedDevices = {};
            copySelectedDevices = {};
            $scope.editedCredential = {};
            delete $scope.selectedCredentialIndex;
            $scope.triedToSave = false;
            saveCredentials();
          });
        };

        $scope.updateCredentials = function (form) {
          $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal',
            $scope.editedCredential.passwordConfirm === $scope.editedCredential.password);
          $scope.assignRequiredError = !$scope.editedCredential.credentialType;
          if (form.$valid && !$scope.assignRequiredError) {
            $scope.triedToSave = false;
            setCredentialAssign();

            delete $scope.editedCredential.passwordConfirm;
            credentialsForSend = angular.copy($scope.credentials);

            if ($scope.selectedCredentialIndex === undefined) {
              $scope.editedCredential.company = {
                id: $scope.companyId
              };
              credentialsForSend.push($scope.editedCredential);
            } else {
              credentialsForSend[$scope.selectedCredentialIndex] = $scope.editedCredential;
            }

            saveCredentials(function () {
              $scope.editedCredential = {};
              delete $scope.selectedCredentialIndex;
              form.$setPristine();
            });
          } else {
            $scope.triedToSave = true;
          }
        };

        $scope.saveDeploymentSettings = function () {

          if (!$scope.settings.maxAgents || $scope.settings.maxAgents < 0) {
            $scope.settings.maxAgents = 0;
          }

          if (!$scope.settings.removeOfflineTime || $scope.settings.removeOfflineTime < 0) {
            $scope.settings.removeOfflineTime = 0;
          }

          var settings = angular.copy($scope.settings);

          settings.rescanTime = settings.rescanTime.value;
          settings.company = {
            id: $scope.companyId
          };
          DevicesService.updateAgentSettings(settings);
        };

        $scope.userReadable = function (index) {
          var type, credential;
          if (index !== undefined) {
            credential = $scope.credentials[index];
          } else {
            credential = $scope.editedCredential;
          }

          type = credential.credentialType;
          if (type === 'WORKSTATION') {
            if ((index === undefined && credential.devices.length < 4) || (index !== undefined && credential.devices.length < 2)) {
              var result = '';

              if (credential.devices) {
                for (var i = 0, len = credential.devices.length; i < len;) {
                  var deviceIds = credential.devices[i];

                  if (deviceIds.label) {
                    result = addToName(result, deviceIds.label, ++i, len);
                    continue;
                  }

                  if (deviceIds.netscanId) {
                    var device = getDeviceById(deviceIds.netscanId);
                    result = addToName(result, $filter('unknownFilter')(device.hostName) || device.ipAddress, ++i, len);
                  } else {
                    var agent = getAgentById(deviceIds.deviceId);
                    result = addToName(result, $filter('unknownFilter')(agent.hostName) || agent.ip, ++i, len);
                  }

                }
              }

              return result || 'Assign';
            } else {
              return credential.devices.length + ' devices';
            }
          } else if (type) {
            return type.slice(0, 1) + type.slice(1).toLowerCase();
          }
        };

        $scope.openDropdown = function () {
          $scope.agentsAllowedForCredential = getAllowedAgentsForCredential($scope.editedCredential);
          $scope.devicesAllowedForCredential = getAllowedDevicesForCredential($scope.editedCredential);
          $scope.setTabOpened($scope.hasEnabledType($scope.credentialTypes) ? 'TYPE' : 'DEVICE');
          $scope.credentialTypeUpdated = false;
        };

        $scope.editCredential = function (index, form) {
          resetPermissions();

          $scope.selectedAgents = {};
          copySelectedAgents = {};
          $scope.selectedDevices = {};
          copySelectedDevices = {};

          $scope.selectedCredentialIndex = index;
          $scope.editedCredential = angular.copy($scope.credentials[index]);
          $scope.editedCredential.passwordConfirm = $scope.editedCredential.password;
          $scope.agentsAllowedForCredential = getAllowedAgentsForCredential($scope.editedCredential);
          $scope.devicesAllowedForCredential = getAllowedDevicesForCredential($scope.editedCredential);
          $scope.triedToSave = true;
          $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal', true);
          form.$setPristine();
        };

        $scope.cancelEdit = function (form) {
          copySelectedAgents = {};
          copySelectedDevices = {};
          $scope.selectedAgents = {};
          $scope.selectedDevices = {};
          $scope.editedCredential = {};
          delete $scope.selectedCredentialIndex;

          resetPermissions();
          $scope.triedToSave = false;
          form.$setPristine();
        };

        $scope.searchDevice = function (value) {
          var keyword = $scope.deviceSearchQuery.toLowerCase();
          if (keyword) {
            if (value.hostName !== 'unknown') {
              return value.hostName.toLowerCase().indexOf(keyword) > -1;
            }

            if (value.ipAddress) {
              if (value.ipAddress.toLowerCase().indexOf(keyword) > -1) {
                return true;
              }
            } else {
              if (value.ip.toLowerCase().indexOf(keyword) > -1) {
                return true;
              }
            }

            return false;
          } else {
            return true;
          }
        };

        function setCredentialAssign() {
          var selectedAgentsChanged = !angular.equals(copySelectedAgents, $scope.selectedAgents),
            selectedDevicesChanged = !angular.equals(copySelectedDevices, $scope.selectedDevices);

          if ($scope.credentialTypeUpdated) {

            if ($scope.editedCredential.devices && $scope.editedCredential.devices.length) {
              $scope.allowedAgents = angular.copy($scope.agentsAllowedForCredential);
              $scope.allowedDevices = angular.copy($scope.devicesAllowedForCredential);
              $scope.editedCredential.devices = [];
            }
            $scope.assignRequiredError = false;

          } else if (selectedAgentsChanged || selectedDevicesChanged) {

            $scope.editedCredential.devices = getSelectedDevices($scope.selectedAgents, $scope.selectedDevices);

            var credentialType = findDeviceType($scope.editedCredential.credentialType);
            if (credentialType && credentialType.disabled) {
              credentialType.disabled = false;
            }

            for (var i = 0; i < $scope.agentsAllowedForCredential.length; i++) {
              var agent = $scope.agentsAllowedForCredential[i],
                isAgentSelected = $scope.selectedAgents[agent.id],
                isAgentWasSelected = copySelectedAgents[agent.id];

              if (isAgentSelected && !isAgentWasSelected) {
                $scope.allowedAgents.splice($scope.allowedAgents.indexOf(agent), 1);
              } else if (!isAgentSelected && isAgentWasSelected) {
                $scope.allowedAgents.push(agent);
              }
            }

            for (var i = 0; i < $scope.devicesAllowedForCredential.length; i++) {
              var device = $scope.devicesAllowedForCredential[i],
                isDeviceSelected = $scope.selectedDevices[device.id],
                isDeviceWasSelected = copySelectedDevices[device.id];

              if (isDeviceSelected && !isDeviceWasSelected) {
                $scope.allowedDevices.splice($scope.allowedDevices.indexOf(device), 1);
              } else if (!isDeviceSelected && isDeviceWasSelected) {
                $scope.allowedDevices.push(device);
              }
            }


            if ($scope.editedCredential.devices && $scope.editedCredential.devices.length) {
              $scope.editedCredential.credentialType = 'WORKSTATION';
              $scope.assignRequiredError = false;
            } else {
              delete $scope.editedCredential.credentialType;
            }
          }

          copySelectedAgents = {};
          copySelectedDevices = {};
          $scope.selectedAgents = {};
          $scope.selectedDevices = {};
          $scope.needSetAssign = false;
        }

        function resetPermissions() {
          var allAgentsFromCredentials = [],
            excludedDevices = [],
            isAgentInCredentials = false,
            isDeviceInCredentials = false;

          $scope.allowedAgents = [];
          $scope.allowedDevices = [];

          for (var i = 0, len = $scope.credentialTypes.length; i < len; i++) {
            var type = $scope.credentialTypes[i];
            type.disabled = false;
          }

          for (var i = 0, len = $scope.credentials.length; i < len; i++) {
            var credential = $scope.credentials[i],
              devices = credential.devices;

            if (credential.isDefault || credential.credentialType === 'DOMAIN') {
              devices = undefined;
              delete credential.devices;
            }

            if (devices && devices.length) {
              for (var j = 0; j < devices.length; j++) {
                var device = devices[j];
                if (device.deviceId) {
                  allAgentsFromCredentials.push(device.deviceId);
                } else {
                  excludedDevices.push(device.netscanId);
                }
              }
            }

            if (credential.credentialType !== 'USER') {
              var type = findDeviceType(credential.credentialType);
              if (type && !type.disabled) {
                type.disabled = true;
              }
            }
          }

          for (var k = 0, len = $scope.agents.length; k < len; k++) {
            var agent = $scope.agents[k];
            isAgentInCredentials = false;
            for (var i = 0; i < allAgentsFromCredentials.length; i++) {
              var agentFromCredentials = allAgentsFromCredentials[i];

              if (agentFromCredentials === agent.id) {
                isAgentInCredentials = true;
                break;
              }
            }

            for (var j = 0; j < scannedDevices.length; j++) {
              var device = scannedDevices[j];

              if (device.deviceId === agent.id) {
                excludedDevices.push(device.id)
              }
            }

            if (!isAgentInCredentials) {
              $scope.allowedAgents.push(agent);
            }
          }

          for (var i = 0; i < scannedDevices.length; i++) {
            var device = scannedDevices[i];
            isDeviceInCredentials = false;

            for (var j = 0; j < excludedDevices.length; j++) {
              var deviceFromCredentials = excludedDevices[j];

              if (deviceFromCredentials === device.id) {
                isDeviceInCredentials = true;
                break;
              }
            }
            if (!isDeviceInCredentials) {
              $scope.allowedDevices.push(device);
            }
          }
        }

        function getAllowedAgentsForCredential(credential) {
          var agentIds = [];

          if (credential.devices) {
            for (var i = 0, len = credential.devices.length; i < len; i++) {
              var id = credential.devices[i].deviceId;
              if (id) {
                agentIds.push(id);
              }
            }
          }

          var agentsAllowedForCredential = $scope.allowedAgents.concat(getAgentsByIds(agentIds)),
            len = agentsAllowedForCredential.length;

          if (len) {
            for (var i = 0; i < len; i++) {
              var agent = agentsAllowedForCredential[i],
                isInCredential = isAgentInCredential(agentIds, agent.id);
              if (isInCredential) {
                $scope.selectedAgents[agent.id] = isInCredential;
                copySelectedAgents[agent.id] = isInCredential;
              }
            }
          } else {
            copySelectedAgents = {};
            $scope.selectedAgents = {};
          }

          return agentsAllowedForCredential;
        }

        function getAllowedDevicesForCredential(credential) {
          var netscansIds = [];

          if (credential.devices) {
            for (var i = 0, len = credential.devices.length; i < len; i++) {
              var id = credential.devices[i].netscanId;
              if (id) {
                netscansIds.push(id);
              }
            }
          }

          var devicesAllowedForCredential = $scope.allowedDevices.concat(getDevicesByIds(netscansIds)),
            len = devicesAllowedForCredential.length;

          if (len) {
            for (var i = 0; i < len; i++) {
              var device = devicesAllowedForCredential[i],
                isInCredential = isDeviceInCredential(netscansIds, device.id);
              if (isInCredential) {
                $scope.selectedDevices[device.id] = isInCredential;
                copySelectedDevices[device.id] = isInCredential;
              }
            }
          } else {
            copySelectedDevices = {};
            $scope.selectedDevices = {};
          }

          return devicesAllowedForCredential;
        }

        function getSelectedDevices(selectedAgents, selectedNetScans) {
          var result = [],
            agentIds = [],
            agents;

          for (var id in selectedAgents) {
            if (selectedAgents[id]) {
              agentIds.push(id);
            }
          }

          agents = getAgentsByIds(agentIds);
          for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            result.push({
              agentId: agent.agentId,
              deviceId: agent.id,
              label: $filter('unknownFilter')(agent.hostName) || agent.ip
            });
          }

          for (var id in selectedNetScans) {
            var device = getDeviceById(id);
            if (selectedNetScans[id]) {
              result.push({
                netscanId: id,
                label: $filter('unknownFilter')(device.hostName) || device.ipAddress
              });
            }
          }

          return result;
        }

        function getAgentsByIds(agentsIds) {
          var result = [];

          if (agentsIds && agentsIds.length) {
            for (var i = 0; i < agentsIds.length; i++) {
              var id = agentsIds[i];
              for (var j = 0, len = $scope.agents.length; j < len; j++) {
                var agent = $scope.agents[j];
                if (id === agent.id) {
                  result.push(agent);
                }
              }
            }
          }

          return result;
        }

        function getDevicesByIds(devicesIds) {
          var result = [];

          if (devicesIds && devicesIds.length) {
            for (var i = 0; i < devicesIds.length; i++) {
              var id = devicesIds[i];
              for (var j = 0, len = scannedDevices.length; j < len; j++) {
                var device = scannedDevices[j];
                if (id === device.id) {
                  result.push(device);
                }
              }
            }
          }

          return result;
        }

        function getAgentById(id) {
          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            var agent = $scope.agents[i];
            if (agent.id === id) {
              return agent;
            }
          }
        }

        function getDeviceById(id) {
          for (var i = 0, len = scannedDevices.length; i < len; i++) {
            var device = scannedDevices[i];
            if (device.id === id) {
              return device;
            }
          }
        }

        function isAgentInCredential(agentIds, agentId) {
          if (agentIds && agentIds.length) {
            for (var i = 0; i < agentIds.length; i++) {
              var id = agentIds[i];
              if (id === agentId) {
                return true;
              }
            }
          }

          return false;
        }

        function isDeviceInCredential(netscansIds, deviceId) {
          if (netscansIds && netscansIds.length) {
            for (var i = 0; i < netscansIds.length; i++) {
              var id = netscansIds[i];
              if (id === deviceId) {
                return true;
              }
            }
          }

          return false;
        }

        function findDeviceType(name) {
          if (name) {
            for (var i = 0, len = $scope.credentialTypes.length; i < len; i++) {
              var type = $scope.credentialTypes[i];
              if (type.label.toLowerCase() === name.toLowerCase()) {
                return type;
              }
            }
          }
        }

        function addToName(str, addition, counter, len) {
          var result = str + addition;
          if (counter !== len) {
            result += '; ';
          }
          return result;
        }

        function saveCredentials(callback) {
          $scope.updating = true;
          DevicesService.saveCredentials(credentialsForSend, $scope.companyId, function () {
            callback && callback();
            $scope.updating = false;
          });
        }

      }]);

}());
