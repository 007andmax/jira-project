'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.deviceTabCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      function ($scope, SharedStateService) {

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
          console.log('restart - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.shutdown = function () {
          console.log('shutdown - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.remove = function () {
          console.log('remove - ' + $scope.agent.agentId);
          //DevicesService
        }

      }]);

}());
