'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxCtrl',
    ['$scope', 'TaxesService',
      function ($scope, TaxesService) {

        $scope.editTax = function (form) {
          $scope.currentTax = {
            id: $scope.tax.id,
            rate: $scope.tax.rate,
            name: $scope.tax.name
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


      }]);

}());
