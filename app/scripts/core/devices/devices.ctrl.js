'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.devicesCtrl',
    ['$scope', 'CompaniesService', '$state', 'DevicesService', '$filter',
      function ($scope, CompaniesService, $state, DevicesService, $filter) {

        $scope.isCollapsedGraph = true;

        $scope.devicesCount = DevicesService.getDevicesCount($scope);

        $scope.srefToCompanyDevices = function (companyId) {
          $state.go('companyDevices', { companyId: companyId });
        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        };

        $scope.getCompanyById = function (companyId) {
          return CompaniesService.getOneById(companyId);
        };

        $scope.$watch('devicesCount', function (value) {
          if (value) {
            $scope.companies = sortByCompanyName(value);
          }
        }, true);

        function sortByCompanyName(value) {
          var companies = [];
          for (var id in value) {
            if (id !== 'staticCopy') {
              var devices = value[id],
                company = CompaniesService.getOneById(id);
              company.devicesCounts = devices;
              companies.push(company);
            }
          }

          return $filter('orderBy')(companies, 'name');
        }

      }]);

}());
