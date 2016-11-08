'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createProductCtrl',
    ['$scope', 'ProductsService', 'CompaniesService', '$rootScope', 'quicktech.common.services.PermissionsService',
    function ($scope, ProductsService, CompaniesService, $rootScope, PermissionsService) {

      $scope.$watch('currentUser.permissions', function (permissions) {
        if (permissions && !PermissionsService.isAllowed('MANAGE_PRODUCTS')) {
          $scope.closeWindow();
        }
      });

      ProductsService.getCategories($scope, function (resp) {
        $scope.categories = resp;
      });

      $scope.vendors = CompaniesService.getVendors();

      var savedState = $scope.getLastSavedState('product');
      if (!savedState.type) {
        savedState = $scope.getLastSavedState('category');
      }

      if (savedState.type === 'product' && savedState.item) {
        if (savedState.item.name) {
          savedState.item = { category: savedState.item };
        }

        $scope.editProduct = angular.copy(savedState.item);
        var company = $scope.editProduct.company;

        if ($scope.editProduct.category && $scope.editProduct.category.default) {
          $scope.editProduct.category.name = null;
        }
        if (company) {
          company = CompaniesService.getOneById(company.id);
          $scope.editProduct.company = company.isVendor ? company : undefined;
        }

      } else if (savedState.type === 'category' && savedState.item) {
        $scope.editCategory = angular.copy(savedState.item);

      } else {
        $scope.editProduct = {};
        $scope.editCategory = {};
      }

      $scope.isShowingErrors = function (form, fieldName) {
        return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
      };

      $scope.isShowingCreateCategoryError = function (form, fieldName) {
        return form[fieldName] && ($scope.triedToSaveCategory || form[fieldName].$dirty) && !form[fieldName].$valid;
      };

      $scope.isUniqueCategoryName = function (ngModelCtrl, modelId) {
        var categories = $scope.categories;
        if (!categories) {
          return;
        }

        var uniqueNameCount = 0;
        for (var i = 0; i < categories.length; i++) {
          var category = categories[i];
          if ((ngModelCtrl.$viewValue.toLowerCase() === category.name.toLowerCase()) && (modelId !== category.id)) {
            uniqueNameCount++;
          }
        }
        ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
      };

      $scope.$watch('editProduct.company', function (value) {
        if ($scope.editProductForm.editProductVendor.$dirty) {
          $scope.editProductForm.editProductVendor.$setValidity('vendorNotExist', !value || typeof value !== 'string');
        }
      });

      $scope.getItemName = function (model) {
        return model ? model.name : '';
      };

      $scope.addCategory = function (form) {
        if (form.$valid) {
          ProductsService.saveCategory($scope.editCategory, function () {
            $scope.editCategory = {};
            form.$setPristine();
          });
        } else {
          $scope.triedToSaveCategory = true;
        }
      };

      $scope.saveChangeProduct = function (form) {
        $scope.validateCategory($scope.editProduct.category, form);

        if (form.$valid) {

          $scope.disabledSaveChangeButton = true;

          ProductsService.saveProduct($scope.editProduct, function (resp) {
            $scope.disabledSaveChangeButton = false;

            $rootScope.$broadcast('newProductHasBeenCreated', resp.id);
            if (!$scope.savedState.items.length) {
              $scope.closeWindow();
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

      $scope.$on('createNewEntity', function (event, type) {
        $scope.savedState.types.unshift('product');
        $scope.savedState.items.unshift($scope.editProduct);
        $scope.setOpenedTab(type);
      });

    }]);

}());
