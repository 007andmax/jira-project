'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductCtrl',
      ['$scope', 'ProductsService',
        function ($scope, ProductsService) {

          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            $scope.productExpense.item = product.staticCopy();
          };

          $scope.removeProduct = function () {
            $scope.ticketUpdate.products.splice($scope.$index, 1);
          };

          $scope.controlProductQty = function (form){
            form.productQty.$setValidity('zero', +$scope.productExpense.quantity !== 0);
          };

          $scope.isProductNameCorrect = function(){
            if(!$scope.productExpense.item.name){
              return;
            }

            for(var i = 0; i < $scope.productsByCategory.length; i++){
              if($scope.productExpense.item.name === $scope.productsByCategory[i].name){
                $scope.productExpense.item = $scope.productsByCategory[i].staticCopy();
                return;
              } else {
                $scope.productExpense.item.versionedId.id = '';
              }
            }
          }

        }]);
  }()
);
