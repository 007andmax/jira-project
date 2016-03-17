'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryProductsCtrl',
    ['$scope', 'ProductsService', '$timeout',
      function ($scope, ProductsService, $timeout) {

        $scope.orderProducts = {
          field: 'ilc',
          reverse: false
        };

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

        $scope.setOrderForProducts = function (option) {
          if (option === $scope.orderProducts.field) {
            $scope.orderProducts.reverse = !$scope.orderProducts.reverse;
          } else {
            $scope.orderProducts.field = option;
            $scope.orderProducts.reverse = false;
          }
        };

        $scope.orderByForProducts = function (item) {
          if ($scope.orderProducts.field === 'ilc') {
            return item.ilc;
          } else if ($scope.orderProducts.field === 'manufacture') {
            return item.manufacture;
          } else if ($scope.orderProducts.field === 'description') {
            return item.description;
          } else if ($scope.orderProducts.field === 'vendor') {
            return item.vendor.name;
          } else if ($scope.orderProducts.field === 'cost') {
            return item.cost;
          } else if ($scope.orderProducts.field === 'sale') {
            return item.sale;
          }

        };

      }]);

}());
