'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("ticketAddProduct",
    ['ProductsService',
      function (ProductsService) {
        return {
          restrict: 'A',
          require: 'ngModel',
          templateUrl: '/html/scripts/core/tickets/products/ticket-add-update-product.tpl.html',
          scope: {
            productExpense: '=ngModel',
            productCategories: '=',
            addProductFunc: '=addProductFunc',
            removeProduct: '=removeProductFunc',
            numberPattern: '=numberPattern',
            index: '=index',
            showErrors: '='
          },
          link: function ($scope, element, attrs, ctrl) {

            if (attrs.enableAddMode) {

              $scope.isAddMode = true;

              $scope.isShowingErrors = function (form, fieldName) {
                return form[fieldName] && !!$scope.showErrors && !form[fieldName].$valid;
              };

            } else {
              $scope.isShowingErrors = function (form, fieldName) {
                return form[fieldName] && !form[fieldName].$valid;
              };

              $scope.productNameFilter = $scope.productExpense.item.name;
            }

            $scope.loadProductByCategory = function (categoryId) {
              $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
            };

            $scope.selectProduct = function (product) {
              $scope.productNameFilter = product.name;
              $scope.productExpense.item = product.staticCopy();
            };

            $scope.addProduct = function (form) {

              $scope.addProductFunc(form);

              if (form.$valid) {
                $scope.productNameFilter = '';
              }
            };

            $scope.$watch('productNameFilter', function (value) {
              if ($scope.productExpense.item && value !== $scope.productExpense.item.name) {
                $scope.productExpense.item = undefined;
              }
            })
          }
        }
      }]);
})();
