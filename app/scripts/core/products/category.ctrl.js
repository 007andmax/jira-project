'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', 'ProductsService', '$timeout', '$location', '$anchorScroll', 'CompaniesService',
      function ($scope, ProductsService, $timeout, $location, $anchorScroll, CompaniesService) {

        $scope.openEditCategory = function () {
          $scope.isEditCategory = true;
          $scope.editCategory = $scope.category.staticCopy();
        };

        $scope.saveEditCategory = function () {
          $scope.disabledCreateButton = true;
          ProductsService.saveCategory($scope.editCategory, function () {
            $scope.disabledCreateButton = false;
            $scope.isEditCategory = false;
          });
        };

        $scope.cancelEditCategory = function () {
          $scope.isEditCategory = false;
        };

        $scope.deleteCategory = function () {
          ProductsService.deleteCategory($scope.category.id)
        };

        $scope.toggleProducts = function () {

          if ($scope.showProducts) {
            $scope.$broadcast('toggleProducts');

            $timeout(function () {
              $scope.showProducts = false;
            }, 200);
          } else {
            $scope.showProducts = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.addProduct = function (categoryId) {
          $scope.showCreateProduct = true;
          $scope.createProduct = {};
          $scope.createProduct.category = {id: categoryId};
          //$location.hash('createNewProduct');
          //$anchorScroll();
        };

        $scope.cancelCreateProduct = function () {
          $scope.showCreateProduct = false;
        };

        $scope.createNewProduct = function (form) {
          if (form.$valid) {
            $scope.disabledCreateProductButton = true;
            delete $scope.createProduct.vendor.name;
            ProductsService.saveProduct($scope.createProduct, function () {
              $scope.showCreateProduct = false;
              $scope.disabledCreateProductButton = false;
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.isUniqueCategoryName = function (ngModelCtrl) {
          var uniqueNameCount = 0;
          for (var i = 0; i < $scope.categories.length; i++) {
            if (ngModelCtrl.$viewValue === $scope.categories[i].name) {
              if ($scope.category.id !== $scope.categories[i].id) {
                uniqueNameCount++;
              }
            }
          }
          ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
        };

      }]);

}());
