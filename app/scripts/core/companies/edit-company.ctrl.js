'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.companies.editCompanyCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$state',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, SharedStateService,
                $stateParams, $state) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.$watch('companies.length', function (companiesCount) {
          headerSharedState.count = companiesCount;
        });

        if ($stateParams.companyId) {

          var company = CompaniesService.getOneById($stateParams.companyId);
          var companyData = CompaniesService.getCompanyData($stateParams.companyId);

          if (!company) {
            $state.go('companies');
            throw 'wrong cmpany id specified!';
          }

          $scope.editCompany = {
            id: $stateParams.companyId,
            name: company.name,
            type: company.type,
            domain: company.domain,
            primaryAddress: companyData.primaryAddress,
            addresses: companyData.addresses || [{}],
            contacts: companyData.contacts || [{}]
          };

        } else {
          $scope.editCompany = {
            addresses: [{}],
            contacts: [{}]
          };
        }

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('companiesHeader');
        });

      }]);

}());
