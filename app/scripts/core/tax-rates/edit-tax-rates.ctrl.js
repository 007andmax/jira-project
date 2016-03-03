'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.editTaxRateCtrl',
    ['$scope', 'TaxRatesService', 'CompaniesService',
      function ($scope, TaxRatesService, CompaniesService) {

        if ($scope.taxRate && $scope.taxRate.versionedId && $scope.taxRate.versionedId.id) {
          $scope.editTax = angular.copy($scope.taxRate);
        } else {
          $scope.editTax = {
            company: {
              id: CompaniesService.getCurrentCompany().id
            }
          }
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveTax || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.saveEditTax = function (form) {
          if (form.$valid) {
            $scope.disabledSaveButton = true;
            TaxRatesService.save($scope.editTax, function () {
              $scope.disabledSaveButton = false;
              $scope.showEditTaxForm()
            })
          } else {
            $scope.triedToSaveTax = true;
          }
        };

        $scope.validateTaxCode = function (ngModelCtrl, modelId) {
          var uniqueNameCount = 0;

          if ($scope.taxRates) {
            for (var i = 0; i < $scope.taxRates.length; i++) {
              if ((ngModelCtrl.$viewValue.toLowerCase() === $scope.taxRates[i].code.toLowerCase()) && (modelId !== $scope.taxRates[i].versionedId.id)) {
                uniqueNameCount++;
              }
            }
          }

          ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
        };

        $scope.getValidationMessage = function (form) {

          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editTaxCode && form.editTaxCode.$error) {

            if (form.editTaxCode.$error.unique) {
              return 'Tax Description already exists!';
            }
          }

        };

      }]);

}());
