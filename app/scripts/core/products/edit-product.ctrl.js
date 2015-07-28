'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.editProductCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        if ($scope.product) {
          $scope.editProduct = $scope.product.staticCopy();
          $scope.editProduct.category = {id: $scope.category.id};
        } else {
          $scope.editProduct = {
            category: {id: $scope.category.id}
          };
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditProduct = function () {
          $scope.product ? $scope.$emit('cancelEditProduct') : $scope.$emit('cancelCreateProduct');
        };

        $scope.saveChangeProduct = function (form) {
          if (form.$valid) {
            $scope.disabledSaveChangeButton = true;
            ProductsService.saveProduct($scope.editProduct, function () {
              $scope.product ? $scope.$emit('cancelEditProduct') : $scope.$emit('cancelCreateProduct');
              $scope.disabledCreateProductButton = false;
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

      }]);

}());
