'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', 'ProductsService', '$timeout', '$location', '$anchorScroll', 'CompaniesService',
      function ($scope, ProductsService, $timeout) {

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

        $scope.addProduct = function () {
          $scope.showCreateProduct = true;
        };

        $scope.$on('cancelCreateProduct', function () {
          $scope.showCreateProduct = false;
        });

      }]);

}());
