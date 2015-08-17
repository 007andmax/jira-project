'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivePaymentCtrl',
    ['$scope', '$modalInstance', '$stateParams', 'ReceivableService',
      function ($scope, $modalInstance, $stateParams, ReceivableService) {

        $scope.invoiceToReceive = {
          invoices: {},
          method: 'CHEQUE'
        };

        var invoicesIdToSend = [];

        $scope.paymentMethod = {
          CASH: 'Cash',
          CHEQUE: 'Cheque',
          DEBIT_CARD: 'Debit Card',
          CREDIT_CARD: 'Credit Card'
        };

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

        if ($stateParams.mode === 'list') {
          for (var id in $scope.invoiceToSent.invoices) {
            if ($scope.invoiceToSent.invoices[id]) {
              invoicesIdToSend.push(id);
            }
          }
        } else {
          angular.forEach($scope.invoiceToSent, function (value, key) {
            if (this[key].invoices !== undefined) {
              for (var id in this[key].invoices) {
                if (this[key].invoices[id]) {
                  invoicesIdToSend.push(id);
                }
              }
            }
          }, $scope.invoiceToSent);
        }

        $scope.filterById = function () {
          return $scope.receivableInvoicesData.list.filter(function (invoice) {
            return invoicesIdToSend.indexOf(invoice.id) !== -1;
          });
        };

        $scope.choosenInvoices = $scope.filterById($scope.receivableInvoicesData.list);

        for (var i = 0; i < $scope.choosenInvoices.length; i++) {
          $scope.invoiceToReceive.invoices[$scope.choosenInvoices[i].id] = true;
        }

        $scope.$watch('invoiceToReceive.invoices', function () {

          var countObj = 0;

          for (var invoiceId in $scope.invoiceToReceive.invoices) {
            if ($scope.invoiceToReceive.invoices[invoiceId]) {
              countObj++;
            }
          }

          $scope.invoiceToReceive.chooseAll = ($scope.choosenInvoices.length === countObj );

        }, true);

        $scope.changeChooseAll = function () {
          for (var invoice in $scope.invoiceToReceive.invoices) {
            $scope.invoiceToReceive.invoices[invoice] = $scope.invoiceToReceive.chooseAll;
          }
        };

        $scope.$watch('invoiceToReceive.invoices', function () {
          $scope.receivePaymentSum = 0;
          for (var i = 0; i < $scope.choosenInvoices.length; i++) {
            if ($scope.invoiceToReceive.invoices[$scope.choosenInvoices[i].id]) {
              $scope.receivePaymentSum += $scope.calculateTotalInvoiceSum($scope.choosenInvoices[i]);
            }
          }
        }, true);

        $scope.receivePayment = function () {
          var invoiceIdPayment = [];
          for (var id in $scope.invoiceToReceive.invoices) {
            if ($scope.invoiceToReceive.invoices[id]) {
              invoiceIdPayment.push(id)
            }
          }
          ReceivableService.receivePayment($scope.invoiceToReceive.method, invoiceIdPayment)
        }

      }]);

}());
