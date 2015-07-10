'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.companies.TaxRateCtrl',
    ['$scope',
      function ($scope) {

        $scope.editTaxRate = function () {
          $scope.currentTaxRate = $scope.$parent.tax.rate;
          $scope.currentTaxCode = $scope.$parent.tax.code;
          $scope.isEditing = true;
        };

        $scope.saveTax = function () {
          if (!($scope.$parent.tax.code && $scope.$parent.tax.rate)) {
            return;
          }
          ;
          $scope.isEditing = false;
          $scope.editCompany.taxRates[$scope.editCompany.taxRates.indexOf($scope.$parent.tax)] = {
            "rate": $scope.$parent.tax.rate,
            "code": $scope.$parent.tax.code
          };
        };

        $scope.cancelTax = function () {
          $scope.isEditing = false;
          $scope.$parent.tax.rate = $scope.currentTaxRate;
          $scope.$parent.tax.code = $scope.currentTaxCode;
        };

        $scope.deleteTaxRate = function () {
          $scope.editCompany.taxRates.splice($scope.editCompany.taxRates.indexOf($scope.$parent.tax), 1);
        };

      }]);

}());
