'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.companyCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        //$scope.services = ServicesService.getAllByCompany($scope, $scope.company.id);

        $scope.serviceData = ServicesService.getServicesData($scope, function () {
          $scope.serviceData = $scope.serviceData[$scope.company.id];
        });

        $scope.cancelCreateCompanyService = function () {
          console.log("cancelCreateService");
          $scope.showCreateCompanyService = false;
        };
        $scope.saveCreateCompanyService = function () {
          console.log("saveCreateService");
        };

        $scope.createCompanyService = function () {
          console.log("createService");
          $scope.showCreateCompanyService = true;
        };

      }]);

}());
