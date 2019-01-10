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
          console.log('HUUUI', val)
        })

        $scope.paymentMethod = "REFUND_PAYMENT";

        $scope.setPaymentMethod = function(val) {
          $scope.paymentMethod = val;
        }


        $scope.invoiceNumbers = editedPayment.invoiceNumbers || [editedPayment.partialPaidInvoice];


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

        $scope.editPayment = function() {
          PaymentsService.editPayment({
            note: $scope.note,
            amount: $scope.paymentAmount.toFixed(2) || 0,
            paymentId: editedPayment.id,
            date: null && moment($scope.date).format('X'),
            reference: $scope.reference
          })
        }

        $scope.refundPayment = function() {
          PaymentsService.refundPayment({
            note: $scope.note,
            paymentId: editedPayment.id,
            refundMethod: $scope.paymentMethod,
            sendEmailNotification: $scope.isSendNotification
          }, function(res) {
            $scope.close()
          })
        }

      }]);
}());
