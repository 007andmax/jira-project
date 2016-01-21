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

            if((typeof $scope.editProduct.vendor) === 'string'){
              $scope.editProduct.vendor = undefined;
            }

            ProductsService.saveProduct($scope.editProduct, function () {
              $rootScope.$broadcast('cancelEditForm', 'isProductCreation');
              $scope.disabledSaveChangeButton = false;
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
          } else {
            ngModelCtrl.$setValidity('unique', true);
          }
        };

        $scope.validateSaleAndCost = function (form) {

          var valid = (!$scope.editProduct.sale || !$scope.editProduct.cost)
            || ($scope.editProduct.sale * 1) > ($scope.editProduct.cost * 1);
          form.sale.$setValidity('smallerThanCost', valid);
          form.cost.$setValidity('biggerThanSale', valid);

        };

        $scope.getValidationMessage = function (form) {
          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editProductName && form.editProductName.$error && form.editProductName.$error.minlength) {
            return 'Product name is too short!';
          }

          if (form.editProductName && form.editProductName.$error && form.editProductName.$error.maxlength) {
            return 'Product name exceeds maximum length.';
          }

          if (form.editProductName && form.editProductName.$error && form.editProductName.$error.unique) {
            return 'Product name already exists!';
          }

          if ((form.editProductDescription && form.editProductDescription.$error && form.editProductDescription.$error.maxlength)
            || (form.editProductDescriptionCopy && form.editProductDescriptionCopy.$error && form.editProductDescriptionCopy.$error.maxlength)) {
            return 'Product description exceeds maximum length.';
          }

          if (form.sale && form.sale.$error && form.sale.$error.smallerThanCost) {
            return 'Sale price must be higher than cost price.';
          }

        };

      }]);

}());
