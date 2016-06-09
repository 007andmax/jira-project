'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductCtrl',
      ['$scope', 'ProductsService',
        function ($scope, ProductsService) {
          $scope.quantityPattern = /^\d{0,4}$/;
          $scope.pricePattern = /^\d{0,6}(\.\d{0,2})?$/;

          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            $scope.productExpense.item = angular.copy(product);
          };

          $scope.removeProduct = function () {
            $scope.ticketUpdate.products.splice($scope.$index, 1);
          };

          $scope.controlProductQty = function (form) {
            form.productQty.$setValidity('zero', +$scope.productExpense.quantity !== 0);
          };

        }]);
  }()
);
