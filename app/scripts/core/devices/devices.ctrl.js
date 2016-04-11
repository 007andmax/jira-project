'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.devicesCtrl',
    ['$scope', 'CompaniesService', '$state', 'DevicesService',
      function ($scope, CompaniesService, $state, DevicesService) {

        $scope.isCollapsedGraph = true;

        $scope.devicesCount = DevicesService.getDevicesCount($scope, function () {
          console.log($scope.devicesCount)
        });

        $scope.srefToCompanyDevices = function (companyId) {
          $state.go('companyDevices', { companyId: companyId });
        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        };

        $scope.getCompanyById = function (companyId) {
          return CompaniesService.getOneById(companyId);
        }

      }]);

}());
