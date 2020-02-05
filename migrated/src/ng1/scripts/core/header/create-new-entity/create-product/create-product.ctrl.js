'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createProductCtrl',
    ['$scope', 'ProductsService', 'CompaniesService', '$rootScope', 'quicktech.common.services.PermissionsService',
      'TaxesService', '$timeout',
    function ($scope, ProductsService, CompaniesService, $rootScope, PermissionsService, TaxesService, $timeout) {

      $scope.discountAmountMsxLength;
      $scope.newCategoryNamePattern = /^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,100}$/;

      $scope.$watch('currentUser.permissions', function (permissions) {
        if (permissions && !PermissionsService.isAllowed('MANAGE_PRODUCTS')) {
          $scope.closeWindow();
        }
      });

      $scope.showModal = true;

      $timeout(function() {
        $scope.showModal = false;
      }, 50)

      $scope.stopPropagation = function(e) {
        e.stopPropagation()
      }

      $scope.mfgRequired = false;

      $scope.taxes = TaxesService.getAll();

      ProductsService.getCategories($scope, function (resp) {
        $scope.categories = resp;
      });

      $scope.vendors = CompaniesService.getVendors();

      var savedState = $scope.getLastSavedState('product');
      if (!savedState.type) {
        savedState = $scope.getLastSavedState('category');
      }

      $scope.$watch(function() {
        return $scope.editProduct.category;
      }, function(val) {
        // console.log($scope.editProduct.category && !$scope.editProduct.category.id, "IS TRUE")
      })

      var origin = savedState.item;

      if (savedState.type === 'product' && origin) {
        if (origin.name) {
          savedState.item = { category: origin };
        }



        $scope.editProduct = angular.copy(origin);
        $scope.editProduct.taxes = (origin.taxIds || []).map(function(taxId) {
          return $scope.taxes.find(function(el) {
            return el.id === taxId;
          })
        }).filter(function(el) { return el; })

        var company = CompaniesService.getOneById($scope.editProduct.companyId);

        if ($scope.editProduct.category && $scope.editProduct.category.default) {
          $scope.editProduct.category.name = null;
        } else {
          $scope.editProduct.category = angular.copy($scope.savedCategory);
        }
        if (company) {
          $scope.reloading = true;

          setTimeout(function() {
            $scope.reloading = false;
          }, 0)

          company = CompaniesService.getOneById(company.id);
          $scope.editProduct.company = company.clientType.toLowerCase() === 'vendor' ? company : undefined;
        }

      } else if (savedState.type === 'category' && origin) {
        $scope.editCategory = angular.copy(origin);
        $scope.editProduct = { taxes: [] };
        initDefaultTaxes();
      } else {
        $scope.editCategory = {};
        $scope.editProduct = { taxes: [] };
        initDefaultTaxes();
      }

      $scope.isShowingErrors = function (form, fieldName) {
        return $scope.triedToSaveProduct && form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
      };

      $scope.isShowingCreateCategoryError = function (form, fieldName) {
        return form[fieldName] && ($scope.triedToSaveCategory || (form[fieldName].$dirty && !form[fieldName].$error['required'])) && !form[fieldName].$valid;
      };

      $scope.isUniqueCategoryName = function (ngModelCtrl, modelId, afterValidationCallback) {
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
        afterValidationCallback();
      };

      $scope.$watch('editProduct.company', function (value) {
        // console.log($scope.editProductForm, 'editproduct')
        if ($scope.editProductForm.editProductVendor && $scope.editProductForm.editProductVendor.$dirty) {
          $scope.editProductForm.editProductVendor.$setValidity('vendorNotExist', !value || typeof value !== 'string');
        }
      });

      $scope.getItemName = function (model) {
        return model && model.name ? model.name : model;
      };

      $scope.addCategory = function (form) {
        var keys = Object.keys(form.$error);
        if (form.$valid || (keys.length === 1 && keys[0] === 'nonexistentCategory')) {
          ProductsService.saveCategory({ name: $scope.editProduct.category }, function (category) {
            $scope.editProduct.category = category;
            $scope.validateCategory($scope.editProduct.category, form.$$parentForm);
            form.$setPristine();
          });
          $scope.createNewCategory = true;
        } else {
          $scope.triedToSaveCategory = true;
        }
      };

      $scope.saveChangeProduct = function (form) {
        $scope.validateCategory($scope.editProduct.category, form);

        // form.newTaxForm.name.$setValidity('required', false);
        // form.newTaxForm.rate.$setValidity('required', false);


        function checkValid(form) {
          if (form.editProductILC.$valid && form.editProductCategory.$valid && form.editProductDescription.$valid && form.editProductILC.$valid && form.editProductMfg.$valid && form.sale.$valid && form.cost.$valid) {
            return true;
          }

          return false;
        }

        if (form.$valid || checkValid(form)) {

          $scope.disabledSaveChangeButton = true;

          console.log($scope.editProduct, '$scope.editProduct');
          var changedProduct = {
            versionedId: $scope.editProduct.versionedId,
            cost: $scope.editProduct.cost,
            sale: $scope.editProduct.sale,
            ilc: $scope.editProduct.ilc,
            manufacture: $scope.editProduct.manufacture,
            description: $scope.editProduct.description,
            companyId: $scope.editProduct.company ? $scope.editProduct.company.id : undefined,
            taxIds: [],
            categoryId: $scope.editProduct.category.id,
            glNumber: $scope.editProduct.glNumber
          };
          for(var i=0; i<$scope.editProduct.taxes.length; i++) {
            changedProduct.taxIds.push($scope.editProduct.taxes[i].id)
          }

          ProductsService.saveProduct(changedProduct, function (resp) {
            $scope.disabledSaveChangeButton = false;

            $rootScope.$broadcast('newProductHasBeenCreated', resp.id);
            if (!$scope.savedState.items.length) {
              $scope.closeWindow();
            }
          });
          unsubscribeClosingEvent();
        } else {
          $scope.triedToSaveProduct = true;
        }
      };

      $scope.validateProductIls = function (ngModelCtrl, modelId, afterValidationCallback) {
        var validationResult = ProductsService.isILCUnique(ngModelCtrl.$viewValue, modelId || '', function () {
          ngModelCtrl.$setValidity('unique', validationResult.value);
          afterValidationCallback();
        });
      };

      $scope.validateProductMnf = function (ngModelCtrl, modelId, afterValidationCallback) {
        var validationResult = ProductsService.isMfgUnique(ngModelCtrl.$viewValue, modelId || '', function () {
          ngModelCtrl.$setValidity('unique', validationResult.value);
          afterValidationCallback();
        });
      };

      $scope.validateSaleAndCost = function (form) {

        var valid = ((!$scope.editProduct.sale  && $scope.editProduct.sale != 0) || (!$scope.editProduct.cost && $scope.editProduct.cost != 0))
          || ($scope.editProduct.sale * 1) >= ($scope.editProduct.cost * 1);
        form.sale.$setValidity('smallerThanCost', valid);
        form.cost.$setValidity('biggerThanSale', valid);

      };

      $scope.validateCategory = function (category, form) {
        form.editProductCategory.$setValidity('nonexistentCategory', !category || typeof category !== 'string' || !category.trim());
      };

      $scope.getValidationMessage = function (form) {
        if (form.$error.required) {
          for (var i = 0; i < form.$error.required.length; i++) {
            if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
              return 'Please fill in the required field(s).';
            }
          }
        }
        if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.required) {
          return "Please select a Discount Amount!";
        }

        if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.min) {
          return "Discount amount mustn't be less then 0!";
        }

        if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.max) {
          return "Percent amount mustn't be greater then 100!";
        }

        if (form.discountAmount && form.discountAmount.$error && form.discountAmount.$error.pattern) {
          return "Only numbers allowed in Discount Amount!";
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

      var unsubscribeClosingEvent = $scope.$on('createNewWindowClosing', createNewWindowClosing);

      function createNewWindowClosing() {
        var product = $scope.editProduct;
        var isProductChanged;
        // console.log(origin, product, savedState.type, 'PRODUCT')
        if (savedState.type === 'product') {
          if (origin) {
            isProductChanged = product.description !== origin.description
              || product.cost !== origin.cost
              || product.sale !== origin.sale
              || product.ilc !== origin.ilc
              || product.manufacture !== origin.manufacture
              || (origin.category ? !product.category || product.category.id !== origin.category.id : product.category)
              || (origin.company ? !product.company || product.company.id !== origin.company.id : product.company);
          } else {
            isProductChanged = product.description || product.cost || product.sale || product.ilc ||
              product.manufacture || (product.category && product.category.id) || (product.company && product.company.id);
          }
        } else {
          if (origin) {
            isProductChanged = $scope.editCategory.name !== origin.name;
          } else {
            isProductChanged = $scope.editProduct.description || product.cost || product.sale || product.ilc || product.manufacture || product.category || product.company;
          }
        }

        if (isProductChanged) {
          $scope.savedState.types.unshift('product');
          $scope.savedState.items.unshift($scope.editProduct);
        }
      }

      function initDefaultTaxes() {
        var length = $scope.taxes.length;
        for (var i = 0; i < length; i++) {
          var tax = $scope.taxes[i];
          if (tax.isDefault) {
            $scope.editProduct.taxes.push(tax);
          }
        }
      }

    }]);

}());
