'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateProductCtrl',
      ['$scope', 'TicketsService', 'ProductsService', 'quicktech.common.services.UserNotificationService',
        function ($scope, TicketsService, ProductsService, UserNotificationService) {

          $scope.editProduct = $scope.product.staticCopy();

          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            $scope.editProduct.item = product.staticCopy();
          };

          $scope.saveUpdateProduct = function (form) {

            if (form.$valid) {

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                productExpense: {

                  id: $scope.editProduct.id,
                  item: {versionedId: {id: $scope.editProduct.item.versionedId.id}},
                  description: $scope.editProduct.description,
                  quantity: $scope.editProduct.quantity,
                  date: $scope.editProduct.date

                }
              }, function () {
                UserNotificationService.show('The ticket update containing a product has been modified', true);
                $scope.setEditExpenseId();
              })
            } else {
              $scope.triedToSaveProduct = true;
            }

          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
          };

        }]);
  }()
);
