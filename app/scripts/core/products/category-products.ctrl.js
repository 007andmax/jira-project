'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryProductsCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        $scope.products = ProductsService.getAllByCategory($scope, $scope.category.id, function () {
        }, true);

        $scope.editCategory = function () {
          $scope.showEditCategoryName = true;
          $scope.editCategoryName = {
            name: $scope.category.name,
            id: $scope.category.id
          };
        };

        $scope.saveEditCategoryName = function () {
          $scope.showEditCategoryNamebutton = true;
          //ProductsService.saveCategory($scope.editCategoryName, function(){
          //  $scope.showEditCategoryNameButton = false;
          //  $scope.showEditCategoryName = false;
          //});
        };

        $scope.cancelEditCategoryName = function () {
          $scope.showEditCategoryName = false;
        };

        $scope.deleteCategory = function () {
          console.log("delete category " + $scope.category.id);
          //ProductsService.deleteCategory($scope.category.id)
        };

        $scope.addProduct = function () {
          console.log("add product");
          $scope.showCreateProduct = true;
          $scope.createProduct = {};
        };

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
