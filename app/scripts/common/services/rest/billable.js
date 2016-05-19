'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('BillableService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils) {

      function recalculateTotalSumForCompany(company) {
        for (var i = 0; i < company.tickets.length; i++) {
          company.totalSum = company.totalSum + company.tickets[i].sum;
        }
      }

      function calculateTotalSumForAllCompanies(info) {
        for (var key in info) {
          if (key === 'staticCopy') {
            continue;
          }

          for (var i = 0; i < info[key].tickets.length; i++) {

            if (!info[key].totalSum) info[key].totalSum = 0;

            info[key].totalSum = info[key].totalSum + info[key].tickets[i].sum;
          }
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

      function saveRegularOrder(order, callback) {
        if (!order)throw 'order must be!';

        var future = $http({
          url: '/billable/saveRegularOrder',
          method: 'POST',
          data: order
        });

        Utils.handleCallback(future, callback);
      }

      function getBillablePageDto(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        var info = Utils.customizeObj({});

        $http.get('/billable/billablePageInfo').then(function (resp) {

          Utils.customizeObj(resp.data, info);
          calculateTotalSumForAllCompanies(info);
          setLockTypeForCompanies(info);

          RealTimeService.subscribe('/billablePage', scope, function (newChange) {

            console.log(newChange);

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
            //else if (newChange.action == 'COMPANY_ARCHIVED') {
            //    delete info[newChange.data.id];
            //    if (callback) {
            //        callback(info);
            //    }
            //}
          });
          if (callback) {
            callback(info);
          }
        });

        return info;
      }

      function getTotalBilledAmount(scope, callback) {

        var result = Utils.customizeObj({});

        $http.get("/billable/totalBilled").then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/billedTicketsSumAdded', scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'BILLED_TICKETS_SUM_ADDED') {
              Utils.defineReadOnlyProperty(result, "value", result.value + newChange.data);
            }
          });

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

      function getBillableChartData(scope, callback) {
        var resultsList = Utils.customizeArray([]);

        $http.get('/billable/billed/lastDays').then(function (resp) {

          Utils.customizeArray(resp.data, resultsList);

          RealTimeService.subscribe('/billedTicketsSumAdded', scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'BILLED_TICKETS_SUM_ADDED') {
              var lastPoint = resultsList[resultsList.length - 1];
              Utils.defineReadOnlyProperty(lastPoint, "sum", lastPoint.sum + newChange.data);
            }
          });

          if (callback) {
            callback(resultsList);
          }
        }, function (response) {

          if (callback) {
            callback(response.data);
          }
        });

        return resultsList;
      }

      //function getCompanyBillableTickets(companyId, scope, callback) {
      //
      //    if (!companyId) {
      //        throw 'companyId is required!'
      //    }
      //
      //    if (!scope || !scope.$id) {
      //        throw 'Second argument must be Angularjs scope!'
      //    }
      //
      //    var tickets = [];
      //
      //    $http.get('/billable/expenses/' + companyId).then(function (resp) {
      //
      //        Utils.customizeArray(resp.data, tickets);
      //
      //        RealTimeService.subscribe('/billableExpense?targetId=' + companyId, scope, function (newChange) {
      //
      //            console.log(newChange);
      //
      //            if (newChange.action == 'BILLABLE_EXPENSE_ADDED') {
      //
      //                var ticket = Utils.findById(tickets, newChange.data.id);
      //
      //                if (!ticket) {
      //                    ticket = {};
      //                    tickets.push(ticket);
      //                }
      //
      //                Utils.customizeObj(newChange.data, ticket);
      //
      //            } else if (newChange.action == 'BILLABLE_EXPENSE_REMOVED') {
      //
      //                var index = Utils.indexOfId(tickets, newChange.data);
      //
      //                if (index > -1) {
      //                    tickets.splice(index, 1);
      //                }
      //            }
      //        });
      //
      //        if (callback) {
      //            callback(resp.data);
      //        }
      //    }, function (resp) {
      //        if (callback) {
      //            callback(resp.data);
      //        }
      //    });
      //
      //    return tickets;
      //}

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

        RealTimeService.subscribe('/number?targetId=INVOICE', scope, function (change) {
          console.log(change);
          if (change.action === 'NUMBER_CHANGED') {
            callback(Utils.getFormattedNumber(change.data, false));
          }
        });
      }

      function search(keyword) {

        if (!keyword) {
          throw 'Keyword is required!'
        }

        return $http.get("/billable/search?keyword=" + keyword.toLowerCase()).then(function (response) {
          return response.data;
        });

      }

      return {
        getTotalBilledAmount: getTotalBilledAmount,
        getBillableChartData: getBillableChartData,
        createInvoice: createInvoice,
        saveRegularOrder: saveRegularOrder,
        getActualInvoiceNumber: getActualInvoiceNumber,
        search: search,
        getLockedTicketIds: getLockedTicketIds,
        lockTicketIds: lockTicketIds,
        unlockTicketIds: unlockTicketIds,
        getExistTimeByLockId: getExistTimeByLockId,
        lockTicketsByCompany: lockTicketsByCompany,
        getBillablePageDto: getBillablePageDto
      }

    }]);

})(window, jQuery);
