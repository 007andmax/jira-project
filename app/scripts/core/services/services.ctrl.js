'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService', 'Utils', 'CompaniesService',
      function ($scope, ServicesService, Utils, CompaniesService) {

        $scope.servicesData = ServicesService.getServicesData($scope);

        $scope.checkedServices = {};

        $scope.getCheckedDefaultServices = function () {
          var checkedDefaultServices = [];

          //for the case when checked service had been deleted
          var defaultServices = $scope.servicesData['default'];

          for (var serviceId in $scope.checkedServices) {
            if ($scope.checkedServices[serviceId] && Utils.findById(defaultServices, serviceId)) {
              checkedDefaultServices.push(serviceId)
            }
          }

          return checkedDefaultServices;
        };

        $scope.servicesData = ServicesService.getServicesData($scope);

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.numberPattern = /^\+?[0-9]{0,19}$/;

      }]);

}());
