'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.devicesTabCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService',
      'quicktech.common.services.SharedStateService', '$rootScope', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, DevicesService, RemoteAccessService, SharedStateService, $rootScope, UserConfirmationsService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.highlightDevice = function () {
          if (globalSearch.deviceFilter) {
            $rootScope.$broadcast('showFilteredDevice-' + globalSearch.deviceFilter);
            globalSearch.deviceFilter = undefined;
          }
        };

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
          var confirmMesage = 'Do you want to remove ' + ($scope.agent.hostName || $scope.agent.ip) + ' device?';
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.agent.id, function () {
              if (delete $scope.selectDevices[$scope.agent.agentId]) {
                $scope.changeSelectDevices();
              }
            });
          });
        };

        $scope.getDeviceReport = function (agentId) {
          DevicesService.getDeviceReports([agentId], $scope.company.id, function (resp) {
            var report = resp.reports[0],
              agentId = report.agentId;
            delete report.agentId;
            groupSingleFields(report);

            $scope.deviceReport = {};
            $scope.deviceReport[agentId] = report;

          });
        };

        function groupSingleFields(report) {
          report['General'] = {};
          for (var prop in report) {
            var value = report[prop];

            if (typeof value !== 'object') {
              report['General'][prop] = value;
              delete report[prop];
            }
          }
        }

      }]);

}());
