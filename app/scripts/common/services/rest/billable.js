'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('BillableService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

      function recalculateTotalSumForCompany(company) {
        company.totalSum = 0;
        for (var i = 0; i < company.tickets.length; i++) {
          var ticket = company.tickets[i];
          ticket.sum = 0;

          if (ticket.productExpense && ticket.productExpense.length) {
            for (var k = 0; k < ticket.productExpense.length; k++) {
              var productExpense = ticket.productExpense[k];
              ticket.sum += productExpense.totalSum;
            }
          }

          if (ticket.serviceExpense && ticket.serviceExpense.length) {
            for (var j = 0; j < ticket.serviceExpense.length; j++) {
              var serviceExpense = ticket.serviceExpense[j];
              ticket.sum += serviceExpense.totalSum;
            }
          }
          company.totalSum += company.tickets[i].sum;
        }
      }

      function calculateTotalSums(info) {
        for (var key in info) {
          if (key === 'staticCopy') {
            continue;
          }

          var company = info[key];
          company.totalSum = 0;

          recalculateTotalSumForCompany(company);
        }
      }

      function setLockTypeForCompanies(info) {
        for (var key in info) {

          if (key === 'staticCopy') continue;

          info[key].lockType = "NONE";

          for (var i = 0; i < info[key].tickets.length; i++) {

            var ticket = info[key].tickets[i];

            if (info[key].lockType === 'NONE' && ticket.lockedBy != null) {
              info[key].lockType = 'ALL';
            } else if (info[key].lockType == 'ALL' && ticket.lockedBy == null) {
              info[key].lockType = 'NOT_ALL';
            }
          }
        }
      }

      function getBillablePageDto(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        var info = Utils.customizeObj({});

        $http.get('/billable/billablePageInfo').then(function (resp) {

          Utils.customizeObj(resp.data, info);
          calculateTotalSums(info);
          setLockTypeForCompanies(info);

          RealTimeService.subscribe('/billablePage', scope, function (newChange) {

            if (newChange.action == 'BILLABLE_EXPENSE_ADDED') {

              var clientCompanyId = newChange.data.companyId;

              if (!info[clientCompanyId]) {
                info[clientCompanyId] = {};
                info[clientCompanyId].tickets = [];
                info[clientCompanyId].totalSum = 0;
                info[clientCompanyId].lockType = 'NONE';
              }

              var ticket = Utils.findById(info[clientCompanyId].tickets, newChange.data.id);

              if (!ticket) {
                ticket = {};
                info[clientCompanyId].tickets.push(ticket);
              }

              Utils.customizeObj(newChange.data, ticket);

              recalculateTotalSumForCompany(info[clientCompanyId]);

              if (callback) {
                callback(info);
              }

            } else if (newChange.action == 'BILLABLE_EXPENSE_REMOVED') {

              var tickets = info[newChange.data.companyId].tickets;
              var index = Utils.indexOfId(tickets, newChange.data.ticketId);

              if (index > -1) {
                tickets.splice(index, 1);
              }

              if (!tickets || !tickets.length || tickets.length === 0) {
                delete info[newChange.data.companyId];
              } else {
                recalculateTotalSumForCompany(info[newChange.data.companyId]);
              }

              if (callback) {
                callback(info);
              }

            } else if (newChange.action == 'TICKET_LOCKED') {
              var userId = Object.keys(newChange.data)[0];

              for (var i = 0; i < newChange.data[userId].length; i++) {
                for (var key in info) {
                  if (key === 'staticCopy') continue;
                  var ticket = Utils.findById(info[key].tickets, newChange.data[userId][i]);
                  if (ticket) {
                    Utils.defineReadOnlyProperty(ticket, 'lockedBy', userId);
                  }
                }
              }
              setLockTypeForCompanies(info);
              if (callback) {
                callback(info);
              }
            } else if (newChange.action == 'TICKET_UNLOCKED') {

              for (key in info) {
                if (key === 'staticCopy') continue;
                for (var i = 0; i < info[key].tickets.length; i++) {
                  for (var j = 0; j < newChange.data.length; j++) {
                    if (info[key].tickets[i].id === newChange.data[j]) {
                      Utils.defineReadOnlyProperty(info[key].tickets[i], 'lockedBy', null);

                    }
                  }
                }
              }

              setLockTypeForCompanies(info);
              if (callback) {
                callback(info);
              }
            }


          });

          if (callback) {
            callback(info);
          }
        });

        return info;
      }

      function saveBillableDiscount(dataWithDiscount, callback) {
        var sentDiscount = $http({
          url: '/billable/changeDiscount',
          method: 'POST',
          data: dataWithDiscount
        });

        Utils.handleCallback(sentDiscount, callback);
      }

      function updateInvoiceData(data, lockId, callback) {
        var data = {
          "invoiceNumber": data.invoiceNumber || null, // null is allowed
          "dueDate": data.dueDate || null, // null is allowed
          "regularInvoiceNote": data.regularInvoiceNote || null,
          "taxId": data.taxId || null
        }

        var request = $http({
          url: '/invoice/partialUpdate/' + lockId,
          method: 'POST',
          data: data
        });

        if (callback) {
          Utils.handleCallback(request, callback);
        }
      }

      function createInvoice(lockId, isSend, contact, address, callback) {
        if (!lockId) {
          throw 'lockId is required!'
        }
        if (!contact) {
          throw 'contact is required!'
        }
        if (!address) {
          throw 'address is required!'
        }
        var future = $http.get('/invoice/create/' + lockId + '?isSendNotification=' + isSend + '&billTo=' + contact + '&shipTo=' + address);
        Utils.handleCallback(future, callback);

      }

      function getInvoiceData(callback) {
        $http.get('/invoice/invoiceNote/getAll').then(function(res) {
          if (callback) {
            callback(res);
          }
        })
      }

      function deleteFromOrderTicket(ticketId, updateId, callback) {
        $http.delete('/' + ticketId + '/updates/' + updateId  +  '/deleteExpenses?fromOrderTicket=true')
          .then(function(res) {
            if (callback) callback(res);
          })
      }

      function createNote(data, callback) {
        var request = $http({
          url: '/invoice/createInvoiceNote?createRegular=' + (data.noteType === "REGULAR"),
          method: 'POST',
          data: [data]
        });

        if (callback) {
          Utils.handleCallback(request, callback);
        }
      }

      function updateNote(data, id, callback) {
        var request = $http({
          url: '/invoice/updateInvoiceNote/' + id,
          method: 'POST',
          data: data
        });

        if (callback) {
          Utils.handleCallback(request, callback);
        }
      }

      function getExistTimeByLockId(lockId, callback) {

        if (!lockId) {
          throw 'lockId is required!'
        }
        var future = $http.get('/invoice/lock/timeToUnlock/' + lockId);
        Utils.handleCallback(future, callback);
      }

      function getLockedTicketIds(scope, callback) {
      }

      function lockTicketIds(ticketIds, callback) {

        if (!ticketIds) {
          throw 'ticketIds is required!'
        }

        var result = Utils.customizeObj({});

        $http({
          url: '/invoice/lock',
          method: 'POST',
          data: ticketIds
        }).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          if (callback) {
            callback(resp.data);
          }
        }, function (response) {

          if (callback) {
            callback(response.data);
          }
        });

        return result;
      }

      function lockTicketsByCompany(companyId, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        var future = $http.get('/invoice/lock/lockByCompany/' + companyId);
        Utils.handleCallback(future, callback);
      }

      function unlockTicketIds(lockId, callback) {

        if (!lockId) {
          throw 'lockId is required!'
        }

        var future = $http.get('/invoice/unlock/' + lockId);

        Utils.handleCallback(future, callback)
      }

      function getActualInvoiceNumber(scope, callback) {
        $http.get('/data/actualNumber?type=INVOICE').success(function (ticketNumber) {
          callback(ticketNumber.number);
        });

        RealTimeService.subscribe('/number/INVOICE', scope, function (change) {
          if (change.action === 'NUMBER_CHANGED') {
            callback(Utils.getFormattedNumber(change.data, false));
          }
        });
      }

      return {
        createInvoice: createInvoice,
        updateInvoiceData: updateInvoiceData,
        getInvoiceData: getInvoiceData,
        createNote: createNote,
        updateNote: updateNote,
        getActualInvoiceNumber: getActualInvoiceNumber,
        getLockedTicketIds: getLockedTicketIds,
        lockTicketIds: lockTicketIds,
        unlockTicketIds: unlockTicketIds,
        getExistTimeByLockId: getExistTimeByLockId,
        lockTicketsByCompany: lockTicketsByCompany,
        getBillablePageDto: getBillablePageDto,
        saveBillableDiscount: saveBillableDiscount,
        deleteFromOrderTicket: deleteFromOrderTicket
      }

    }]);

})(window, jQuery);
