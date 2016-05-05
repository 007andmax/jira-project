'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.companies.agentsTabsCtrl',
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

        $scope.remoteAccess = function (connectionType) {
          if (!$scope.agent.online) {
            throw 'agent must be online'
          }

          DevicesService.createRemoteSession($scope.agent.id, $scope.company.id, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.updateAgent = function () {
          DevicesService.sendAgentUpdateRequest($scope.company.id, $scope.agent.id)
        };

      }
    ]);
}());
