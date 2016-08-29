'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceCtrl',
    ['$scope', 'ReceivableService', '$rootScope', 'CompaniesService',
      function ($scope, ReceivableService, $rootScope, CompaniesService) {
        var disableInvoiceButtons = false;

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);

        if ($scope.invoice.dueDate <= Date.now()) {
          $scope.$emit('indicatorInvoice');
          $scope.dueDate = {
            over: true,
            value: $scope.invoice.dueDate
          }
        } else {
          $scope.dueDate = {
            over: false,
            value: $scope.invoice.dueDate
          }
        }

        $scope.sentInvoice = function () {
          var idInvoiceToSend = $scope.invoice.id;
          $scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            $scope.sending[idInvoiceToSend] = false;
          });
        };

        $scope.rollbackInvoice = function (invoiceId) {
          if (!disableInvoiceButtons) {
            disableInvoiceButtons = true;
            ReceivableService.rollback(invoiceId, function () {
              disableInvoiceButtons = false;
            })
          }
        };

        $scope.deleteInvoice = function (invoiceId) {
          if (!disableInvoiceButtons) {
            disableInvoiceButtons = true;
            ReceivableService.remove(invoiceId, function () {
              disableInvoiceButtons = false;
            })
          }
        };

      }]);

}());
