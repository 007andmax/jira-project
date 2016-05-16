'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', '$rootScope', 'ProductsService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, $rootScope, ProductsService, $timeout, UserConfirmationsService) {

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
        };

        $scope.addProductAndOpenCategory = function (id) {
          $scope.addProduct(id);
          if (id !== $scope.expandedCategoryId) {
            $scope.setExpandedCategoryId(id);
          }
        };

        $scope.$on('cancelEditForm', function (event, data) {
          $scope.showCreateProduct = false;
        });

        $scope.$on($scope.category.id + '-showProduct', function (event, productId) {
          if ($scope.category.id !== $scope.expandedCategoryId) {
            $scope.setExpandedCategoryId($scope.category.id);
          }

          $scope.setHighlightProductId(productId);
        });

        $scope.$on('showCategory', function (categoryId) {
          $scope.setShowingCategory(categoryId);
          if (categoryId !== $scope.expandedCategoryId && $scope.category.productsList.length > 0) {
            $scope.setExpandedCategoryId(categoryId);
          }
        });

      }]);

}());
