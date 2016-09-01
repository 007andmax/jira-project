'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxRatesCtrl',
    ['$scope', 'TaxRatesService',
      function ($scope, TaxRatesService) {

        TaxRatesService.getAllByCompany($scope.currentUser.company.id, $scope, function (resp) {
          $scope.taxRates = angular.copy(resp);
        });
        $scope.taxRateNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.newTaxRate = {};

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

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

        $scope.saveNewTax = function (form) {

          if (form.$valid) {
            $scope.newTaxRate.company = {};
            $scope.newTaxRate.company.id = $scope.currentUser.company.id;
            TaxRatesService.save($scope.newTaxRate, function (resp) {
              $scope.newTaxRate = {};
              form.$setPristine();
            })
          }
        };

      }
    ])
  ;

}());
