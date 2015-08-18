'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivePaymentCtrl',
    ['$scope', '$modalInstance', '$stateParams', 'ReceivableService',
      function ($scope, $modalInstance, $stateParams, ReceivableService) {

        $scope.invoiceToReceive = {
          invoices: {},
          method: 'CHEQUE'
        };

        var chosenInvoices = [];

        $scope.receivePaymentInvoices = [];

        var invoiceList = $scope.receivableInvoicesData.list;

        $scope.paymentMethod = {
          CASH: 'Cash',
          CHEQUE: 'Cheque',
          DEBIT_CARD: 'Debit Card',
          CREDIT_CARD: 'Credit Card',
          WIRE_TRANSFER: 'Wire Transfer'
        };

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

        if ($stateParams.mode === 'list') {
          for (var i = 0; i < invoiceList.length; i++) {
            if ($scope.invoiceToSent.invoices[invoiceList[i].id]) {
              chosenInvoices.push(invoiceList[i])
            }
          }
        } else {
          angular.forEach($scope.invoiceToSent, function (value, key) {
            if (this[key].invoices !== undefined) {
              for (var i = 0; i < invoiceList.length; i++) {
                if (this[key].invoices[invoiceList[i].id]) {
                  chosenInvoices.push(invoiceList[i])
                }
              }
            }
          }, $scope.invoiceToSent);
        }

        for (var i = 0; i < chosenInvoices.length; i++) {
          if (chosenInvoices[i].isRecurring) {
            for (var j = 0; j < chosenInvoices[i].invoices.length; j++) {
              $scope.receivePaymentInvoices.push(chosenInvoices[i].invoices[j])
            }
          } else {
            $scope.receivePaymentInvoices.push(chosenInvoices[i]);
          }
        }

        for (var i = 0; i < $scope.receivePaymentInvoices.length; i++) {
          $scope.invoiceToReceive.invoices[$scope.receivePaymentInvoices[i].id] = true;
        }

        $scope.$watch('invoiceToReceive.invoices', function () {

          var countObj = 0;

          for (var invoiceId in $scope.invoiceToReceive.invoices) {
            if ($scope.invoiceToReceive.invoices[invoiceId]) {
              countObj++;
            }
          }

          $scope.invoiceToReceive.chooseAll = ($scope.receivePaymentInvoices.length === countObj );

        }, true);

        $scope.changeChooseAll = function () {
          for (var invoice in $scope.invoiceToReceive.invoices) {
            $scope.invoiceToReceive.invoices[invoice] = $scope.invoiceToReceive.chooseAll;
          }
        };

        $scope.$watch('invoiceToReceive.invoices', function () {
          $scope.receivePaymentSum = 0;
          for (var i = 0; i < $scope.receivePaymentInvoices.length; i++) {
            if ($scope.invoiceToReceive.invoices[$scope.receivePaymentInvoices[i].id]) {
              $scope.receivePaymentSum += $scope.receivePaymentInvoices[i].sum;
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
        };

        $scope.checkInvoicesRendering = function (finished) {
          if (finished) {
            $scope.$emit('invoicesRenderingFinished');
          }
        };

        $scope.$watch('invoiceToReceive.invoices', function () {
          $scope.countReceiveInvoice = 0;
          for (var id in $scope.invoiceToReceive.invoices) {
            if ($scope.invoiceToReceive.invoices[id]) {
              $scope.countReceiveInvoice++;
            }
          }
        }, true);

      }]);

}());
