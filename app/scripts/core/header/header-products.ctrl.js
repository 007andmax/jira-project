'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.productsCtrl',
    ['$scope', '$rootScope', 'ProductsService', 'quicktech.common.services.SharedStateService', '$timeout',
      function ($scope, $rootScope, ProductsService, SharedStateService, $timeout) {
        var globalSearch = SharedStateService.getSharedState('globalSearch'),
          globalFilter = globalSearch.productFilter;

        $scope.searchValue = '';
        $scope.choosedCategory = false;
        $scope.shownCategories = ProductsService.getFullListForAutocomplete($scope);

        if (globalFilter) {
          $scope.searchValue = globalFilter.name;
          $scope.choosedCategory = true;
          $timeout(function () {
            $rootScope.$broadcast(globalFilter.category + '-showProduct', globalFilter.id);
          });
          globalSearch.productFilter = undefined;
        }

        $scope.clearInput = function () {
          $scope.searchValue = '';
          $scope.choosedCategory = false;
          $rootScope.$broadcast('showAllCategories');
        };

        $scope.onSelect = function (val) {
          if (!val || typeof val === 'string') {
            return;
          }

          $scope.choosedCategory = true;
          if (val.versionedId) {
            $rootScope.$broadcast(val.categoryId + '-showProduct', val.versionedId.id);
          } else {
            $rootScope.$broadcast('showCategory', val.id);
          }
        };

        $scope.$on('productDeleted', function (event, id) {
          $scope.clearInput();
          $scope.shownCategories = $scope.shownCategories.filter(function (item) {
            if (item.id !== id) {
              return item;
            }
          })
        });

        $scope.$on('productsTabChanged', $scope.clearInput);

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
                id: product.versionedId.id,
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

      }]);
}());
