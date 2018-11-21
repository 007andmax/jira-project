'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateProductCtrl',
      ['$scope', 'ProductsService', 'quicktech.common.services.PermissionsService', '$rootScope',
        function ($scope, ProductsService, PermissionsService, $rootScope) {
          $scope.quantityPattern = /^\d{0,4}$/;
          $scope.pricePattern = /^\d{0,6}(\.\d{0,2})?$/;



          setTimeout(function() {

            console.log($scope.ticketUpdate.products[0], 'ticket')
            if (!$scope.productExpense) {
              $scope.productExpense = $scope.ticketUpdate.products[0];
            }
          }, 100);


          if (window.innerWidth <= 414) {
            $scope.$watch('productExpense', function(val) {
              if (val && !$scope.productToEdit) {
                $scope.ticketUpdate.products[0] = val

              }
            }, true);
          }


          $scope.$watch('productToEdit', function(val) {
            if (val) {
              $scope.productExpense = val;

              console.log('val before', val)
              $rootScope.selectedMobileProduct = val;

              console.log($scope.productExpense.item.description, "VALLLL")
              // $scope.$apply()
            } else {
              $scope.productExpense = $scope.ticketUpdate.products[0];
              $rootScope.selectedMobileProduct = null;
            }
          })





          function getParentWithProp(element, prop) {
            if (element[prop]) {
              return element[prop];
            } else {
              return getParentWithProp(element.$parent, prop);
            }
          }

          $scope.PermissionsService = PermissionsService;

          $scope.loadProductByCategory = function (categoryId) {
            $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
          };

          $scope.selectProduct = function (product) {
            if(product.discountAmount && product.discountType) {
              $scope.productExpense.discountAmount = product.discountAmount;
              $scope.productExpense.discountType = "PERCENT";
            }

            $scope.productExpense.item = angular.copy(product);
            $scope.productExpense.item.quantity = 1;
            $scope.productExpense.quantity = 1;
          };

          $scope.removeProduct = function () {
            $scope.ticketUpdate.products.splice($scope.$index, 1);
            if($scope.ticketUpdate.products.length === 0) {
              $scope.addProduct();
            }
          };

          $scope.controlProductQty = function (form) {
            form.productQty.$setValidity('zero', +$scope.productExpense.quantity !== 0);
          };

          $scope.isBarcodeIconGreen = function(productExpense) {
            if(productExpense.serialNumber === null || productExpense.serialNumber === undefined || productExpense.serialNumber === "") {
              return false
            } else {
              return true
            }
          };

          $scope.isDiscountIconGreen = function(productExpense) {
            if(productExpense.discountAmount === null || productExpense.discountAmount === undefined || productExpense.discountAmount === "") {
              return false
            } else {
              return true
            }
          };

        }]);
  }()
);
