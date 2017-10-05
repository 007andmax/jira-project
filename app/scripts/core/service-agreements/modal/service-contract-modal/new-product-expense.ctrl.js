'use strict';

(function () {

    angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.newProductExpenseCtrl',
      ['$scope', 'ProductsService', 'quicktech.common.services.PermissionsService',
        function ($scope, ProductsService, PermissionsService) {

          $scope.selectProduct = function(product) {
            $scope.newProductExpense.name = product;
          };

          $scope.addProductExpense = function (form, productExpense) {

            if (form.$valid && productExpense.name) {

              var newProductExpense = {
                name: productExpense.name,
                quantity: productExpense.quantity,
                salePrice: productExpense.salePrice
              };
              $scope.serviceContract.productExpenses.push(newProductExpense);

              for (var i = 0; i < $scope.defaultProducts.length; i++) {
                if ($scope.defaultProducts[i] == productExpense.name) {
                  $scope.defaultProducts[i].picked = true;
                }
              }

              $scope.newProductExpense = {
                name: null,
                quantity: null,
                salePrice: null
              };
              $scope.calculateTotalAmount();
            }
          };


        }]);
  }()
);
