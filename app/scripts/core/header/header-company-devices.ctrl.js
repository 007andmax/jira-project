'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyDevicesCtrl',
    ['$scope', 'CompaniesService', '$stateParams', 'quicktech.common.services.SharedStateService', 'DevicesService',
      function ($scope, CompaniesService, $stateParams, SharedStateService, DevicesService) {

        $scope.devicesHeaderState = SharedStateService.getSharedState('devicesHeader');

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        $scope.removeDevices = function(){
          console.log($scope.devicesHeaderState.checkedDevicesId)
          //DevicesService
        };

        $scope.shutdownDevices = function(){
          console.log($scope.devicesHeaderState.checkedDevicesId)
          //DevicesService
        };

        $scope.restartDevices = function(){
          console.log($scope.devicesHeaderState.checkedDevicesId)
          //DevicesService
        };

        $scope.sendAlertDevices = function(){
          console.log($scope.devicesHeaderState.checkedDevicesId)
          //DevicesService
        };

        $scope.$watch('devicesHeaderState.checkedDevicesId', function (data) {
          $scope.isShowBulkAction = data && data.length > 0;
        })

      }]);

}());
