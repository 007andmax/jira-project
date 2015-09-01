'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyProfileCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        $scope.companies = CompaniesService.getAllCompanies();

      }]);

}());
