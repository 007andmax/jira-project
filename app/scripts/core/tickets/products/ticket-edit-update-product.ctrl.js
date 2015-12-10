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

              var isProductItemChange = $scope.product.item.versionedId.id != $scope.editProduct.item.versionedId.id;
              var isDescriptionChange = $scope.product.description != $scope.editProduct.description;
              var isDescriptionQuantity = $scope.product.quantity != $scope.editProduct.quantity;

              if (!(isProductItemChange || isDescriptionChange || isDescriptionQuantity)) {
                $scope.setEditExpenseId();
                return;
              }

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

          $scope.controlProductQty = function (form) {
            form.productQty.$setValidity('zero', +$scope.editProduct.quantity !== 0);
          };

          $scope.validationMessage = function () {
            if ($scope.updateTicketProduct.$valid) {
              return;
            }

            for (var errorKey in $scope.updateTicketProduct.$error) {
              if (errorKey === 'required') {
                return requiredMessage($scope.updateTicketProduct.$error[errorKey][0].$name);
              } else if (errorKey === 'minlength') {
                return minlengthMessage($scope.updateTicketProduct.$error[errorKey][0].$name);
              } else if (errorKey === 'maxlength') {
                return maxlengthMessage($scope.updateTicketProduct.$error[errorKey][0].$name);
              } else if (errorKey === 'zero') {
                return 'Product Quantity can not be 0';
              }
            }
          };

          function requiredMessage(fildName) {
            if (fildName === 'productName') {
              return 'Product Name is required.'
            } else if (fildName === 'productDescription') {
              return 'Product Description is required.'
            } else if (fildName === 'productQty') {
              return 'Product Qty is required.'
            }
          }

          function maxlengthMessage(fildName) {
            if (fildName === 'productDescription') {
              return 'Product Description is too large.'
            } else if (fildName === 'productQty') {
              return 'Product Qty is too large.'
            }
          }

          function minlengthMessage(fildName) {
            if (fildName === 'productDescription') {
              return 'Product Description is too short.'
            }
          }

        }]);
  }()
);
