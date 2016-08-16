'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.companies.agentsTabsCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService', 'ConstantsService',
      'quicktech.common.services.UserConfirmationsService',
      function ($scope, DevicesService, RemoteAccessService, ConstantsService, UserConfirmationsService) {

        var lastAgent = ConstantsService.getConstant('rest.server.agent.version');
        var lastAgentArr = lastAgent.split('.');
        var currentAgentArr = $scope.agent.agentVersion.split('.');

        for (var i = 0; i < lastAgentArr.length; i++) {
          if (lastAgentArr[i] > currentAgentArr[i]) {
            $scope.agentDeprecated = true;
            break;
          }
        }

        $scope.remoteAccess = function (connectionType) {
          if (!$scope.agent.online) {
            throw 'agent must be online'
          }

          DevicesService.createRemoteSession($scope.agent.id, $scope.company.id, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.updateAgent = function () {
          DevicesService.sendAgentUpdateRequest($scope.company.id, $scope.agent.id);
        };

        $scope.remove = function () {
          var confirmMesage = 'Do you want to remove ' + ($scope.agent.hostName || $scope.agent.ip) + ' device?';
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.agent.id);
          });
        }

      }
    ]);
}());
