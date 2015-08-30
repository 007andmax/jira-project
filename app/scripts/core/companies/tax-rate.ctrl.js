'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.TaxRateCtrl',
    ['$scope',
      function ($scope) {

        $scope.editTaxRate = function () {
          $scope.currentTaxRate = {
            "rate": $scope.tax.rate,
            "code": $scope.tax.code
          };
          $scope.isEditing = true;
        };

        $scope.saveTax = function () {
          $scope.isEditing = false;
          $scope.editCompany.taxRates[$scope.$index] = {
            "rate": $scope.tax.rate,
            "code": $scope.tax.code
          };
        };

        $scope.cancelTax = function () {
          $scope.isEditing = false;
          $scope.tax.rate = $scope.currentTaxRate.rate;
          $scope.tax.code = $scope.currentTaxRate.code;
        };

        $scope.deleteTaxRate = function () {
          $scope.editCompany.taxRates.splice($scope.$index, 1);
        };

      }]);

}());
