'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', 'ProductsService', '$timeout', '$location', '$anchorScroll',
      function ($scope, ProductsService, $timeout, $location, $anchorScroll) {

        $scope.products = ProductsService.getAllByCategory($scope, $scope.category.id, function () {
        }, true);

        $scope.editCategory = function () {
          $scope.showEditCategoryName = true;
          $scope.editCategoryName = $scope.category.staticCopy();
          //$scope.editCategoryName = {
          //  name: $scope.category.name,
          //  id: $scope.category.id
          //};
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
          //ProductsService.deleteCategory($scope.category.id)
        };

        $scope.addProduct = function () {
          $scope.showCreateProduct = true;
          $scope.createProduct = {};
          $location.hash('createNewProduct');
          $anchorScroll();
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

        $scope.toggleProducts = function () {

          if ($scope.showProducts) {
            $scope.$broadcast('toggleProducts');

            $timeout(function () {
              $scope.showProducts = false;
            }, 0);
          } else {
            $scope.showProducts = true;
          }
        };

        $scope.validateProductName = function (ngModelCtrl) {
          //var validationResult = ProductsService.isProductNameUnique(ngModelCtrl.$viewValue, '', '', function () {
          //  ngModelCtrl.$setValidity('unique', validationResult.value);
          //});
        };

        $scope.isUniqueEditCategoryName = function (form) {
          var uniqueNameCount = 0;
          for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.editCategoryName.name === $scope.categories[i].name) {
              uniqueNameCount++
            }
          }

          if (uniqueNameCount >= 1) {
            form.editCategoryName.$setValidity('unique', false);
          } else {
            form.editCategoryName.$setValidity('unique', true);
          }
        };

      }]);

}());
