'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoTaxRateCtrl',
    ['$scope', 'TaxRatesService',
      function ($scope, TaxRatesService) {

        $scope.editTaxRate = function (form) {
          $scope.currentTaxRate = {
            rate: $scope.tax.rate,
            code: $scope.tax.code
          };
          $scope.isEditing = true;
          form.$setPristine();
        };

        $scope.saveTax = function () {
          $scope.isEditing = false;
          TaxRatesService.save($scope.tax);
        };

        $scope.cancelTax = function () {
          $scope.isEditing = false;
          $scope.tax.rate = $scope.currentTaxRate.rate;
          $scope.tax.code = $scope.currentTaxRate.code;
        };

        $scope.deleteTaxRate = function () {
          TaxRatesService.deleteTaxRate($scope.tax.versionedId.id);
        };


      }]);

}());
