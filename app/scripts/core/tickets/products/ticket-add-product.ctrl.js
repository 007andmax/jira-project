'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductCtrl',
      ['$scope',
        function ($scope) {

          $scope.ticketUpdate = {
            products: []
          };
          $scope.productExpenseToAdd = {};

          $scope.setTicketUpdate($scope.ticketUpdate);

          $scope.isValidTicketUpdate = function () {
            return $scope.ticketUpdate.products.length > 0;
          };

          $scope.addProduct = function (form) {

            if (form.$valid) {

              $scope.ticketUpdate.products.push($scope.productExpenseToAdd);
              $scope.productExpenseToAdd = {};
              form.$setPristine();
              $scope.triedToAddProduct = false;

            } else {
              $scope.triedToAddProduct = true;
            }
          };

          $scope.removeProduct = function (index) {
            $scope.ticketUpdate.products.splice(index, 1);
          };

        }]);
  }()
);
