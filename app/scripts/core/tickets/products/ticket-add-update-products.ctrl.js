'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductsCtrl',
      ['$scope', 'ProductsService', 'quicktech.common.services.PermissionsService',
        function ($scope, ProductsService, PermissionsService) {

          $scope.discountAmountMsxLength;
          $scope.isValidNewExpenseOrNote = false;

          $scope.PermissionsService = PermissionsService;

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              products: [{item:{}}]
            });

            $scope.setTriedToSaveUpdate(false);
          }

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.getTriedToSaveUpdate());
          };

          $scope.addProduct = function () {
            $scope.ticketUpdate.products.push({ item: {} });

          };

          $scope.$watch('ticketUpdate', function () {

            $scope.productTotalAmount = 0;

            for (var i = 0; i < $scope.ticketUpdate.products.length; i++) {
              if($scope.ticketUpdate.products[i].item){
                $scope.productTotalAmount += ($scope.ticketUpdate.products[i].item.sale * $scope.ticketUpdate.products[i].quantity) || 0;
              }
            }

          }, true);

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);
