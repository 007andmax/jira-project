'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', '$rootScope', 'ProductsService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, $rootScope, ProductsService, $timeout, UserConfirmationsService) {
        var offset = 120;

        $scope.getOffset = function () {
          return offset;
        };

        $scope.setOffset = function (value) {
          offset = value;
        };

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
          var confirmMesage = 'Do you want to delete ' + $scope.category.name + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            ProductsService.deleteCategory($scope.category.id)
          });
        };

        $scope.addProduct = function (id) {
          $rootScope.$broadcast('cancelEditForm', id);
          $scope.showCreateProduct = true;
          offset = 300;
        };

        $scope.addProductAndOpenCategory = function (id) {
          $scope.addProduct(id);
          if (id !== $scope.expandedCategoryId) {
            $scope.setExpandedCategoryId(id);
          }
        };

        $scope.$watch('category.productsList.length', function (productsAmount) {
          if (productsAmount === 0 && !$scope.showCreateProduct) {
            $scope.setExpandedCategoryId($scope.category.id);
          }
        });

        $scope.$on('cancelEditForm', function (event, data) {
          $scope.cancelEditCategory();
          $scope.showCreateProduct = false;
          offset = 120;

          if (data && data != 'isProductCreation'
            && $scope.category.productsList.length === 0
            && data !== $scope.expandedCategoryId) {

            $scope.setExpandedCategoryId($scope.category.id);
          }
        });

        $scope.$on($scope.category.id + '-showProduct', function (event, productId) {
          if ($scope.category.id !== $scope.expandedCategoryId) {
            $scope.setExpandedCategoryId($scope.category.id);
          }

          $scope.setHighlightProductId(productId);
        });

        $scope.$on($scope.category.id + '-showCategory', function (event, categoryId) {
          $scope.setShowingCategory(categoryId);
          if (categoryId !== $scope.expandedCategoryId) {
            $scope.setExpandedCategoryId(categoryId);
          }
        });

      }]);

}());
