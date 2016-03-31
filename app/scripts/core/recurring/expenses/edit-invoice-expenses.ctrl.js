'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpensesCtrl',
    ['$scope', 'TaxRatesService',
      function ($scope, TaxRatesService) {

        var taxRatesCoef = 0;
        var tryToAddProduct = false;
        var tryToAddService = false;

        $scope.openTab = 'product';
        $scope.subtotal = 0;
        $scope.total = 0;
        $scope.tax = 0;

        TaxRatesService.getAllByCompany($scope.currentUser.company.id, $scope, function (resp) {
          var taxRatesCopy = angular.copy(resp);

          if (taxRatesCopy && taxRatesCopy.length > 0) {
            for (var i = 0, len = taxRatesCopy.length; i < len; i++) {
              taxRatesCoef += (taxRatesCopy[i].rate / 100);
            }
          }
        });

        $scope.addProduct = function (form) {
          if ($scope.openTab !== 'product') {
            $scope.openTab = 'product';
          }

          if (isLastProductValid(form)) {
            $scope.editInvoice.products.push({});
            tryToAddProduct = false;
          } else {
            tryToAddProduct = true;
          }
        };

        $scope.addService = function (form) {
          if ($scope.openTab !== 'service') {
            $scope.openTab = 'service';
          }

          if (isLastServiceValid(form)) {
            $scope.editInvoice.services.push({});
            tryToAddService = false;
          } else {
            tryToAddService = true;
          }
        };

        $scope.isShowingProductErrors = function (form, fieldName) {
          return form && form[fieldName] && (tryToAddProduct || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.isShowingServiceErrors = function (form, fieldName) {
          return form && form[fieldName] && (tryToAddService || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.$watch('editInvoice.products', calculateTotal, true);
        $scope.$watch('editInvoice.services', calculateTotal, true);

        function calculateTotal() {
          var subtotal = 0;
          var total = 0;
          var tax = 0;

          for (var i = 0, len = $scope.editInvoice.products.length; i < len; i++) {
            var product = $scope.editInvoice.products[i];

            if (product.quantity && product.item && product.item.sale) {
              subtotal += +product.quantity * +product.item.sale;

              if (product.item.taxable) {
                tax += subtotal * taxRatesCoef;
              }
            }
          }

          for (var i = 0, len = $scope.editInvoice.services.length; i < len; i++) {
            var service = $scope.editInvoice.services[i];

            if (service.quantity && service.item && service.item.rate) {
              subtotal += service.item.rate * (service.quantity / 60);

              if (service.item.taxable) {
                tax += subtotal * taxRatesCoef;
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
            return form['updateInvoiceProduct-' + (expensesLength - 1)].$valid;
          }
        }

        function isLastServiceValid(form) {
          var expensesLength = $scope.editInvoice.services.length;

          if (!expensesLength || expensesLength === 0) {
            return true;
          } else {
            return form['updateInvoiceService-' + (expensesLength - 1)].$valid;
          }
        }

      }]);

}());
