'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxCtrl',
    ['$scope', 'TaxesService',
      function ($scope, TaxesService) {

        $scope.editTax = function (form) {
          $scope.currentTax = {
            rate: $scope.tax.rate,
            name: $scope.tax.name
          };
          $scope.isEditing = true;
          form.$setPristine();
        };

        $scope.saveTax = function () {
          $scope.isEditing = false;
          TaxesService.save($scope.tax);
        };

        $scope.cancelTax = function () {
          $scope.isEditing = false;
          $scope.tax.rate = $scope.currentTax.rate;
          $scope.tax.name = $scope.currentTax.name;
        };

        $scope.deleteTax = function () {
          TaxesService.remove($scope.tax.id);
        };


      }]);

}());
