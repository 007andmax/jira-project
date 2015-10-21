'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductCtrl',
      ['$scope',
        function ($scope) {

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              products: []
            });

            $scope.productExpenseToAdd = {};
          }

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

          $scope.$watch('ticketUpdate', function () {

            $scope.productTotalAmount = 0;

            for (var i = 0; i < $scope.ticketUpdate.products.length; i++) {
              $scope.productTotalAmount += ($scope.ticketUpdate.products[i].item.sale * $scope.ticketUpdate.products[i].quantity);
            }

          }, true);

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);
