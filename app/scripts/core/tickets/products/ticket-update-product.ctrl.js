'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateProductCtrl',
      ['$scope', 'TicketsService', 'ProductsService', 'UsersService',
        function ($scope, TicketsService, ProductsService, UsersService) {

          $scope.editProduct = $scope.product.staticCopy();

          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            $scope.editProduct.item = product.staticCopy();
          };

          $scope.showEditProduct = function () {
            $scope.isShowEditProduct = true;
          };

          $scope.cancelEditProduct = function () {
            $scope.isShowEditProduct = false;
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
                $scope.isShowEditProduct = false;
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
