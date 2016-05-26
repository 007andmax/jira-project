'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.devicesTabCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService', 'quicktech.common.services.PermissionsService',
      function ($scope, DevicesService, RemoteAccessService, PermissionsService) {

        $scope.PermissionsService = PermissionsService;

        $scope.remoteAccess = function (connectionType) {
          if (!$scope.agent.online) {
            throw 'agent must be online'
          }

          DevicesService.createRemoteSession($scope.agent.id, $scope.company.id, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.orderDevicesBy = 'hostName';
        $scope.sortDevicesTab = function (option) {
          if (option === $scope.orderDevicesBy) {
            if (option[0] === '-') {
              $scope.orderDevicesBy = $scope.orderDevicesBy.substring(1);
            } else {
              $scope.orderDevicesBy = '-' + $scope.orderDevicesBy;
            }
          } else {
            $scope.orderDevicesBy = option;
          }
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
          DevicesService.sendPowerAction($scope.company.id, $scope.agent.agentId, 'reboot');
        };

        $scope.shutdown = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.agent.agentId, 'shutdown');
        };

        $scope.remove = function () {
          if (PermissionsService.isAllowed('clients/companyProfile', $scope.currentUser.role, 'd_device')) {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.agent.id, function () {
              if (delete $scope.selectDevices[$scope.agent.agentId]) {
                $scope.changeSelectDevices();
              }
            })
          }
        }

      }]);

}());
