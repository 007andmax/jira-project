'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.productsCtrl',
    ['$scope', '$rootScope', 'ProductsService',
      function ($scope, $rootScope, ProductsService) {

        $scope.searchProducts = ProductsService.search;

        $scope.showProduct = function (product) {
          $rootScope.$broadcast(product.category.id + '-showProduct', product.versionedId.id)
        }

      }]);

}());
