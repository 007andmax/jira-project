'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', 'ProductsService', 'CompaniesService',
      function ($scope, ProductsService, CompaniesService) {

        $scope.openEditProduct = function () {
          $scope.showEditProduct = true;
          $scope.editProduct = $scope.product.staticCopy();
        };

        $scope.cancelEditProduct = function () {
          $scope.showEditProduct = false;
        };

        $scope.saveChangeProduct = function (form) {
          $scope.editProduct.category = {
            id: $scope.category.id
          };
          if (form.$valid) {
            $scope.disabledSaveChangeButton = true;
            ProductsService.saveProduct($scope.editProduct, function () {
              $scope.showEditProduct = false;
              $scope.disabledSaveChangeButton = false;
            })
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.deleteProduct = function () {
          ProductsService.deleteProduct($scope.product.versionedId.id)
        };

      }]);

}());
