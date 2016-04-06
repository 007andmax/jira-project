'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.defaultTaxRatesCtrl',
    ['$scope', 'TaxRatesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, TaxRatesService, UserConfirmationsService) {

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

        $scope.deleteTax = function (tax) {
          var confirmMesage = 'Do you want to delete ' + tax.code + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            if($scope.checkedTax[tax.versionedId.id]){
              $scope.checkedTax[tax.versionedId.id] = false;
              $scope.onChangeCheckbox();
            }
            TaxRatesService.deleteTaxRate(tax.versionedId.id)
          });
        }

      }]);

}());
