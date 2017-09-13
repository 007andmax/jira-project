'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryCtrl',
    ['$scope', '$rootScope', 'ProductsService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, $rootScope, ProductsService, $timeout, UserConfirmationsService) {

        $scope.deleteCategory = function () {
          var confirmMesage = 'Do you want to delete ' + $scope.category.name + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            ProductsService.deleteCategory($scope.category.id)
          });
        };

        $scope.$on($scope.category.id + '-showProduct', function (event, productId) {
          if ($scope.category.id !== $scope.expandedCategoryId) {
            $scope.setExpandedCategoryId($scope.category.id);
          }

          $scope.setHighlightProductId(productId);
        });

      }]);

}());
