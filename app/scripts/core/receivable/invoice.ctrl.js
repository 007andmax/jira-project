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
        $scope.invoice.isOverDue = false;
        $scope.invoice.isOutstanding = false;
        $scope.invoice.daysDueDateForSorting;
        $scope.invoice.dueDatePositionForSorting;

        $scope.invoice.isReadedAt = !!$scope.invoice.readedAt;
        $scope.invoice.readedAtInMilliseconds = new Date($scope.invoice.readedAt).getTime()

        $scope.getDueDate = function(){
          overDue = (dueDate - today)/86400000;
          $scope.invoice.isOverDue = (overDue < 0);
          $scope.invoice.isOutstanding = (overDue > 0);
          if($scope.invoice.isOverDue) {
            $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(overDue))) * -1;
            $scope.invoice.dueDatePositionForSorting = 0;
          } else if ($scope.invoice.isOutstanding) {
            $scope.invoice.daysDueDateForSorting = Math.abs(Math.floor(overDue));
            $scope.invoice.dueDatePositionForSorting = 1;
          }
          return Math.abs(Math.floor(overDue));
        };

        $scope.getPaidOnDate = function() {
          var paidOn =  new Date($scope.invoice.paidOn).getTime();
          var paid = (paidOn - today)/86400000;
          $scope.invoice.daysDueDateForSorting = Math.abs(Math.floor(paid)) * -1;
          $scope.invoice.dueDatePositionForSorting = 2;
          return Math.abs(Math.floor(paid));
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
