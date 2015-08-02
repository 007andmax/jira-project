'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', '$rootScope', 'ProductsService', 'CompaniesService',
      function ($scope, $rootScope, ProductsService) {

        $scope.openEditProduct = function () {
          $scope.showEditProduct = true;
        };

        $rootScope.$on('cancelEditForm', function () {
          $scope.showEditProduct = false;
        });

        $scope.deleteProduct = function () {
          ProductsService.deleteProduct($scope.product.versionedId.id)
        };

      }]);

}());
