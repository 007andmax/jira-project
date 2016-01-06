'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.devicesCtrl',
    ['$scope', 'CompaniesService', '$state',
      function ($scope, CompaniesService, $state) {

        $scope.isCollapsedGraph = true;

        $scope.clientCompanies = CompaniesService.getClientCompanies();

        $scope.srefToCompanyDevices = function (companyId) {
          $state.go('companyDevices', {companyId: companyId});
        };

        $scope.toggleCollapsed = function(){
          $scope.isCollapsedGraph = !$scope.isCollapsedGraph;
        }

      }]);

}());
