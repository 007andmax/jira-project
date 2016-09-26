'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.editProductCtrl',
    ['$scope', '$rootScope', 'ProductsService',
      function ($scope, $rootScope, ProductsService) {

        if ($scope.pageTab === 'list') {
          $scope.withCategory = true;
        }

        if ($scope.product) {
          $scope.editProduct = angular.copy($scope.product);
          if ($scope.category) {
            $scope.editProduct.category = { id: $scope.category.id };
          }

          if ($scope.editProduct.category.default) {
            $scope.editProduct.category.name = null;
          }
        } else if ($scope.category) {
          $scope.editProduct = {
            category: { id: $scope.category.id }
          };
        } else {
          $scope.editProduct = {};
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditProduct = function () {
          if ($scope.withCategory) {
            $scope.setShowCreateProductInList(false);
          }
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.saveChangeProduct = function (form) {
          if ($scope.withCategory) {
            $scope.validateCategory($scope.editProduct.category, form);
          }

          if (form.$valid) {

            if ($scope.product) {
              var isIlcChange = $scope.editProduct.ilc != $scope.product.ilc;
              var isManufactureChange = $scope.editProduct.manufacture != $scope.product.manufacture;
              var isDescriptionChange = $scope.editProduct.description != $scope.product.description;
              var isCategoryChange = ($scope.editProduct.category && $scope.editProduct.category.id) !== ($scope.product.category && $scope.product.category.id);
              var isVendorChange = ($scope.editProduct.vendor && $scope.editProduct.vendor.id) !== ($scope.product.vendor && $scope.product.vendor.id);
              var isCostChange = $scope.editProduct.cost != $scope.product.cost;
              var isSaleChange = $scope.editProduct.sale != $scope.product.sale;

              if (!(isIlcChange || isManufactureChange || isDescriptionChange || isCategoryChange || isVendorChange || isCostChange || isSaleChange)) {
                $rootScope.$broadcast('cancelEditForm', 'isProductCreation');
                return;
              }
            }

            $scope.disabledSaveChangeButton = true;

            if ((typeof $scope.editProduct.vendor) === 'string') {
              if ($scope.editProduct.vendor.length > 0) {
                $scope.editProduct.vendor = { name: $scope.editProduct.vendor };
              } else {
                $scope.editProduct.vendor = undefined;
              }
            }

            ProductsService.saveProduct($scope.editProduct, function (versionedId, isCreated) {
              $scope.cancelEditProduct();
              $scope.disabledSaveChangeButton = false;
              if (isCreated) {
                $scope.setCreatedProductId(versionedId.id);
              }
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.validateProductIls = function (ngModelCtrl, modelId) {
          var validationResult = ProductsService.isILCUnique(ngModelCtrl.$viewValue, modelId || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.validateProductMnf = function (ngModelCtrl, modelId) {
          var validationResult = ProductsService.isMfgUnique(ngModelCtrl.$viewValue, modelId || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.validateSaleAndCost = function (form) {

          var valid = (!$scope.editProduct.sale || !$scope.editProduct.cost)
            || ($scope.editProduct.sale * 1) >= ($scope.editProduct.cost * 1);
          form.sale.$setValidity('smallerThanCost', valid);
          form.cost.$setValidity('biggerThanSale', valid);

        };

        $scope.validateCategory = function (category, form) {
          form.editProductCategory.$setValidity('nonexistentCategory', !!category && typeof category !== 'string');
        };

        $scope.getValidationMessage = function (form) {
          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editProductILC && form.editProductILC.$error && form.editProductILC.$error.unique) {
            return 'Product ILC already exists!';
          }

          if (form.editProductILC && form.editProductILC.$error && form.editProductILC.$error.maxlength) {
            return 'Product ILC exceeds maximum length.';
          }

          if (form.editProductMfg && form.editProductMfg.$error && form.editProductMfg.$error.unique) {
            return 'Product MFG# already exists!';
          }

          if (form.editProductMfg && form.editProductMfg.$error && form.editProductMfg.$error.maxlength) {
            return 'Product MFG# exceeds maximum length.';
          }

          if (form.editProductCategory && form.editProductCategory.$error && form.editProductCategory.$error.nonexistentCategory) {
            return 'Please select an existing category.';
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
