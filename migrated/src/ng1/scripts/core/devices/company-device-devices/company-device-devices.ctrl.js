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
         
          //DevicesService
        };

        $scope.specReport = function () {
          
          //DevicesService
        };

        $scope.transferFile = function () {
         
          //DevicesService
        };

        $scope.restart = function () {
        
          DevicesService.sendPowerAction($scope.companyId, $scope.agent.agentId, 'reboot');
        };

        $scope.shutdown = function () {
         
          DevicesService.sendPowerAction($scope.companyId, $scope.agent.agentId, 'shutdown');
        };

        $scope.remove = function () {
           
          DevicesService.sendUninstallAgentRequest($scope.companyId, $scope.agent.id)
        }

      }]);

}());
