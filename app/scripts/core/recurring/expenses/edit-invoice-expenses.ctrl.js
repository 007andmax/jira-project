'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpensesCtrl',
    ['$scope', 'TaxRatesService',
      function ($scope, TaxRatesService) {

        var taxRatesCopy;

        $scope.subtotal = 0;
        $scope.total = 0;

        TaxRatesService.getAllByCompany($scope.currentUser.company.id, $scope, function (resp) {
          taxRatesCopy = angular.copy(resp);
        });

        $scope.addProduct = function (form) {
          if (isLastUpdateValid(form)) {
            $scope.editInvoice.expenses.push({type: 'product', itemOrder: $scope.editInvoice.expenses.length});
            $scope.triedToAddUpdate = false;
          } else {
            $scope.triedToAddUpdate = true;
          }
        };

        $scope.addService = function (form) {
          if (isLastUpdateValid(form)) {
            $scope.editInvoice.expenses.push({type: 'service', itemOrder: $scope.editInvoice.expenses.length});
            $scope.triedToAddUpdate = false;
          } else {
            $scope.triedToAddUpdate = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToAddUpdate || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.$watch('editInvoice.expenses', function () {
          var subtotal = 0;
          var total = 0;
          var taxRate = 0;

          for (var i = 0, len = $scope.editInvoice.expenses.length; i < len; i++) {
            var expense = $scope.editInvoice.expenses[i];

            if (expense.type === "product" && expense.item && expense.quantity) {
              subtotal += +expense.quantity * +expense.item.sale;
            } else if (expense.quantity && expense.item) {
              subtotal += expense.item.rate * (expense.quantity / 60);
            }
          }

          $scope.subtotal = subtotal;

          if (taxRatesCopy && taxRatesCopy.length > 0) {

            for (var i = 0, len = taxRatesCopy.length; i < len; i++) {
              taxRate += taxRatesCopy[i].rate;
            }

            taxRate = taxRate / 100;
            total = (subtotal * taxRate) + subtotal;
            $scope.total = total;

          } else {
            $scope.total = subtotal;
          }

          $scope.setDisabledSaveInvoice($scope.total === 0);

        }, true);

        function isLastUpdateValid(form) {
          var expensesLength = $scope.editInvoice.expenses.length;

          if (!expensesLength || expensesLength === 0) {
            return true;
          } else {
            return form['updateInvoice-' + (expensesLength - 1)].$valid;
          }
        }

      }]);

}());
