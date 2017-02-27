'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createDiscountCtrl', ['$scope', 'DiscountsService',
    function ($scope, DiscountsService) {

      var savedState = $scope.getLastSavedState('discount');

      var origin = savedState.item;
      if (savedState.type === 'discount' && origin) {
        $scope.editDiscount = angular.copy(origin);
      } else {
        $scope.editDiscount = {
          discountType: 'FIXED'
        };
      }

      $scope.isShowingErrors = function (form, fieldName) {
        return form[fieldName] && ($scope.triedToSave || form[fieldName].$dirty) && form[fieldName].$invalid;
      };

      $scope.getValidationMessage = function (form) {

        if (form.$error.required) {
          for (var i = 0; i < form.$error.required.length; i++) {
            if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
              return 'Please fill the required field(s).';
            }
          }
        }

        if (form.editDiscountName && form.editDiscountName.$error && form.editDiscountName.$dirty) {

          if (form.editDiscountName.$error.maxlength) {
            return 'Discount name exceeds maximum length.';
          }

          if (form.editDiscountName.$error.minlength) {
            return 'Discount name is too short.';
          }
        }
      };

      $scope.save = function (form) {
        if (form.$valid) {
          $scope.triedToSave = false;
          $scope.saveInProgress = true;

          var discountToSave = angular.copy($scope.editDiscount);
          DiscountsService.save(discountToSave, function () {
            $scope.closeWindow();
            $scope.saveInProgress = false;
          });
        } else {
          $scope.triedToSave = true;
        }
      };

      $scope.$on('createNewWindowClosing', createNewWindowClosing);

      function createNewWindowClosing() {
        var discount = $scope.editDiscount;
        var isDiscountChanged;

        if (origin) {
          isDiscountChanged = discount.name !== origin.name
            || discount.amount !== origin.amount
            || discount.discountType !== origin.discountType;
        } else {
          isDiscountChanged = discount.name || discount.amount;
        }

        if (isDiscountChanged) {
          $scope.savedState.types.unshift('discount');
          $scope.savedState.items.unshift(discount);
        }
      }

    }]);

}());
