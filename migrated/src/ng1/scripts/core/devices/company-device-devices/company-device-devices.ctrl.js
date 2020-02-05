'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyDeviceDevicesCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService',
      function ($scope, DevicesService, RemoteAccessService) {

        $scope.remoteAccess = function (connectionType) {
          if (!$scope.agent.online) {
            throw 'agent must be online'
          }

          DevicesService.createRemoteSession($scope.agent.id, $scope.companyId, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.sendAlert = function () {
          console.log('sendAlert - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.specReport = function () {
          console.log('specReport - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.transferFile = function () {
          console.log('transferFile - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.restart = function () {
          console.log('restart - ' + $scope.agent.agentId);
          DevicesService.sendPowerAction($scope.companyId, $scope.agent.agentId, 'reboot');
        };

        $scope.shutdown = function () {
          console.log('shutdown - ' + $scope.agent.agentId);
          DevicesService.sendPowerAction($scope.companyId, $scope.agent.agentId, 'shutdown');
        };

        $scope.remove = function () {
          console.log('remove - ' + $scope.agent.agentId);
          DevicesService.sendUninstallAgentRequest($scope.companyId, $scope.agent.id)
        }

      }]);

}());
