'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', '$rootScope', 'ProductsService', '$timeout', '$location', '$anchorScroll', 'CompaniesService',
      function ($scope, $rootScope, ProductsService, $timeout) {

        $scope.openEditCategory = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.isEditCategory = true;
          $scope.editCategory = $scope.category.staticCopy();
        };

        $scope.saveEditCategory = function (form) {
          $scope.disabledCreateButton = true;
          ProductsService.saveCategory($scope.editCategory, function () {
            $scope.disabledCreateButton = false;
            $scope.isEditCategory = false;
            form.$setPristine()
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
            $scope.showProducts = false;
          } else if ($scope.category.productsAmount > 0 || $scope.showCreateProduct) {
            $scope.showProducts = true;
          }
        };

        $scope.addProduct = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateProduct = true;
        };

        $scope.setHighlightProductId = function (productId) {
          $scope.highlightProductId = productId;
        };

        $scope.$watch('category.productsAmount', function (productsAmount) {
          if (productsAmount === 0 && $scope.showProducts && !$scope.showCreateProduct) {
            $scope.$broadcast('toggleProducts');
            $scope.showProducts = false;
          }
        });

        $scope.$on('cancelEditForm', function (event, data) {
          $scope.cancelEditCategory();
          $scope.showCreateProduct = false;

          if (data != 'isProductCreation' && $scope.category.productsAmount === 0 && $scope.showProducts) {
            $scope.$broadcast('toggleProducts');
            $scope.showProducts = false;
          }
        });

        $scope.$on($scope.category.id + '-showProduct', function (event, productId) {
          if (!$scope.showProducts) {
            $scope.toggleProducts();
          }

          $scope.setHighlightProductId(productId);
        });

        $scope.$on('showCategory', function (event, categoryId) {
          if (categoryId) {
            $scope.showCategory = categoryId;
            if (!$scope.showProducts) {
              $scope.toggleProducts();
            }
          } else {
            $scope.showCategory = '';
            if ($scope.showProducts) {
              $scope.toggleProducts();
            }
          }
        });

      }]);

}());
