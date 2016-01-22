'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductCtrl',
      ['$scope', 'ProductsService',
        function ($scope, ProductsService) {

          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            $scope.productExpense.item = product;

            $scope.$apply(function(){
              return $scope.productExpense.description = product.description;
            });

          };

          $scope.removeProduct = function () {
            $scope.ticketUpdate.products.splice($scope.$index, 1);
          };

          $scope.controlProductQty = function (form){
            form.productQty.$setValidity('zero', +$scope.productExpense.quantity !== 0);
          };

        }]);
  }()
);
