'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyDevicesCtrl',
    ['$scope', 'CompaniesService', '$stateParams', 'quicktech.common.services.SharedStateService', 'DevicesService',
      function ($scope, CompaniesService, $stateParams, SharedStateService, DevicesService) {

        $scope.devicesHeaderState = SharedStateService.getSharedState('devicesHeader');

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        $scope.removeDevices = function () {
          DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.devicesHeaderState.checkedDevicesId);
        };

        $scope.shutdownDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.devicesHeaderState.checkedDevicesId, 'shutdown');
        };

        $scope.restartDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.devicesHeaderState.checkedDevicesId, 'reboot');
        };

        $scope.sendAlertDevices = function () {
          console.log($scope.devicesHeaderState.checkedDevicesId)
          //DevicesService
        };

        $scope.$watch('devicesHeaderState.checkedDevicesId', function (data) {
          $scope.isShowBulkAction = data && data.length > 0;
        })

      }]);

}());
