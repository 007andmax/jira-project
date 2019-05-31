'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateProductCtrl',
      ['$scope', 'TicketsService', 'ProductsService', 'quicktech.common.services.UserNotificationService',
        function ($scope, TicketsService, ProductsService, UserNotificationService) {

          $scope.editProduct = $scope.product.staticCopy();

          $scope.discountAmountMsxLength;
          $scope.changeDiscountMaxLength = function(){
            if($scope.product.discountType === "FIXED") {
              $scope.discountAmountMsxLength = $scope.editProduct.item.sale * $scope.editProduct.quantity;
            }
          };


          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            $scope.editProduct.item = product;
          };

          $scope.saveUpdateProduct = function (form) {
            if (form.$valid) {

              var editVersionedId = $scope.editProduct.item.versionedId;
              var isProductItemChange = $scope.product.item.versionedId.id != editVersionedId.id;
              var isQuantityChange = $scope.product.quantity != $scope.editProduct.quantity;
              var isSerialNumberQuantity = $scope.product.serialNumber != $scope.editProduct.serialNumber;
              var isPriceChange = $scope.product.item.sale != $scope.editProduct.item.sale;
              var isDiscountAmountChange = $scope.product.discountAmount != $scope.editProduct.discountAmount;
              var isDiscounttypeChange = $scope.product.discountType != $scope.editProduct.discountType;
              var isCostChange = $scope.product.item.cost != $scope.editProduct.item.cost;

              if (!(isProductItemChange || isQuantityChange || isSerialNumberQuantity || isPriceChange || isDiscountAmountChange || isDiscounttypeChange || isCostChange)) {
                $scope.setEditExpenseId();
                return;
              }

              $scope.disabledSave = true;

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                productExpense: {

                  id: $scope.editProduct.id,
                  item: {
                    sale: $scope.editProduct.item.sale,
                    versionedId: { id: editVersionedId.id, version: editVersionedId.version },
                    cost: $scope.editProduct.item.cost
                  },
                  serialNumber: $scope.editProduct.serialNumber,
                  quantity: $scope.editProduct.quantity,
                  date: $scope.editProduct.date,
                  discountAmount: $scope.editProduct.discountAmount,
                  discountType: 'PERCENT'
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
            if (!form) return;
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
              } else if (errorKey === 'maxLengthWord') {
                return 'Words in description should not be more than 100 characters';
              }
            }
          };

          $scope.isDiscountIconGreen = function(editProduct) {
            if(editProduct.discountAmount === null || editProduct.discountAmount === undefined || editProduct.discountAmount === "") {
              return false
            } else {
              return true
            }
          };

          $scope.isBarcodeIconGreen = function(editProduct) {
            if(editProduct.serialNumber === null || editProduct.serialNumber === undefined || editProduct.serialNumber === "") {
              return false
            } else {
              return true
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
