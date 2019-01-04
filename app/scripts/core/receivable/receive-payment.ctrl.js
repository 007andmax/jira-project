'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivePaymentCtrl',
    ['$scope', '$uibModalInstance', '$stateParams', 'ReceivableService', 'CompaniesService',
      function ($scope, $uibModalInstance, $stateParams, ReceivableService, CompaniesService) {

        var invoiceList = $scope.receivableInvoicesData.list;


        $scope.invoiceToReceive = {
          invoices: {},
          method: 'CHEQUE',
          isSendNotification: true
        };


        $scope.maxDate = new Date();

        $scope.receivePaymentInvoices = [];

        $scope.paymentMethod = {
          CASH: 'Cash',
          CHEQUE: 'Cheque',
          DEBIT_CARD: 'Debit Card',
          CREDIT_CARD: 'Credit Card',
          WIRE_TRANSFER: 'Wire Transfer'
        };

        $scope.close = function () {
          $uibModalInstance.dismiss('cancel');
        };

        if ($scope.mode === 'list') {
          for (var i = 0; i < invoiceList.length; i++) {
            if ($scope.invoiceToSent.invoices[invoiceList[i].number]) {
              $scope.receivePaymentInvoices.push(invoiceList[i]);
            }
          }
        } else {
          for (var companyId in $scope.invoiceToSent) {
            var invoices = $scope.invoiceToSent[companyId].invoices;

            for (var i = 0; i < invoiceList.length; i++) {
              if (invoices[invoiceList[i].number]) {
                $scope.receivePaymentInvoices.push(invoiceList[i]);
              }
            }
          }
        }

        for (var i = 0; i < $scope.receivePaymentInvoices.length; i++) {
          $scope.invoiceToReceive.invoices[$scope.receivePaymentInvoices[i].id] = true;
        }

        var company = CompaniesService.getOneById($scope.receivePaymentInvoices[0].company.id);
        if (company.defaultPaymentMethod) {
          $scope.invoiceToReceive.method = company.defaultPaymentMethod;
        }

        $scope.$watch('invoiceToReceive.invoices', function () {

          var counter = 0,
            invoices = $scope.invoiceToReceive.invoices;

          for (var invoiceId in invoices) {
            if (invoices[invoiceId]) {
              counter++;
            }
          }

          $scope.countReceiveInvoice = counter;
          $scope.invoiceToReceive.chooseAll = ($scope.receivePaymentInvoices.length === counter);
          $scope.receivePaymentSum = 0;

          for (var i = 0, len = $scope.receivePaymentInvoices.length; i < len; i++) {
            var invoice = $scope.receivePaymentInvoices[i];
            if (invoices[invoice.id]) {
              $scope.receivePaymentSum += invoice.sum;
            }
          }

        }, true);

        $scope.changeChooseAll = function () {
          var invoices = $scope.invoiceToReceive.invoices;
          for (var invoice in invoices) {
            invoices[invoice] = $scope.invoiceToReceive.chooseAll;
          }
        };

        $scope.receivePayment = function () {
          var invoiceIdPayment = [],
            invoices = $scope.invoiceToReceive.invoices;

          for (var id in invoices) {
            if (invoices[id]) {
              invoiceIdPayment.push(id)
            }
          }

          $scope.disableReceiveButton = true;

          ReceivableService.receivePayment(
            $scope.invoiceToReceive.method, invoiceIdPayment, !!$scope.invoiceToReceive.isSendNotification, $scope.note,
            function () {
              $uibModalInstance.dismiss('cancel');
              $scope.disableReceiveButton = false;

              $scope.invoiceToSent.invoices = {};
            }, moment($scope.date).format('x')
          );
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

      }]);

}());
