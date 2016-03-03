'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.taxRatesCtrl',
    ['$scope', 'TaxRatesService', 'CompaniesService',
      function ($scope, TaxRatesService, CompaniesService) {

        TaxRatesService.getAllTaxRates($scope, function (resp) {
          var allTaxRates = angular.copy(resp);

          $scope.techCompanyTax = allTaxRates[CompaniesService.getCurrentCompany().id] || [];

          if (delete allTaxRates[CompaniesService.getCurrentCompany().id]) {
            $scope.clientCompanyTax = allTaxRates;
          }

        });

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.deleteTax = function (taxId) {
          TaxRatesService.deleteTaxRate(taxId)
        }

      }]);

}());
