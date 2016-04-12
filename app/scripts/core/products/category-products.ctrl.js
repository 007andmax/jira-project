'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryProductsCtrl',
    ['$scope', 'ProductsService', '$timeout',
      function ($scope, ProductsService, $timeout) {

        $scope.products = ProductsService.getAllByCategory($scope, $scope.category.id, function () {
          $scope.$emit('toggleProducts');

          $scope.$watch('highlightProductId', function (productId) {
            if (productId) {

              $scope.$broadcast('show-' + productId);

              $timeout(function () {
                $scope.setHighlightProductId();
              }, 3000)
            }
          })

        }, true);

      }]);

}());
