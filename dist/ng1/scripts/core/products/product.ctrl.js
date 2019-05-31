'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', 'ProductsService', '$rootScope', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.UserConfirmationsService',
      function ($scope, ProductsService, $rootScope, UserNotificationService, UserConfirmationsService) {

        if ($scope.product.category){
          $scope.$on($scope.product.category.id + '-showProduct', function (event, productId) {
            $scope.setHighlightProductId(productId);
          });
        }

        $scope.deleteProduct = function () {
          var confirmMesage = 'Do you want to delete product?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            ProductsService.deleteProduct($scope.product.versionedId.id, function () {
              $rootScope.$broadcast('productDeleted', $scope.product.versionedId.id);
            });

            if ($scope.expandedCategoryId && findCategoryById($scope.expandedCategoryId).productsList.length < 2) {
              $scope.setExpandedCategoryId();
            }
          });
        };

        $scope.moveToCategory = function (category) {
          UserNotificationService.show('Moving ' + $scope.product.description + ' to ' + category.name);
          ProductsService.moveProducts(category.id, $scope.product.versionedId.id, function () {
            UserNotificationService.show($scope.product.description + ' has been moved to ' + category.name, true);
          });
        };

        function findCategoryById(id) {
          for (var i = 0, len = $scope.productsData.categories.length; i < len; i++) {
            var category = $scope.productsData.categories[i];

            if (category.id == id) {
              return category;
            }
          }

          return [];
        }

      }]);

}());
