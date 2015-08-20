'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.createInvoiceCtrl',
    ['$scope', 'BillableService', 'CompaniesService', '$modalInstance',
      function ($scope, BillableService, CompaniesService, $modalInstance) {

        var locksCount = 0;

        $scope.invoiceLocks = [];
        $scope.showInvoiceLockIndex = 0;
        $scope.savingInvoiceInProcess = [];

        BillableService.getActualInvoiceNumber($scope, function (number) {
          $scope.invoiceNumber = number;
        });

        for (var companyId in $scope.ticketsSelection) {

          var selection = $scope.ticketsSelection[companyId];

          if (selection.checked) {
            lockTickets(companyId);
          } else {
            var selectedTickets = [];

            for (var ticketId in selection.tickets) {
              if (selection.tickets[ticketId]) {
                selectedTickets.push(ticketId)
              }
            }

            if (selectedTickets.length > 0) {
              lockTickets(companyId, selectedTickets);
            }
          }
        }

        $scope.$on('modal.closing', function () {
          $scope.invoiceLocks.forEach(function (lock) {
            BillableService.unlockTicketIds(lock.id);
          })
        });

        $scope.setShowInvoiceLockIndex = function (index) {

          if (index < 0) {
            index = $scope.invoiceLocks.length - 1;
          } else if (index >= $scope.invoiceLocks.length) {
            index = 0;
          }

          $scope.showInvoiceLockIndex = index;
        };

        $scope.close = function () {
          $modalInstance.dismiss();
        };

        $scope.print = function () {
          var lockId = $scope.invoiceLocks[$scope.showInvoiceLockIndex].id,
            wnd = window.open('/invoice/showInvoiceByLock/' + lockId);
          wnd.print();
        };

        $scope.createInvoice = function (lock) {

          if (!lock.expired) {

            $scope.savingInvoiceInProcess.push(lock.id);

            BillableService.createInvoice(lock.id, function (resp) {
              if (resp.id) {
                $scope.invoiceLocks.splice($scope.showInvoiceLockIndex, 1);

                if ($scope.invoiceLocks.length === 0) {
                  $scope.close();
                } else {
                  $scope.setShowInvoiceLockIndex($scope.showInvoiceLockIndex - 1);
                }
              }

              var index = $scope.savingInvoiceInProcess.indexOf(lock.id);
              if (index > -1) {
                $scope.savingInvoiceInProcess.splice(index, 1);
              }
            })
          }
        };

        function lockTickets(companyId, selectedTickets) {

          locksCount++;

          if (selectedTickets) {

            BillableService.lockTicketIds(selectedTickets, function (resp) {
              addLock(companyId, resp.lockId)
            });

          } else {

            BillableService.lockTicketsByCompany(companyId, function (resp) {
              addLock(companyId, resp.lockId)
            });
          }
        }

        function addLock(companyId, lockId) {
          if (companyId && lockId) {
            $scope.invoiceLocks.push({
              id: lockId,
              company: CompaniesService.getOneById(companyId)
            });
          }

          locksCount--;

          if (locksCount === 0) {
            $scope.locksInitialized = true;

            if ($scope.invoiceLocks.length === 0) {
              $scope.close();
            }
          }
        }
      }]);

}());
