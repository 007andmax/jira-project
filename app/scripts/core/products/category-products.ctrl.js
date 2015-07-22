'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryProductsCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        $scope.products = ProductsService.getAllByCategory($scope, $scope.category.id, function () {
          $scope.$emit('toggleProducts');
        }, true);

        $scope.createNewProduct = function (form) {
          $scope.createProduct.category = {id: $scope.category.id};
          if (form.$valid) {
            $scope.disabledCreateProductButton = true;
            //ProductsService.saveProduct($scope.createProduct, function(){
            //  $scope.showCreateProduct = false;
            //  $scope.disabledCreateProductButton = false;
            //});
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.cancelCreateProduct = function () {
          $scope.showCreateProduct = false;
        };

      }]);

}());
