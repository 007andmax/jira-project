'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyAgentDeviceCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService', 'ConstantsService',
      function ($scope, DevicesService, RemoteAccessService, ConstantsService) {

        var lastAgent = ConstantsService.getConstant('rest.server.agent.version');
        var lastAgentArr = lastAgent.split('.');
        var currentAgentArr = $scope.agent.agentVersion.split('.');

        for (var i = 0; i < lastAgentArr.length; i++) {
          if (lastAgentArr[i] > currentAgentArr[i]) {
            $scope.agentDeprecated = true;
            break;
          }
        }

        $scope.savingCredentional = false;
        $scope.isLogOnDrpdwnOpen = false;

        $scope.remoteAccess = function (connectionType) {
          if (!$scope.agent.online) {
            throw 'agent must be online'
          }

          DevicesService.createRemoteSession($scope.agent.id, $scope.companyId, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.saveNewCredentional = function (isTest) {
          $scope.savingCredentional = true;

          DevicesService.sendOrTestCredentials($scope.companyId, $scope.credential.name, $scope.credential.pass, isTest, $scope.agent.id, function () {
            $scope.credential = {
              name: $scope.credential.name,
              pass: $scope.credential.pass
            };
            $scope.savingCredentional = false;
            $scope.isLogOnDrpdwnOpen = false;
          })
        };

        $scope.updateAgent = function () {
          DevicesService.sendAgentUpdateRequest($scope.companyId, $scope.agent.id)
        };

        $scope.getAgentPass = function () {
          if (!$scope.customizeAgents) {
            return $scope.defaultPass || '';
          }
          return $scope.customizeAgents[$scope.agent.id] ? $scope.customizeAgents[$scope.agent.id].password : $scope.defaultPass
        };

        $scope.restoreDefault = function () {
          if ($scope.customizeAgents[$scope.agent.id]) {
            $scope.savingCredentional = true;

            DevicesService.deleteDeviceSettings($scope.customizeAgents[$scope.agent.id].id, function () {
              $scope.savingCredentional = false;
              $scope.isLogOnDrpdwnOpen = false;
            })
          }
        };

        $scope.toogleLogOnDrpdwn = function (isOpen) {
          if (isOpen) {
            $scope.credential = {
              name: $scope.customizeAgents[$scope.agent.id] ? $scope.customizeAgents[$scope.agent.id].login : $scope.defaultName,
              pass: $scope.customizeAgents[$scope.agent.id] ? $scope.customizeAgents[$scope.agent.id].password : $scope.defaultPass
            };
          }
        }

      }
    ]);
}());
