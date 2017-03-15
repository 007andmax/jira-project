'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpensesCtrl',
    ['$scope', '$filter',
      function ($scope, $filter) {

        $scope.openTab = 'product';
        $scope.subtotal = 0;
        $scope.total = 0;
        $scope.tax = 0;

        $scope.addProduct = function (form) {
          if ($scope.openTab !== 'product') {
            $scope.openTab = 'product';
          }

          if (isLastProductValid(form)) {
            $scope.editInvoice.products.push({});
            $scope.tryAddExpense.tryToAddProduct = false;
          } else {
            $scope.tryAddExpense.tryToAddProduct = true;
          }
        };

        $scope.addService = function (form) {
          if ($scope.openTab !== 'service') {
            $scope.openTab = 'service';
          }

          if (isLastServiceValid(form)) {
            $scope.editInvoice.services.push({ date: $filter('date')(new Date(), 'dd MMM yyyy') });
            $scope.tryAddExpense.tryToAddService = false;
          } else {
            $scope.tryAddExpense.tryToAddService = true;
          }
        };

        $scope.isShowingProductErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.tryAddExpense.tryToAddProduct || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.isShowingServiceErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.tryAddExpense.tryToAddService || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.$watch('editInvoice.products', calculateTotal, true);
        $scope.$watch('editInvoice.services', calculateTotal, true);
        $scope.$watch('taxRatesCoef', calculateTotal);

        function calculateTotal() {
          var subtotal = 0;
          var tax = 0;

          for (var i = 0, len = $scope.editInvoice.products.length; i < len; i++) {
            var product = $scope.editInvoice.products[i];

            if (product.quantity && product.item && product.item.sale) {
              subtotal += +product.quantity * +product.item.sale;

              //todo: change calculating tax logic
              if (product.item.taxable) {
                tax += (+product.quantity * +product.item.sale) * $scope.taxRatesCoef;
              }
            }
          }

          for (var i = 0, len = $scope.editInvoice.services.length; i < len; i++) {
            var service = $scope.editInvoice.services[i];

            if (service.quantity && service.item && service.item.rate) {
              subtotal += service.item.rate * (service.quantity / 60);

              //todo: change calculating tax logic
              if (service.item.taxable) {
                tax += (service.item.rate * (service.quantity / 60)) * $scope.taxRatesCoef;
              }
            }
          }

          $scope.subtotal = subtotal;
          $scope.tax = tax;
          $scope.total = subtotal + tax;

          $scope.setDisabledSaveInvoice($scope.total === 0);

        }

        function isLastProductValid(form) {
          var expensesLength = $scope.editInvoice.products.length;

          if (!expensesLength || expensesLength === 0) {
            return true;
          } else {
            form['updateInvoiceProduct-' + (expensesLength - 1)].$setDirty();
            return form['updateInvoiceProduct-' + (expensesLength - 1)].$valid;
          }
        }

        function isLastServiceValid(form) {
          var expensesLength = $scope.editInvoice.services.length;

          if (!expensesLength || expensesLength === 0) {
            return true;
          } else {
            form['updateInvoiceService-' + (expensesLength - 1)].$setDirty();
            return form['updateInvoiceService-' + (expensesLength - 1)].$valid;
          }
        }

      }]);

}());
