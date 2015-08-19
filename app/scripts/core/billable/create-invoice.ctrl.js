'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.createInvoiceCtrl',
    ['$scope', 'BillableService', 'CompaniesService', '$modalInstance',
      function ($scope, BillableService, CompaniesService, $modalInstance) {

        var locksCount = 0;

        $scope.invoiceLocks = [];
        $scope.showInvoiceLockIndex = 0;

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

        function lockTickets(companyId, selectedTickets) {

          locksCount++;

          if (selectedTickets) {

            BillableService.lockTicketsByIds(selectedTickets, function (resp) {
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
