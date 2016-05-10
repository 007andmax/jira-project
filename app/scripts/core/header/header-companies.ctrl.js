'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companiesCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'CompaniesService',
      function ($scope, SharedStateService, CompaniesService) {

        $scope.sharedState = SharedStateService.getSharedState('companiesHeader');
        $scope.companies = CompaniesService.getClientCompanies();

        $scope.$watch('searchValue', function (value) {
          $scope.sharedState.filter.keyword = value;
        });
      }]);

}());
