'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editProductCtrl',
    ['$scope', 'RecurringService', 'ProductsService',
      function ($scope, RecurringService, ProductsService) {

        $scope.editProduct = {};

        $scope.productCategories = ProductsService.getCategories($scope);

        if ($scope.product !== undefined) {

          $scope.editProduct = {
            id: $scope.product.id,
            description: $scope.product.description,
            quantity: $scope.product.quantity,
            serialNumber: $scope.product.serialNumber,
            sum: $scope.product.sum,
            item: {
              versionedId: $scope.product.item.versionedId,
              name: $scope.product.item.name,
              cost: $scope.product.item.cost
            }
          };
        }

        $scope.loadProductByCategory = function (categoryId) {
          $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
        };

        $scope.selectProduct = function (product) {
          $scope.editProduct.item = product.staticCopy();
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditProduct = function () {
          $scope.$emit('cancelEditForm');
        };

        $scope.isProductNameCorrect = function(){
          if(!$scope.editProduct.item.name || !$scope.productsByCategory){
            return;
          }

          for(var i = 0; i < $scope.productsByCategory.length; i++){
            if($scope.editProduct.item.name === $scope.productsByCategory[i].name){
              $scope.editProduct.item = $scope.productsByCategory[i].staticCopy();
              return;
            } else {
              if($scope.editProduct.item.versionedId){
                $scope.editProduct.item.versionedId.id = '';
              }
            }
          }
        };

        $scope.saveProduct = function (form) {
          if (form.$valid) {
            $scope.disabledCreateProductButton = true;
            RecurringService.saveRecInvProductExpense($scope.invoice.id, $scope.editProduct, function () {
              $scope.disabledCreateProductButton = true;
              $scope.$emit('cancelEditForm');
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.getValidationMessage = function (form) {
          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editProductName && form.editProductName.$error && form.editProductName.$error.parse) {
            return 'Please select product from dropdown.';
          }

          if (form.editProductDescription && form.editProductDescription.$error && form.editProductDescription.$error.maxlength) {
            return 'Description exceeds maximum length.';
          }

          if (form.amount && form.amount.$error && form.amount.$error.lowprice) {
            return 'Sale price must be higher than total cost price.';
          }

        };

      }]);

}());
