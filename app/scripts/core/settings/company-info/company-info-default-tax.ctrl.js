'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoDefaultTaxCtrl',
    ['$scope', 'TaxRatesService',
      function ($scope, TaxRatesService) {

        var taxRatesCopy;

        TaxRatesService.getAllByCompany($scope.currentCompany.id, $scope, function (resp) {
          taxRatesCopy = angular.copy(resp);
          $scope.taxRates = angular.copy(resp);
        });
        $scope.taxRateNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.newTaxRate = {};
        $scope.savingTaxProcess = false;

        $scope.validateTaxRateCode = function (ngModelCtrl) {

          var taxRateCount = 0;

          for (var i = 0; i < $scope.taxRates.length; i++) {
            if (($scope.taxRates[i].code).toLowerCase() === (ngModelCtrl.$viewValue).toLowerCase()) {
              taxRateCount++;
            }
          }

          ngModelCtrl.$setDirty();

          if (taxRateCount > 1) {
            ngModelCtrl.$setValidity('unique', false);
          } else {
            ngModelCtrl.$setValidity('unique', true);
          }
        };

        $scope.validateNewTaxRate = function (form) {

          var taxRateCount = 0;

          for (var i = 0; i < $scope.taxRates.length; i++) {
            if (($scope.taxRates[i].code).toLowerCase() === (form.code.$viewValue).toLowerCase()) {
              taxRateCount++;
            }
          }

          if (taxRateCount >= 1) {
            form.code.$setValidity('unique', false);
          } else {
            form.code.$setValidity('unique', true);
          }

        };

        $scope.saveNewTax = function (form) {

          if (form.$valid) {
            $scope.taxRates.push($scope.newTaxRate);
            $scope.newTaxRate = {};
            form.$setPristine()
          }
        };

        $scope.saveAllTax = function () {

          $scope.savingTaxProcess = true;

          for (var i = 0; i < $scope.taxRates.length; i++) {
            $scope.taxRates[i].company = {id: $scope.currentCompany.id};
          }

          TaxRatesService.saveList($scope.taxRates, function (resp) {
            taxRatesCopy = angular.copy(resp);
            $scope.taxRates = angular.copy(resp);
            $scope.savingTaxProcess = false;
            $scope.isTaxRatesChanges = false
          })

        };

        $scope.$watch('taxRates', function () {
          $scope.isTaxRatesChanges = !angular.equals(taxRatesCopy, $scope.taxRates);
        }, true)

      }
    ])
  ;

}());
