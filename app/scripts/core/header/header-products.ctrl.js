'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.productsCtrl',
    [
      '$scope', '$rootScope', 'ProductsService',
      function ($scope, $rootScope, ProductsService) {

        $scope.searchValue = '';
        $scope.chooseProduct = false;
        $scope.shownCategories = ProductsService.getFullListForAutocomplete();

        $scope.onSelect = function (val) {
          if (!val || typeof val === 'string') {
            return;
          }

          if (val.versionedId) {
            $rootScope.$broadcast(val.categoryId + '-showProduct', val.versionedId.id);
          } else {
            $rootScope.$broadcast('showCategory', val.id);
          }
        };

        $scope.$watch('searchValue', function (searchValue) {
          if (!searchValue || typeof searchValue === 'string') {
            $rootScope.$broadcast('showCategory');
          }
        });

        $scope.$watch('shownCategories.length', parseProductCategories);

        function parseProductCategories() {
          if (!$scope.shownCategories || !$scope.shownCategories.length || $scope.parsed) {
            return;
          }

          $scope.parsed = true;

          var result = [];

          for (var index in $scope.shownCategories) {
            var category = $scope.shownCategories[index];
            for (var index in category.products) {
              var product = category.products[index];
              result.push({
                categoryId: category.id,
                name: product.description,
                versionedId: product.versionedId,
                order: '1'
              });
            }
            result.push({
              id: category.id,
              name: category.name,
              order: '0'
            });
          }

          $scope.shownCategories = result;
        }

      }
    ]);

}());
