'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceCtrl',
    ['$scope', 'ReceivableService', '$rootScope', 'CompaniesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, ReceivableService, $rootScope, CompaniesService, UserConfirmationsService) {
        var disableInvoiceButtons = false;

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);
        $scope.invoice.companyName = CompaniesService.getOneById($scope.invoice.company.id).name;

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

        var today = Date.now();
        var dueDate = new Date($scope.invoice.dueDate).getTime();
        var overDue;
        $scope.isOverDue = false;
        $scope.isOutstanding = false;

        $scope.getDueDate = function(){
          overDue = (dueDate - today)/86400000;
          $scope.isOverDue = (overDue < 0);
          $scope.isOutstanding = (overDue > 0);
          return Math.abs(Math.floor(overDue));
        };

        $scope.getPaidOnDate = function() {
          var paidOn =  new Date($scope.invoice.paidOn).getTime();
          var paid = (paidOn - today)/86400000;
          return Math.abs(Math.floor(paid));
        };

        $scope.invoiceFilterChecker = function(invoice) {
          if($scope.invoiceFilter && $scope.invoiceFilter !== '' && $scope.invoiceFilter !== ' ') {
            return (invoice.number.indexOf($scope.invoiceFilter) > -1 || invoice.companyName.indexOf($scope.invoiceFilter) > -1)
          } else {
            return true;
          }
        };

        $scope.sortByFilterChecker = function(invoice) {
          if($scope.sortByValue === 'Paid invoices') {
            return !!invoice.paidOn;
          } else if($scope.sortByValue === 'Outstanding invoices') {
            return $scope.isOutstanding && !invoice.paidOn
          } else if($scope.sortByValue === 'Overdue invoices') {
            return $scope.isOverDue && !invoice.paidOn
          } else {
            return true;
          }
        };

        $scope.dateFilterChecker = function(invoice) {
          if($scope.invoiceDateFilter.startDate && $scope.invoiceDateFilter.endDate) {
            var invoiceDate = new Date(invoice.date).getTime();
            var startDateFromFilter = new Date($scope.invoiceDateFilter.startDate._d).getTime();
            var endDateFromFilter = new Date($scope.invoiceDateFilter.endDate._d).getTime();
            return (invoiceDate >= startDateFromFilter && invoiceDate <= endDateFromFilter);
          }else {
            return true;
          }
        };

        $scope.sentInvoice = function () {
          var idInvoiceToSend = $scope.invoice.id;
          $scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            $scope.sending[idInvoiceToSend] = false;
          });
        };

        $scope.markAsRead = function(invoice){
          ReceivableService.markAsRead(invoice.id, function(resp){
            console.log(resp);
          })
        };

        $scope.rollbackInvoice = function (invoice) {
          if (!disableInvoiceButtons && !invoice.recurringInvoice) {
            var confirmMessage = 'Do you want to rollback invoice #' + invoice.number + '? ' +
              (invoice.ticketNumbers.length ? (invoice.ticketNumbers.length > 1 ? 'Tickets #' : 'Ticket #') +
              invoice.ticketNumbers.join(', #') + ' will be restored.' : '');

            disableInvoiceButtons = true;
            UserConfirmationsService.show(confirmMessage, 'OK').then(function (resp) {
              ReceivableService.rollback(invoice.id, function () {
                disableInvoiceButtons = false;
              });
            }, function () {
              disableInvoiceButtons = false;
            });
          }
        };

        $scope.deleteInvoice = function (invoice) {
          if (!disableInvoiceButtons) {
            var confirmMessage = 'Do you want to delete invoice #' + invoice.number + '?';
            disableInvoiceButtons = true;
            UserConfirmationsService.show(confirmMessage, 'OK').then(function (resp) {
              ReceivableService.remove(invoice.id, function () {
                disableInvoiceButtons = false;
              });
            }, function () {
              disableInvoiceButtons = false;
            });
          }
        };

      }]);

}());
