'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductsCtrl',
      ['$scope', 'ProductsService',
        function ($scope, ProductsService) {

          $scope.isValidNewExpenseOrNote = false;

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              products: [{item:{}}]
            });

          }

          $scope.addProduct = function (form) {

            if (form.$valid) {

              $scope.ticketUpdate.products.push({item:{}});
              $scope.triedToAddProduct = false;

            } else {
              $scope.triedToAddProduct = true;
            }
          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.triedToAddProduct);
          };

          $scope.$watch('ticketUpdate', function () {

            $scope.productTotalAmount = 0;

            for (var i = 0; i < $scope.ticketUpdate.products.length; i++) {
              if($scope.ticketUpdate.products[i].item){
                $scope.productTotalAmount += ($scope.ticketUpdate.products[i].item.sale * $scope.ticketUpdate.products[i].quantity);
              }
            }

          }, true);

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);
