'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.createInvoiceCtrl',
    ['$scope', 'BillableService', 'CompaniesService', '$uibModalInstance', 'Downloader',  'quicktech.common.services.UserNotificationService', '$timeout',
      function ($scope, BillableService, CompaniesService, $uibModalInstance, Downloader, UserNotificationService, $timeout) {

        var locksCount = 0;

        $scope.invoiceLocks = [];
        $scope.showInvoiceLockIndex = 0;
        $scope.savingInvoiceInProcess = [];
        $scope.lockInfo = {};
        $scope.invoiceCreated = false;
        $scope.shoeInvoiceCreatedMessage = false;
        $scope.notificationMessage = 'Invoice has been created';

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
            BillableService.unlockTicketIds(lock.lockId);
          })
        });

        window.onbeforeunload = function () {

          for (var i = 0; i < $scope.invoiceLocks.length; i++) {

            var lockId = $scope.invoiceLocks[i].lockId,
              xmlhttp = new XMLHttpRequest();

            xmlhttp.open("GET", '/invoice/unlock/' + lockId, false); //the false is for making the call synchronous
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send();
          }
        };

        $scope.$on('$destroy', function () {
          window.onbeforeunload = undefined;
        });

        $scope.$watch('currentUser.permissions', function (permissions) {
          if (permissions && !$scope.PermissionsService.isAllowed('CREATE_INVOICE')) {
            $uibModalInstance.dismiss();
          }
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
          $uibModalInstance.dismiss();
        };

        $scope.print = function () {
          var lockId = $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId,
            currentAddressId = $scope.lockInfo[$scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId].addressId,
            currentContactAddress = $scope.lockInfo[$scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId].contactId,
            wnd = window.open('/invoice/show/lock/' + lockId + '/pdf?isEditable=true&shipTo=' + currentAddressId + '&billTo=' + currentContactAddress);
          wnd.print();
        };

        $scope.download = function () {
          var lockId = $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId,
            currentAddressId = $scope.lockInfo[$scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId].addressId,
            currentContactAddress = $scope.lockInfo[$scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId].contactId;

          Downloader.downloadByUrl('/invoice/show/lock/' + lockId + '/pdf?isDownload=true&shipTo=' + currentAddressId + '&billTo=' + currentContactAddress, 'Invoice.pdf')
        };


        $scope.createInvoice = function (lock, callback) {
          if (lock && !lock.expired ) {
            $scope.savingInvoiceInProcess.push(lock.id);
            var contactId = $scope.lockInfo[$scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId].contactId;
            var addressId = $scope.lockInfo[$scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId].addressId;
            var isSend = !callback;

            if (callback) {
              callback();
            }

            BillableService.createInvoice(lock.lockId, isSend, contactId, addressId, function (resp) {
              if (resp.id) {
                $scope.invoiceLocks.splice($scope.showInvoiceLockIndex, 1);
                if ($scope.invoiceLocks.length === 0) {
                  //$scope.close();
                } else {
                  $scope.setShowInvoiceLockIndex($scope.showInvoiceLockIndex - 1);
                }
                $scope.shoeInvoiceCreatedMessage = true;

              }

              var index = $scope.savingInvoiceInProcess.indexOf(lock.id);
              if (index > -1) {
                $scope.savingInvoiceInProcess.splice(index, 1);
              }
              $scope.invoiceCreated = true;
            })
          }
        };

        function lockTickets(companyId, selectedTickets) {

          locksCount++;

          if (selectedTickets) {

            BillableService.lockTicketIds(selectedTickets, function (resp) {
              addLock(resp)
            });

          } else {

            BillableService.lockTicketsByCompany(companyId, function (resp) {
              addLock(resp)
            });
          }
        }

        function addLock(lock) {

          var isLockId = lock && lock.lockId,
            isCompanyId = lock && lock.invoiceDataDto && lock.invoiceDataDto.company && lock.invoiceDataDto.company.id;

          if (isLockId && isCompanyId) {

            var lockObj = angular.copy(lock);
            lockObj.invoiceDataDto.company.companyInfo = CompaniesService.getOneById(lock.invoiceDataDto.company.id);

            $scope.invoiceLocks.push(lockObj);
            console.log('$scope.invoiceLocks', $scope.invoiceLocks)

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
