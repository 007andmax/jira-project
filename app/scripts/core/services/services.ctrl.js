'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService', 'CompaniesService',
      function ($scope, ServicesService, CompaniesService) {

        $scope.servicesData = ServicesService.getServicesData($scope);

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.numberPattern = /^\+?[0-9]{0,19}$/;

      }]);

}());
