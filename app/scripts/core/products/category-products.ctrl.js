'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryProductsCtrl',
    ['$scope', 'ProductsService', '$timeout',
      function ($scope, ProductsService, $timeout) {

        $scope.$watch('highlightProductId', function (productId) {
          if (productId) {

            $timeout(function () {
              $scope.$broadcast('show-' + productId);
            });


            $timeout(function () {
              $scope.setHighlightProductId();
            }, 3000);
          }
        });

        $scope.$on('showAllCategories', function (event) {
          $scope.setShowingCategory('');
        });

      }]);

}());
