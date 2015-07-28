'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', 'ProductsService', 'CompaniesService',
      function ($scope, ProductsService) {

        $scope.openEditProduct = function () {
          $scope.showEditProduct = true;
        };

        $scope.$on('cancelEditProduct', function () {
          $scope.showEditProduct = false;
        });

        $scope.deleteProduct = function () {
          ProductsService.deleteProduct($scope.product.versionedId.id)
        };

      }]);

}());
