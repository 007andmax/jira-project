'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsListCtrl',
    ['$scope', 'ProductsService', '$timeout', function ($scope, ProductsService, $timeout) {

      $scope.$on('showCategory', function (event, categoryId) {
        $scope.categoryId = categoryId ? categoryId : undefined;
      });

      $scope.filterByCategory = function (product) {
        if ($scope.categoryId) {
          return $scope.categoryId === product.category.id;
        } else {
          return true;
        }
      };

      $scope.$watch('highlightProductId', function (productId) {
        if (productId) {

          $scope.$broadcast('show-' + productId);

          $timeout(function () {
            $scope.setHighlightProductId();
          }, 3000)
        }
      })

    }]);

}());
