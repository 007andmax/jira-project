'use strict';

(function () {

    angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.newProductExpenseCtrl',
      ['$scope', 'ProductsService', 'quicktech.common.services.PermissionsService', '$timeout',
        function ($scope, ProductsService, PermissionsService, $timeout) {

          $scope.showRequiredFieldErrorproductExpense = false;
          $scope.reInitNewProductExpenseForm = true;

          $scope.selectProduct = function(product) {
            $scope.newProductExpense.name = product;
          };

          $scope.addProductExpense = function (form, productExpense) {
            $scope.showRequiredFieldErrorproductExpense = false;

            if (form.$valid && productExpense.name) {

              var newProductExpense = {
                name: productExpense.name,
                quantity: productExpense.quantity,
                salePrice: productExpense.name.sale
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
              reInitNewProductExpenseForm();
              $scope.calculateTotalAmount();
            } else {
              $scope.showRequiredFieldErrorproductExpense = true;
            }
          };

          $scope.$watch(function(){
            return $scope.newProductExpense;
          }, function(npx){
            $scope.refreshNewProductExpense(npx);
          });

          $scope.isShowingErrorsNewProductExpenseeField = function (form, fieldName) {
            return form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldErrorproductExpense) && !form[fieldName].$valid;
          };


          function reInitNewProductExpenseForm() {
            $scope.reInitNewProductExpenseForm = false;
            $timeout(function () {
              $scope.reInitNewProductExpenseForm = true;
            }, 0);
          }


        }]);
  }()
);
