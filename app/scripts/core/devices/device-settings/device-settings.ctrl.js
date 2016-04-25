'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.deviceSettingsCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.UserConfirmationsService', '$filter',
      function ($scope, DevicesService, UserConfirmationsService, $filter) {
        var copySelectedAgents = {};

        $scope.deviceTypeUpdated = false;
        $scope.required = true;

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

        $scope.editedCredential = {
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
                if (credential.isDefault || credential.deviceType === 'DOMAIN') {
                  continue;
                }
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
          return !$scope.updating && (!form[field] || (form[field].$dirty || $scope.triedToSave) && form[field].$invalid);
        };

        $scope.setDeviceType = function (typeIndex, disabled, event) {
          if (!disabled) {
            var type = $scope.deviceTypes[typeIndex];

            if ($scope.editedCredential.deviceType !== 'NONE' && $scope.editedCredential.deviceType !== 'WORKSTATION') {
              findDeviceType($scope.editedCredential.deviceType).disabled = false;
            }

            $scope.editedCredential.deviceType = type.label.toUpperCase();
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
            if (!deviceTypes[i].disabled) {
              return true;
            }
          }
          return false;
        };

        $scope.hasEnabledDevice = function (credential, agentsAllowedForCredential) {
          return agentsAllowedForCredential.length || (credential.agents && credential.agents.length);
        };

        $scope.setTabOpened = function (tab) {
          if (tab === 'TYPE' && $scope.hasEnabledType($scope.deviceTypes)) {
            $scope.assignedTabOpened = 'TYPE';
          } else if ($scope.hasEnabledDevice($scope.editedCredential, $scope.agentsAllowedForCredential)) {
            $scope.assignedTabOpened = 'DEVICE';
          }
        };

        $scope.$watchCollection('[editedCredential.passwordConfirm, editedCredential.password]', function (values) {
          if ($scope.deviceSettingsForm.password && $scope.deviceSettingsForm.passwordConfirm) {
            if ($scope.deviceSettingsForm.password.$dirty && $scope.deviceSettingsForm.passwordConfirm.$dirty) {
              $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal', values[0] === values[1]);
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

            delete $scope.editedCredential.passwordConfirm;

            if (!$scope.selectedCredentialIndex) {
              $scope.editedCredential.company = {
                id: $scope.companyId
              };

              $scope.credentials.push($scope.editedCredential);
            } else {
              if (!$scope.editedCredential.password) {
                $scope.editedCredential.password = $scope.credentials[$scope.selectedCredentialIndex].password;
              }

              $scope.credentials[$scope.selectedCredentialIndex] = $scope.editedCredential;
            }

            saveCredentials(function () {
              form.$setPristine();
              $scope.editedCredential = {
                deviceType: 'NONE'
              };
              $scope.selectedCredentialIndex = undefined;
              $scope.required = true;
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
          var type, credential;
          if (index || index === 0) {
            credential = $scope.credentials[index];
          } else {
            credential = $scope.editedCredential;
          }

          type = credential.deviceType;
          if (type === 'WORKSTATION') {
            if (credential.agents && credential.agents.length < 2) {

              return $filter('unknownFilter')(getAgentNameById(credential.agents[0])) || 'Name is not defined';
            } else {
              return credential.agents ? credential.agents.length : '';
            }
          } else {
            return type.slice(0, 1) + type.slice(1).toLowerCase();
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
          $scope.agentsAllowedForCredential = getAllowedAgentsForCredential($scope.editedCredential);
          $scope.setTabOpened($scope.hasEnabledType($scope.deviceTypes) ? 'TYPE' : 'DEVICE');
          $scope.deviceTypeUpdated = false;
        };

        $scope.editCredential = function (index, form) {
          $scope.selectedCredentialIndex = index;
          $scope.editedCredential = angular.copy($scope.credentials[index]);
          delete $scope.editedCredential.password;
          $scope.agentsAllowedForCredential = getAllowedAgentsForCredential($scope.editedCredential);
          $scope.required = false;
          form.$setPristine();
        };

        $scope.cancelEdit = function (form) {
          $scope.editedCredential = {
            deviceType: 'NONE'
          };
          $scope.required = true;
          form.$setPristine();
        };

        function setCredentialAssign() {
          if ($scope.deviceTypeUpdated) {
            if ($scope.editedCredential.agents && $scope.editedCredential.agents.length) {
              $scope.allowedAgents = angular.copy($scope.agentsAllowedForCredential);
              $scope.editedCredential.agents = [];
            }

            $scope.selectedAgents = {};
          } else if (!angular.equals(copySelectedAgents, $scope.selectedAgents)) {
            $scope.editedCredential.agents = getSelectedAgentsIds($scope.selectedAgents);

            var deviceType = findDeviceType($scope.editedCredential.deviceType);
            if (deviceType && deviceType.disabled) {
              deviceType.disabled = false;
            }
            if ($scope.editedCredential.agents && $scope.editedCredential.agents.length) {
              $scope.editedCredential.deviceType = 'WORKSTATION';
            } else {
              $scope.editedCredential.deviceType = 'NONE';
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

        function getSelectedAgentsIds(selected) {
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
