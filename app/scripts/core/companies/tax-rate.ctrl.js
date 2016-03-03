'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.taxRateCtrl',
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
            "versionedId": $scope.tax.versionedId,
            "rate": $scope.tax.rate,
            "code": $scope.tax.code
          };
        };

        $scope.cancelTax = function () {
          $scope.isEditing = false;
          $scope.tax.rate = $scope.currentTaxRate.rate;
          $scope.tax.code = $scope.currentTaxRate.code;
        };

      }]);

}());
