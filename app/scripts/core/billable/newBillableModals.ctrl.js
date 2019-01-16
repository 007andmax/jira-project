'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.newModalsCtlr',
    ['$scope', '$uibModalInstance', 'editedPayment', 'PaymentsService', '$rootScope',
      function ($scope, $uibModalInstance, editedPayment, PaymentsService, $rootScope) {
        $scope.close = $uibModalInstance.dismiss;

        $scope.paymentMethods = {
          REFUND_PAYMENT: 'Refund payment'
        };

        $scope.$watch('paymentMethod', function(val) {
        })

        $scope.paymentMethod = "REFUND_PAYMENT";
        $scope.editPaymentMethod = (editedPayment && editedPayment.paymentMethod);

        $scope.setPaymentMethod = function(val) {
          $scope.paymentMethod = val;
        }

        $scope.setEditPaymentMethod = function(val) {
          $scope.editPaymentMethod = val;
        }

        $scope.editPaymentMethods = {
          CASH: 'Cash',
          CHEQUE: 'Cheque',
          DEBIT_CARD: 'Debit Card',
          CREDIT_CARD: 'Credit Card',
          WIRE_TRANSFER: 'Wire Transfer'
        };


        $scope.invoiceNumbers = editedPayment.invoiceNumbers || [editedPayment.partialPaidInvoice];

        var isNumberKey = $rootScope.isNumberKey

        $scope.note = editedPayment.note;
        $scope.reference = editedPayment.reference;

        $scope.maxDate = new Date();
        $scope.invoiceNumbers = $scope.invoiceNumbers.reduce(function(acc, el) {

          var sum = $rootScope.uploadedReceivable.list.find(function(inv) {
            return inv.number == el;
          }).sum;


          acc.push({
            number: el,
            sum: sum
          });

          return acc;
        }, []);

        $scope.invoiceSum = $scope.invoiceNumbers.reduce(function(acc, el) {
          return acc + el.sum;
        }, 0);

        $scope.paymentAmount = editedPayment.partialPaidAmount || $scope.invoiceSum;

        $scope.$watch('paymentAmount', function(val) {
          console.log(val, '!!')
        })

        $scope.editPayment = function() {
          PaymentsService.editPayment({
            note: $scope.note,
            amount: $scope.paymentAmount.toFixed(2) || 0,
            paymentId: editedPayment.id,
            date: +moment($scope.date).format('x'),
            reference: $scope.reference,
            paymentMethod: $scope.editPaymentMethod
          }, function(res) {
            $scope.close()
          })
        }

        $scope.refundPayment = function() {
          PaymentsService.refundPayment({
            note: $scope.note,
            paymentId: editedPayment.id,
            refundMethod: $scope.paymentMethod,
            sendEmailNotification: $scope.isSendNotification
          }, function(res) {
            console.log(res, "RES")
            $scope.close()
          })
        }

      }]);
}());
