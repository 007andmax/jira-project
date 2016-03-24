'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.usersCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'CompaniesService',
      function ($scope, SharedStateService, CompaniesService) {

        $scope.searchValue = '';
        $scope.chooseCompany = false;
        $scope.sharedState = SharedStateService.getSharedState('usersHeader');
        $scope.companies = CompaniesService.getClientCompanies();

        $scope.clearInput = function () {
          $scope.searchValue = '';
          $scope.chooseCompany = false;
          $scope.sharedState.filter.companyId = '';
          $scope.sharedState.filter.keyword = '';
        };

        $scope.$watch('searchValue', function (val) {
          if (!val) {
            return
          }

          if (typeof val === 'object') {
            $scope.chooseCompany = true;
            $scope.sharedState.filter.companyId = val.id;
            $scope.sharedState.filter.keyword = '';
          } else {
            $scope.chooseCompany = false;
            $scope.sharedState.filter.companyId = '';
            $scope.sharedState.filter.keyword = val;
          }
        });

      }]);

}());
