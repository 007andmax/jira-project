'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', 'ProductsService', '$timeout', '$location', '$anchorScroll', 'CompaniesService',
      function ($scope, ProductsService, $timeout, $location, $anchorScroll, CompaniesService) {

        $scope.editCategory = function () {
          $scope.showEditCategoryName = true;
          $scope.editCategoryName = $scope.category.staticCopy();
        };

        $scope.saveEditCategoryName = function () {
          $scope.showEditCategoryNamebutton = true;
          ProductsService.saveCategory($scope.editCategoryName, function () {
            $scope.showEditCategoryNameButton = false;
            $scope.showEditCategoryName = false;
          });
        };

        $scope.cancelEditCategoryName = function () {
          $scope.showEditCategoryName = false;
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

        $scope.validateProductName = function (ngModelCtrl) {
          var validationResult = ProductsService.isProductNameUnique(ngModelCtrl.$viewValue, '', CompaniesService.getCurrentCompany().id, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

      }]);

}());
