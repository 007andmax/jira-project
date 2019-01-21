'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceCtrl',
    ['$scope', 'ReceivableService', '$rootScope', 'CompaniesService', 'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, ReceivableService, $rootScope, CompaniesService, UserConfirmationsService, UserNotificationService) {
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

        if ($scope.invoice.payment) {
          $scope.paymentSum = $scope.invoice.payment.totalSum;

        }




        if ($scope.invoice.payment && $scope.invoice.partialPayments) {

          $scope.invoice.partialPayments.forEach(function(el) {
            console.log(el.partialPaidAmount, $scope.invoice.payment.totalSum, 'ASDSDDS')
            $scope.paymentSum -= el.partialPaidAmount;
          })
        }

        $scope.parsePaymentMethod = function(method) {
          return method.split('_').map(function(el) {
            return el[0].toUpperCase() + el.slice(1).toLowerCase();
          }).join(' ');
        }

        // var paymentInfo = document.querySelectorAll('.payment-info-submenu');
        //
        // paymentInfo.forEach(function(el) {
        //   el.style.zIndex = 100000;
        // })

        var today = Date.now();
        var dueDate = new Date($scope.invoice.dueDate).getTime();
        var dateOfinvoiceCreate = new Date($scope.invoice.date).getTime();
        var overDue;
        var outstanding;
        $scope.invoice.isOverDue = false;
        $scope.invoice.isOutstanding = false;
        $scope.invoice.daysDueDateForSorting;
        $scope.invoice.dueDatePositionForSorting;

        $scope.invoice.isReadedAt = !!$scope.invoice.readedAt;
        $scope.invoice.readedAtInMilliseconds = $scope.invoice.readedAt ? new Date($scope.invoice.readedAt).getTime() : 999999999999999999999;
        $scope.invoice.readedAtInMillisecondsReverse = $scope.invoice.readedAt ? new Date($scope.invoice.readedAt).getTime() : -999999999999999999999;

        $scope.getDueDate = function(){
          overDue = (dueDate - today)/86400000;
          outstanding = (dateOfinvoiceCreate - today)/86400000;
          $scope.invoice.isOverDue = (overDue < 0);
          $scope.invoice.isOutstanding = (overDue > 0);
          if($scope.invoice.isOverDue) {
            $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(overDue))) + 1000000000;
            $scope.invoice.dueDatePositionForSorting = 0;
            return Math.abs(Math.floor(overDue));
          } else if ($scope.invoice.isOutstanding) {
            $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(outstanding))) + 2000000000;
            $scope.invoice.dueDatePositionForSorting = 1;
            return Math.abs(Math.floor(outstanding));
          }

        };

        $scope.getPaidOnDate = function() {
          var paidOn =  new Date($scope.invoice.paidOn).getTime();
          var paid = (today - paidOn)/86400000;
          $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(paid))) + 3000000000 ;
          $scope.invoice.dueDatePositionForSorting = 2;
          return Math.floor(Math.abs(paid));
        };


        $scope.sentInvoice = function () {
          var idInvoiceToSend = $scope.invoice.id;
          $scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            $scope.sending[idInvoiceToSend] = false;
            UserNotificationService.show('The invoice has been sent', true);
          });
        };

        $scope.markAsRead = function(invoice){
          ReceivableService.markAsRead(invoice.id, function(resp){
          })
        };

        $scope.rollbackInvoice = function (invoice) {
          if (!disableInvoiceButtons && !invoice.recurringInvoice) {
            var confirmMessage = 'Do you want to rollback invoice #' + invoice.number + '? ' +
              (invoice.ticketNumbers && invoice.ticketNumbers.length ? (invoice.ticketNumbers.length > 1 ? 'Tickets #' : 'Ticket #') +
              invoice.ticketNumbers.join(', #') + ' will be restored.' : '');

            if (invoice.paidOn) {
              confirmMessage = 'Invoice will be marked as not paid.';
            }

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
