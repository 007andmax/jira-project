'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.taxRatesCtrl',
    ['$scope', 'TaxRatesService', 'CompaniesService',
      function ($scope, TaxRatesService, CompaniesService) {

        $scope.orderTaxRates = {
          field: 'code',
          reverse: false
        };

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
        };

        $scope.setOrderForTaxRates = function (option) {
          if (option === $scope.orderTaxRates.field) {
            $scope.orderTaxRates.reverse = !$scope.orderTaxRates.reverse;
          } else {
            $scope.orderTaxRates.field = option;
            $scope.orderTaxRates.reverse = false;
          }
        };

        $scope.orderByForTaxRates = function (item) {
          if ($scope.orderTaxRates.field === 'code') {
            return item.code;
          } else if ($scope.orderTaxRates.field === 'rate') {
            return item.rate;
          }

        };

      }]);

}());
