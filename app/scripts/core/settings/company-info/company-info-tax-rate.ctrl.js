'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoTaxRateCtrl',
    ['$scope',
      function ($scope) {

        $scope.editTaxRate = function (form) {
          $scope.currentTaxRate = {
            "rate": $scope.tax.rate,
            "code": $scope.tax.code
          };
          $scope.isEditing = true;
          form.$setPristine();
        };

        $scope.saveTax = function () {
          $scope.isEditing = false;
          $scope.taxRates[$scope.$index] = {
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

        $scope.deleteTaxRate = function () {
          $scope.taxRates.splice($scope.$index, 1);
        };


      }]);

}());
