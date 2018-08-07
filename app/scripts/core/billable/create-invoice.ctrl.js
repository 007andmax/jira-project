'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.createInvoiceCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'Downloader',  'quicktech.common.services.UserNotificationService', '$timeout', '$rootScope', 'EmailSettingsService',
      function ($scope, BillableService, CompaniesService, Downloader, UserNotificationService, $timeout, $rootScope, EmailSettingsService) {

        var locksCount = 0;

        $scope.invoiceLocks = [];
        $scope.showInvoiceLockIndex = 0;
        $scope.savingInvoiceInProcess = [];
        $scope.lockInfo = {};
        $scope.invoiceCreated = false;
        $scope.shoeInvoiceCreatedMessage = false;
        $scope.notificationMessage = 'Invoice has been created';
        $scope.editCompany = CompaniesService.getCurrentCompany().staticCopy();
        $scope.firstUpdatedDate = false;

        $scope.regularNotes = [];
        $scope.globalNote = {};

        var placeholderNotes = [
          {
            title: 'Note 1',
            noteType: 'REGULAR',
            line1: 'Note 1 description'
          },
          {
            title: 'Note 2',
            noteType: 'REGULAR',
            line1: 'Note 2 description'
          },
          {
            title: 'Note 3',
            noteType: 'REGULAR',
            line1: 'Note 3 description'
          },
          {
            title: 'Note 4',
            noteType: 'REGULAR',
            line1: 'Note 4 description'
          },
          {
            title: 'Note 5',
            noteType: 'REGULAR',
            line1: 'Note 5 description'
          },
          {
            noteType: 'GLOBAL',
            line1: 'Terms & Conditions description'
          },
        ]

        BillableService.getInvoiceData(function(res) {
          var data = res.data;
          // console.log(data, 'data')

          if (!data || data.length === 0) {
            var requests = 0;

            for (var i = 0; i < placeholderNotes.length; i++) {
              BillableService.createNote(placeholderNotes[i], function(res) {
                requests++;

                if (request === 6) {
                  BillableService.getInvoiceData(function(res) {
                    var data = res.data;

                    adaptNotes(data);
                  })
                }
              });
            }
          }

          adaptNotes(data)


          function adaptNotes(data) {
            $scope.regularNotes = data.filter(function(el) {
              return el.noteType === 'REGULAR';
            });

            $scope.globalNote = data.filter(function(el) {
              return el.noteType === 'GLOBAL';
            })[0];


            $scope.globalNote.line = $scope.globalNote.line1 + ($scope.globalNote.line2 || '');
          }


        })

        $scope.chosenNote = {
          title: '',
          line1: '',
          line2: ''
        }



        $scope.taxIdData = {
          taxIdDescription: '',
          taxId: ''
        };
        EmailSettingsService.getTaxNumber(function(resp) {
          $scope.taxIdData = resp;
        });

        $scope.changeTaxIdData = function() {
          EmailSettingsService.updateTaxNumber($scope.taxIdData, function(resp) {
            console.log(resp);
          })
        };


        $scope.$watch(function() {
          return $rootScope.attachDraggedAvatar;
        }, function(val) {
          if (val) {
            $scope.attachDraggedAvatar = val;
            console.log(val, "VAL")
          }
        })
        $scope.$watch('ticketNote', function(val) {
          // console.log(val, 'ticketNote a sa  as saas sas sa as a as ')
        })

        $scope.saveNote = function() {

        }

        $scope.saveUpdatedNote = function(globalUpdate, note) {
          var note = note || $scope.chosenNote;
          var line1 = note.line.slice(0, 255);
          var line2 = note.line.slice(255, 510)

          if (!note) {
            $scope.chosenNote.line1 = line1;
            $scope.chosenNote.line2 = line2;
            $scope.chosenNote.title = note.title;
          }

          var data = {
            title: note.title,
            line1: line1,
            line2: line2 || null
          }

          if (globalUpdate) {
            BillableService.updateNote(data, note.id)

            if (!note) {
              $scope.ticketNote = Object.assign({}, $scope.chosenNote);
            }


          } else {
            console.log("SOMETHING HApPEN")
            data.noteType = "REGULAR"
            data.suggestedNote = false;
            delete data.line;

            $scope.addNoteToInvoice(data);
          }



        }

        $scope.updateNote = function(note) {
          $scope.chosenNote = note;
          $scope.chosenNote.line = note.line1 + (note.line2 || '');

          note = Object.assign({}, note);
          note.suggestedNote = true;

          $scope.addNoteToInvoice(note);
          console.log($scope.chosenNote, 'CJOSEN')
        }

        $scope.savePaymentDue = function(due) {
          console.log('payment due', due)

          $scope.paymentDue = moment(due).format("YYYY-MM-DD")

          console.log(moment(due).format("YYYY-MM-DD"), 'moment')

          if (!$scope.firstUpdatedDate) {
            $scope.firstUpdatedDate = true;
          } else {
            var request = {
              "invoiceNumber": $scope.invoiceNumber || null, // null is allowed
              "dueDate": $scope.paymentDue, // null is allowed
              "invoiceNoteIds": [] || null
            }

            BillableService.updateInvoiceData(request, $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId)
          }
        }

        $scope.addNoteToInvoice = function(data) {
          var request = {
            regularInvoiceNote: data
          };

          BillableService.updateInvoiceData(request, $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId)
        }

        BillableService.getActualInvoiceNumber($scope, function (number) {
          $scope.invoiceNumber = number;
          $scope.receivedInvoiceNumber = true;
        });

        $scope.isInvoiceHeaderShown = true;

        console.log($scope.ticketsSelection, 'tickets tickets')

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

        $scope.toggleInvoiceHeader = function() {
          $scope.isInvoiceHeaderShown = !$scope.isInvoiceHeaderShown;
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

        $scope.$watch('invoiceNumber', function(val) {
          if ($scope.receivedInvoiceNumber && $scope.invoiceLocks[$scope.showInvoiceLockIndex] && $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId) {
            console.log(val, $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId, 'updated update')
            var request = {
              "invoiceNumber": val, // null is allowed
              "dueDate": $scope.paymentDue || null, // null is allowed
              "invoiceNoteIds": [] || null
            }

            BillableService.updateInvoiceData(request, $scope.invoiceLocks[$scope.showInvoiceLockIndex].lockId)
          }
        })

        $scope.changeInvoiceNumber = function(value) {
          $scope.invoiceNumber = value;
        }

        $scope.updateInvoice = function(data) {

        }

        function lockTickets(companyId, selectedTickets) {

          locksCount++;

          console.log('IM HERE', selectedTickets)

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

          }

          locksCount--;
          console.log('$scope.invoiceLocks', $scope.invoiceLocks)

          if (locksCount === 0) {
            $scope.locksInitialized = true;

            if ($scope.invoiceLocks.length === 0) {
              $scope.close();
            }
          }
        }
      }]);

}());
