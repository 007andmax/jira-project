'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.editProductCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        //$scope.cancelEditProduct = function () {
        //  $scope.$emit('cancelEvent');
        //};
        //
        //$scope.saveChangeProduct = function (form) {
        //  $scope.editProduct.category = {
        //    id: $scope.category.id
        //  };
        //  if (form.$valid) {
        //    $scope.disabledSaveChangeButton = true;
        //    ProductsService.saveProduct($scope.editProduct, function () {
        //      $scope.showEditProduct = false;
        //      $scope.disabledSaveChangeButton = false;
        //    })
        //  } else {
        //    $scope.triedToSaveProduct = true;
        //  }
        //};
        //
        //$scope.deleteProduct = function () {
        //  ProductsService.deleteProduct($scope.product.versionedId.id)
        //};
        //
        //$scope.addProduct = function (categoryId) {
        //  $scope.showCreateProduct = true;
        //  $scope.createProduct = {};
        //  $scope.createProduct.category = {id: categoryId};
        //  //$location.hash('createNewProduct');
        //  //$anchorScroll();
        //};
        //
        //$scope.cancelCreateProduct = function () {
        //  $scope.showCreateProduct = false;
        //};
        //
        //$scope.createNewProduct = function (form) {
        //  if (form.$valid) {
        //    $scope.disabledCreateProductButton = true;
        //    delete $scope.createProduct.vendor.name;
        //    ProductsService.saveProduct($scope.createProduct, function () {
        //      $scope.showCreateProduct = false;
        //      $scope.disabledCreateProductButton = false;
        //    });
        //  } else {
        //    $scope.triedToSaveProduct = true;
        //  }
        //};

        //console.log($scope.product);

        //if ()

      }]);

}());
