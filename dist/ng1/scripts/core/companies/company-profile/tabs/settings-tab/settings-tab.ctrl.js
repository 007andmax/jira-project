'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.settingsTabCtrl',
    ['$scope', 'DevicesService', function ($scope, DevicesService) {

        $scope.assignRequiredError = false;
        $scope.triedToSave = false;
        $scope.rescanIntervals = [
          { label: '1 hour', value: 3600000 },
          { label: '4 hour', value: 14400000 },
          { label: '1 day', value: 86400000 },
          { label: '7 days', value: 604800000 },
          { label: '30 days', value: 18144000000 }
        ];

        DevicesService.getAgentSettingsByCompany($scope.company.id, function (resp) {
          $scope.settings = resp;

          if ($scope.settings.masterAgent && $scope.settings.masterAgent.agentId) {
            $scope.settings.masterAgentId = $scope.settings.masterAgent.agentId;
          } else {
            $scope.settings.masterAgentId = '';
          }

          for (var i = 0, len = $scope.rescanIntervals.length; i < len; i++) {
            var obj = $scope.rescanIntervals[i];
            if (obj.value === resp.rescanTime) {
              $scope.settings.rescanTime = obj;
              break;
            }
          }
        });

        $scope.saveDeploymentSettings = function (form) {

          if (!$scope.PermissionsService.isAllowed('MODIFY_SETTINGS')) {
            return;
          }

          if ($scope.settings.maxAgents < 0 ||
            ($scope.agents && $scope.settings.maxAgents < $scope.agents.length && $scope.settings.maxAgents !== 0)) {
            form.$setValidity('min', false);
          } else {
            form.$setValidity('min', true);
          }

          if (!$scope.settings.removeOfflineTime || $scope.settings.removeOfflineTime < 0) {
            $scope.settings.removeOfflineTime = 0;
          }

          if (form.$valid) {
            var settings = angular.copy($scope.settings);

            settings.rescanTime = settings.rescanTime.value;
            settings.company = {
              id: $scope.company.id
            };
            settings.masterAgent = { agentId: settings.masterAgentId };
            DevicesService.updateAgentSettings(settings);
          }
        };

      }]);

}());
