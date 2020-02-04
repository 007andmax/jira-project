'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxCtrl',
    ['$scope', 'TaxesService',
      function ($scope, TaxesService) {

        $scope.editTax = function (form) {
          $scope.currentTax = {
            id: $scope.tax.id,
            rate: $scope.tax.rate,
            name: $scope.tax.name,
            isDefault: $scope.tax.isDefault
          };
          $scope.isEditing = true;
          form.$setPristine();
        };

        $scope.saveTax = function () {
          $scope.isEditing = false;
          TaxesService.save($scope.currentTax, function () {
            $scope.currentTax = {};
          });

        };

        $scope.cancelTax = function () {
          $scope.isEditing = false;
          $scope.currentTax = {};
        };

        $scope.deleteTax = function () {
          TaxesService.remove($scope.tax.id);
        };

        $scope.onChangeDefault = function () {
          $scope.disabledCheckbox = true;
          var taxToSave = angular.copy($scope.tax);
          taxToSave.isDefault = !taxToSave.isDefault;
          TaxesService.save(taxToSave, function () {
            $scope.tax.isDefault = taxToSave.isDefault;
            $scope.disabledCheckbox = false;
          });
        };


      }]);

}());
