'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.editProductCtrl',
    ['$scope', '$rootScope', 'ProductsService',
      function ($scope, $rootScope, ProductsService) {

        if ($scope.product) {
          $scope.editProduct = $scope.product.staticCopy();
          $scope.editProduct.category = {id: $scope.category.id};
        } else {
          $scope.actualCode = ProductsService.getActualCode($scope);
          $scope.editProduct = {
            category: {id: $scope.category.id}
          };
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditProduct = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.saveChangeProduct = function (form) {
          if (form.$valid) {
            $scope.disabledSaveChangeButton = true;
            ProductsService.saveProduct($scope.editProduct, function () {
              $rootScope.$broadcast('cancelEditForm', 'isProductCreation');
              $scope.disabledCreateProductButton = false;
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.validateProductName = function (ngModelCtrl, modelId) {

          if ($scope.editProduct.vendor) {
            var validationResult = ProductsService.isProductNameUnique(ngModelCtrl.$viewValue, modelId || '', $scope.editProduct.vendor.id, function () {
              ngModelCtrl.$setValidity('unique', validationResult.value);
            });
          }
        };

        $scope.validateSaleAndCost = function (form) {

          var valid = (!$scope.editProduct.sale || !$scope.editProduct.cost)
            || ($scope.editProduct.sale * 1) > ($scope.editProduct.cost * 1);
          form.sale.$setValidity('smallerThanCost', valid);
          form.cost.$setValidity('biggerThanSale', valid);

        };

      }]);

}());
