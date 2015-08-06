'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editProductCtrl',
    ['$scope', 'RecurringService', 'ProductsService', '$rootScope',
      function ($scope, RecurringService, ProductsService, $rootScope) {

        $scope.editProduct = {};

        $scope.searchProducts = ProductsService.search;

        if ($scope.product !== undefined) {

          $scope.editProduct.id = $scope.product.id;
          $scope.editProduct.description = $scope.product.description;
          $scope.editProduct.createdAt = $scope.product.createdAt;
          $scope.editProduct.quantity = $scope.product.quantity
          $scope.editProduct.item = {};
          $scope.editProduct.item.versionedId = $scope.product.item.versionedId;
          $scope.editProduct.item.name = $scope.product.item.name;
        }

        $scope.numberPattern = /^\d?[0-9]{0,17}$/;

        $scope.categoryProducts = ProductsService.getCategories($scope);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };


        $scope.deleteProductInvoice = function () {
          console.log('delete product ' + $scope.product.id);
          //RecurringService.deleteProductExpenseFromRecInv(recurringInvoiceId, expenseId, callback)
        };

        $scope.showEditProductForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showEditProduct = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showEditProduct = false;
          $scope.showCreateProduct = false;
        });

        $scope.cancelEditProduct = function () {
          console.log($scope.product === undefined);
          $scope.product === undefined ? $scope.$emit('cancelCreateProductInvoice') : $scope.showEditProduct = false;
        };

        $scope.saveProduct = function (form) {
          if (form.$valid) {
            $scope.disabledCreateProductButton = true;
            console.log($scope.editProduct);
            RecurringService.saveRecInvProductExpense($scope.invoice.id, $scope.editProduct, function () {
              $scope.disabledCreateProductButton = true;
              $scope.product === undefined ? $scope.$emit('cancelCreateProductInvoice') : $scope.showEditProduct = false;
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        }

      }]);

}());
