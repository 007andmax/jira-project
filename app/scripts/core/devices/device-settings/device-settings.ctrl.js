'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.deviceSettingsCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.UserConfirmationsService', '$filter',
      function ($scope, DevicesService, UserConfirmationsService, $filter) {
        var copySelectedAgents = {};

        $scope.deviceTypeUpdated = false;

        $scope.triedToSave = false;
        $scope.rescanIntervals = [
          { label: '1 hour', value: 3600000 },
          { label: '4 hour', value: 14400000 },
          { label: '1 day', value: 86400000 },
          { label: '7 days', value: 604800000 },
          { label: '30 days', value: 18144000000 }
        ];
        $scope.deviceTypes = [{
          label: 'Router',
          disabled: false
        }, {
          label: 'Switch',
          disabled: false
        }, {
          label: 'Nas',
          disabled: false
        }];
        $scope.test = {};

        $scope.newCredential = {
          deviceType: 'NONE'
        };
        $scope.passwordShown = [];
        $scope.agentsAllowedForCredential = [];
        $scope.allowedAgents = [];
        $scope.selectedAgents = {};

        DevicesService.getCredentialsByCompany($scope.companyId, function (resp) {
          var allAgentsFromCredentials = [],
            isInCredentials = false;

          for (var i = 0; i < resp.length; i++) {
            var credential = resp[i],
              agents = credential.agents;
            if (agents && agents.length) {
              for (var j = 0; j < agents.length; j++) {
                allAgentsFromCredentials.push(agents[j]);
              }
            }

            if (credential.deviceType !== 'DOMAIN') {
              var type = findDeviceType(credential.deviceType);
              if (type && !type.disabled) {
                type.disabled = true;
              }
            }
          }

          for (var k = 0, len = $scope.agents.length; k < len; k++) {
            var agent = $scope.agents[k];
            isInCredentials = false;
            for (var i = 0; i < allAgentsFromCredentials.length; i++) {
              var agentFromCredentials = allAgentsFromCredentials[i];
              if (agentFromCredentials === agent.id) {
                isInCredentials = true;
                break;
              }
            }
            if (!isInCredentials) {
              $scope.allowedAgents.push(agent);
            }
          }

          $scope.credentials = resp;
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
          return !form[field] || (form[field].$dirty || $scope.triedToSave) && form[field].$invalid;
        };

        $scope.setDeviceType = function (typeIndex, disabled, event) {
          if (!disabled) {
            var type = $scope.deviceTypes[typeIndex],
              credential = $scope.editedCredential ? $scope.editedCredential : $scope.newCredential;

            if (credential.deviceType !== 'NONE' && credential.deviceType !== 'WORKSTATION') {
              findDeviceType(credential.deviceType).disabled = false;
            }

            credential.deviceType = type.label.toUpperCase();
            type.disabled = true;
            $scope.deviceTypeUpdated = true;
            $scope.deviceSettingsForm.$setDirty();
          } else {
            event.stopPropagation();
          }
        };

        $scope.setSelectedDevices = function (open) {
          if (!open) {
            setCredentialAssign();
          }
        };

        $scope.hasEnabledType = function (deviceTypes) {
          for (var i = 0, len = deviceTypes.length; i < len; i++) {
            if (!deviceTypes.disabled) {
              return true;
            }
          }
          return false;
        };

        $scope.hasEnableDevice = function (credential, agentsAllowedForCredential) {
          return agentsAllowedForCredential.length || credential.agents || credential.agents.length;
        };

        $scope.setTabOpened = function (tab) {
          if (tab === 'TYPE' && $scope.hasEnabledType($scope.deviceTypes)) {
            $scope.assignedTabOpened = 'TYPE';
          } else if ($scope.hasEnableDevice($scope.editedCredential ||
              $scope.newCredential, $scope.agentsAllowedForCredential)) {
            $scope.assignedTabOpened = 'DEVICE';
          }
        };

        $scope.$watchCollection('[newCredential.passwordConfirm, editCredential.passwordConfirm]', function (values) {
          var value, credential;
          if ($scope.editedCredential) {
            value = values[1];
            credential = $scope.editedCredential;
          } else {
            value = values[0];
            credential = $scope.newCredential;
          }
          if ($scope.deviceSettingsForm.password && $scope.deviceSettingsForm.passwordConfirm) {
            if ($scope.deviceSettingsForm.password.$dirty && $scope.deviceSettingsForm.passwordConfirm.$dirty) {
              $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal', credential.password === value);
            }
          }
        });

        $scope.removeCredential = function (index) {
          var confirmMesage = 'Do you want to delete ' + $scope.credentials[index].login + '?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            $scope.credentials.splice(index, 1);
            saveCredentials();
          });
        };

        $scope.updateCredentials = function (form) {
          if (form.$valid) {
            $scope.updating = true;

            if (!$scope.editedCredential) {
              delete $scope.newCredential.passwordConfirm;
              $scope.newCredential.company = {
                id: $scope.companyId
              };

              $scope.credentials.push($scope.newCredential);
            } else {
              delete $scope.editedCredential.passwordConfirm;
              var credential = $scope.credentials[$scope.selectedCredentialIndex];
              for (var prop in $scope.editedCredential) {
                if (prop === 'password') {
                  if ($scope.editedCredential[prop]) {
                    credential[prop] = $scope.editedCredential[prop];
                  }
                } else {
                  credential[prop] = $scope.editedCredential[prop];
                }
              }
            }

            saveCredentials(function () {
              form.$setPristine();
              $scope.newCredential = {
                deviceType: 'NONE'
              };
              $scope.editedCredential = undefined;
              $scope.selectedCredentialIndex = undefined;
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

        $scope.isInCredential = function (credential, agentId) {
          var agentsFromCredential = credential.agents;

          if (agentsFromCredential) {
            for (var i = 0; i < agentsFromCredential.length; i++) {
              var id = agentsFromCredential[i];
              if (id === agentId) {
                return true;
              }
            }
          }

          return false;
        };

        $scope.userReadable = function (index) {
          var str, credential;
          if ($scope.editedCredential && !(index || index === 0)) {
            credential = $scope.editedCredential;
          } else if (index || index === 0) {
            credential = $scope.credentials[index];
          } else {
            credential = $scope.newCredential;
          }

          str = credential.deviceType;
          if (str === 'WORKSTATION') {
            if (credential.agents && credential.agents.length < 2) {

              return $filter('unknownFilter')(getAgentNameById(credential.agents[0])) || 'Name is not defined';
            } else {
              return credential.agents ? credential.agents.length : '';
            }
          } else {
            return str.slice(0, 1) + str.slice(1).toLowerCase();
          }
        };

        $scope.getAgentsByIds = function (agentsIds) {
          var result = [];

          if (agentsIds) {
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
        };

        $scope.openDropdown = function () {
          if ($scope.editedCredential) {
            $scope.agentsAllowedForCredential = getAllowedAgentsForCredential($scope.editedCredential);
          } else {
            $scope.agentsAllowedForCredential = getAllowedAgentsForCredential($scope.newCredential);
          }
          $scope.setTabOpened($scope.hasEnabledType($scope.deviceTypes) ? 'TYPE' : 'DEVICE');
          $scope.deviceTypeUpdated = false;
        };

        $scope.editCredential = function (index) {
          $scope.selectedCredentialIndex = index;
          $scope.editedCredential = angular.copy($scope.credentials[index]);
          delete $scope.editedCredential.password;
        };

        $scope.cancelEdit = function () {
          $scope.editedCredential = undefined;
        };

        function setCredentialAssign() {
          var credential = $scope.editedCredential ? $scope.editedCredential : $scope.newCredential;
          if ($scope.deviceTypeUpdated) {
            if (credential.agents && credential.agents.length) {
              $scope.allowedAgents = angular.copy($scope.agentsAllowedForCredential);
              credential.agents = [];
            }

            $scope.selectedAgents = {};
          } else if (!angular.equals(copySelectedAgents, $scope.selectedAgents)) {
            credential.agents = getSelectedAgents($scope.selectedAgents);

            var deviceType = findDeviceType(credential.deviceType);
            if (deviceType && deviceType.disabled) {
              deviceType.disabled = false;
            }
            if (credential.agents && credential.agents.length) {
              credential.deviceType = 'WORKSTATION';
            } else {
              credential.deviceType = 'NONE';
            }

            for (var i = 0; i < $scope.agentsAllowedForCredential.length; i++) {
              var agent = $scope.agentsAllowedForCredential[i];

              if ($scope.selectedAgents[agent.id]) {
                $scope.allowedAgents.splice($scope.allowedAgents.indexOf(agent), 1);
              } else {
                $scope.allowedAgents.push(agent);
              }
            }

            $scope.selectedAgents = {};
          }
        }

        function getAllowedAgentsForCredential(credential) {
          var agentsAllowedForCredential = $scope.allowedAgents.concat($scope.getAgentsByIds(credential.agents));

          var len = agentsAllowedForCredential.length;
          if (len) {
            for (var i = 0; i < len; i++) {
              var agent = agentsAllowedForCredential[i];
              $scope.selectedAgents[agent.id] = $scope.isInCredential(credential, agent.id);
              copySelectedAgents[agent.id] = $scope.selectedAgents[agent.id];
            }
          } else {
            copySelectedAgents = {};
            $scope.selectedAgents = {};
          }

          return agentsAllowedForCredential;
        }

        function getSelectedAgents(selected) {
          var result = [];
          for (var agentId in selected) {
            if (selected[agentId]) {
              result.push(agentId);
            }
          }
          return result;
        }

        function getAgentNameById(id) {
          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            var agent = $scope.agents[i];
            if (agent.id === id) {
              return agent.hostName;
            }
          }
        }

        function findDeviceType(name) {
          for (var i = 0, len = $scope.deviceTypes.length; i < len; i++) {
            var type = $scope.deviceTypes[i];
            if (type.label.toLowerCase() === name.toLowerCase()) {
              return type;
            }
          }
        }

        function saveCredentials(callback) {
          $scope.updating = true;
          DevicesService.saveCredentials($scope.credentials, $scope.companyId, function () {
            callback && callback();
            $scope.updating = false;
          });
        }

      }]);

}());
