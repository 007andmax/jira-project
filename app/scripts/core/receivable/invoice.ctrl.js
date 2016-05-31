'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceCtrl',
    ['$scope', 'ReceivableService', '$rootScope', 'CompaniesService', '$timeout',
      function ($scope, ReceivableService, $rootScope, CompaniesService, $timeout) {

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);

        $scope.invoiceProperty = function (property) {
          var invoice = $scope.invoice;
          return invoice[property] || (invoice.invoices && invoice.invoices[invoice.invoices.length - 1][property]);
        };

        var dueDate = $scope.invoiceProperty('dueDate');

        if (dueDate <= Date.now()) {
          $scope.$emit('indicatorInvoice');
          $scope.dueDate = {
            over: true,
            value: dueDate
          }
        } else {
          $scope.dueDate = {
            over: false,
            value: dueDate
          }
        }

        $scope.sentInvoice = function () {
          var idInvoiceToSend;
          if ($scope.invoice.isRecurring) {
            idInvoiceToSend = ($scope.invoice.invoices[$scope.invoice.invoices.length - 1].id);
          } else {
            idInvoiceToSend = ($scope.invoice.id);
          }

          $scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            $scope.sending[idInvoiceToSend] = false;
          });
        };

        $scope.$watch('highlightInvoiceId', function (invoiceId) {
          if (invoiceId) {

            if ($scope.invoice.isRecurring) {
              for (var i = 0; i < $scope.invoice.invoices.length; i++) {
                if (invoiceId === $scope.invoice.invoices[i].id) {
                  $scope.$broadcast('showInvoice-' + ($scope.invoice.invoices[i].recurringInvoice.id));
                }
              }
            } else if (invoiceId === $scope.invoice.id) {
              $scope.$broadcast('showInvoice-' + invoiceId);
            }
            $timeout(function () {
              $scope.setHighlightInvoiceId();
            }, 3000)
          }
        });

        $scope.$on($scope.company.id + '-showInvoiceInList', function (event, invoiceId) {
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
