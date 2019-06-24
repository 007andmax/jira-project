'use strict';

(function () {

    angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.productExpenseListCtrl',
      ['$scope', 'ProductsService', 'quicktech.common.services.PermissionsService',
        function ($scope, ProductsService, PermissionsService) {



          $scope.selectProduct = function(product) {
            $scope.productExpense.name = product;
          };

          $scope.deleteProductExpense = function (product) {
            for (var i = 0; i < $scope.serviceContract.productExpenses.length; i++) {
              if ($scope.serviceContract.productExpenses[i] == product) {
                $scope.serviceContract.productExpenses.splice(i, 1);

                for (var j = 0; j < $scope.defaultProducts.length; j++) {
                  if ($scope.defaultProducts[j] == product.name) {
                    $scope.defaultProducts[j].picked = false;
                  }
                }

                break;
              }
            }
            $scope.calculateTotalAmount();
          };


        }]);
  }()
);
