'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.defaultTaxRatesCtrl',
    ['$scope', 'TaxRatesService',
      function ($scope, TaxRatesService) {

        $scope.checkedTax = {};
        $scope.isTechCompanyTax = true;
        $scope.showCheckboxes = true;

        $scope.$watch('techCompanyTax', function (val) {
          $scope.taxRates = val;
        });

        $scope.showEditTaxForm = function (taxId) {
          $scope.editTaxKey = taxId;
        };

        $scope.onChangeCheckbox = function () {
          var count = 0;

          for (var id in $scope.checkedTax) {
            if ($scope.checkedTax[id]) {
              count++
            }
          }

          $scope.quantitySelectTAx = count;
        };

        $scope.deleteTax = function (taxId) {
          if($scope.checkedTax[taxId]){
            $scope.checkedTax[taxId] = false;
            $scope.onChangeCheckbox();
          }
          TaxRatesService.deleteTaxRate(taxId)
        }

      }]);

}());
