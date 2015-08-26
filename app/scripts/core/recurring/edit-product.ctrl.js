'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editProductCtrl',
    ['$scope', 'RecurringService', 'ProductsService',
      function ($scope, RecurringService, ProductsService) {

        $scope.editProduct = {};

        $scope.searchProducts = ProductsService.search;

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

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditProduct = function () {
          $scope.$emit('cancelEditForm');
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
        }

      }]);

}());
