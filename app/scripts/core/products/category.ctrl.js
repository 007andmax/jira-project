'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', 'ProductsService', '$timeout',
      function ($scope, ProductsService, $timeout) {

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

        $scope.toggleProducts = function () {

          if ($scope.showProducts) {
            $scope.$broadcast('toggleProducts');

            $timeout(function () {
              $scope.showProducts = false;
            }, 0);
          }else {
            $scope.showProducts = true;
          }
        }

      }]);

}());
