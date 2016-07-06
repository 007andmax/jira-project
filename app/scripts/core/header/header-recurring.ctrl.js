'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.recurringCtrl',
    ['$scope', '$rootScope', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      function ($scope, $rootScope, CompaniesService, SharedStateService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.companies = CompaniesService.getClientCompanies().filter(function (company) {
          return !company.isDefault;
        });

        $scope.filterByCompany = function (company) {
          $rootScope.$broadcast('showInvoice', company.id)
        };

        if (globalSearch.reccuringByCompanyFilter) {
          var company = CompaniesService.getOneById(globalSearch.reccuringByCompanyFilter);
          $scope.company = company.name;
          $scope.filterByCompany(company);
          globalSearch.reccuringByCompanyFilter = undefined;
        }

        $scope.$watch('company', function (value) {
          if (!value) {
            $rootScope.$broadcast('showInvoice');
          }
        });

        $scope.clearInput = function () {
          $scope.company = '';
        };

      }]);

}());
