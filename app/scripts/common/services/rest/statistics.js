'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('StatisticsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService', 'UsersService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService, UsersService) {

      function getResolvedTicketsCountByCompany(companyId, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/tickets/resolvedCount/' + companyId).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/resolvedTicketsCount?targetId=' + companyId, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'RESOLVED_TICKETS_COUNT') {
              Utils.defineReadOnlyProperty(result, 'value', newChange.data);
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

      function getTicketsResolutionTimeChartDataByCompany(companyId, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/tickets/resolutionTime/' + companyId).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/ticketsResolutionTimeChart?targetId=' + companyId, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'TICKETS_RESOLUTION_TIME_CHART') {
              Utils.customizeObj(newChange.data, result);
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

      function getTimeBilledByCompany(companyId, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/billed/time/' + companyId).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/billedTimeStatistic?targetId=' + companyId, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'BILLED_TIME_STATISTIC') {
              Utils.defineReadOnlyProperty(result, 'value', newChange.data);
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

      function getReceivableAmountByCompany(companyId, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/companies/receivable/' + companyId).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/todayReceivableChartPoint?targetId=' + companyId, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'TODAY_RECEIVABLE_CHART_POINT') {
              Utils.defineReadOnlyProperty(result, 'value', newChange.data.receivableLeft);
            }
            if (callback) {
              callback(result);
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

      function getContributedToEarningTopCompanies(topAmount, scope, callback) {

        if (!topAmount) {
          throw 'topAmount is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/companies/paymentSum/top/' + topAmount).then(function (resp) {

          function realTimeCompanyResults(companyId) {
            RealTimeService.subscribe('/companyPaymentReceived?targetId=' + companyId, scope, function (newChange) {

              console.log(newChange);

              if (newChange.action === 'COMPANY_PAYMENT_RECEIVED') {
                var currentVal = result[companyId] ? result[companyId] : 0;
                Utils.defineReadOnlyProperty(result, companyId, currentVal + newChange.data);
              }
            });
          }

          for (var companyId in resp.data) {
            realTimeCompanyResults(companyId);
          }

          //TODO handle company archived
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

      function getTopCompaniesByResolvedTickets(topAmount, scope, callback) {

        if (!topAmount) {
          throw 'topAmount is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Second argument must be Angularjs scope!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/companies/resolvedTicket/top/' + topAmount).then(function (resp) {

          function realTimeCompanyResults(companyId) {
            RealTimeService.subscribe('/resolvedTicketsCount?targetId=' + companyId, scope, function (newChange) {

              console.log(newChange);

              if (newChange.action === 'RESOLVED_TICKETS_COUNT') {
                Utils.defineReadOnlyProperty(result, companyId, newChange.data);
              }
            });
          }

          for (var companyId in resp.data) {
            realTimeCompanyResults(companyId);
          }

          //TODO handle company archived
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

      function getTotalEarningsByDays(companyId, from, to, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!from) {
          throw 'from date is required!'
        }

        if (!to) {
          throw 'to date is required!'
        }

        if (from.getTime() > to.getTime()) {
          throw 'from date should be less that to date!'
        }

        if (!scope || !scope.$id) {
          throw 'Angularjs scope is required!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/companies/paymentSum/receivedInterval/' + companyId
          + '?from=' + Utils.formatDate(from) + '&to=' + Utils.formatDate(to)).then(function (resp) {

          var latestDayStr;

          for (var day in resp.data) {
            if (!latestDayStr) {
              latestDayStr = day;
            } else if (new Date(day).getTime() > new Date(latestDayStr).getTime()) {
              latestDayStr = day;
            }
          }

          var latestDay = new Date(latestDayStr);

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/companyPaymentReceived?targetId=' + companyId, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'COMPANY_PAYMENT_RECEIVED') {
              var currentDate = new Date();

              if (latestDay.getFullYear() === currentDate.getFullYear()
                && latestDay.getMonth() === currentDate.getMonth()
                && latestDay.getDate() === currentDate.getDate()) {
                Utils.defineReadOnlyProperty(result, latestDayStr, result[latestDayStr] + newChange.data);
              }
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

      function getTotalReceivableByDays(companyId, from, to, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!from) {
          throw 'from date is required!'
        }

        if (!to) {
          throw 'to date is required!'
        }

        if (from.getTime() > to.getTime()) {
          throw 'from date should be less that to date!'
        }

        if (!scope || !scope.$id) {
          throw 'Angularjs scope is required!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/companies/receivable/totalInterval/' + companyId + '?from=' + Utils.formatDate(from) + '&to=' + Utils.formatDate(to))
          .then(function (resp) {

            var latestDayStr;

            for (var day in resp.data) {
              if (!latestDayStr) {
                latestDayStr = day;
              } else if (new Date(day).getTime() > new Date(latestDayStr).getTime()) {
                latestDayStr = day;
              }
            }

            Utils.customizeObj(resp.data, result);

            if (itCurrentDay(new Date(latestDayStr))) {
              RealTimeService.subscribe('/todayReceivableChartPoint?targetId=' + companyId, scope, function (newChange) {

                console.log(newChange);

                if (newChange.action === 'TODAY_RECEIVABLE_CHART_POINT') {
                  if (itCurrentDay(new Date(newChange.data.date))) {
                    Utils.defineReadOnlyProperty(result, latestDayStr, newChange.data.total);
                  }
                }
              });
            }
            if (callback) {
              callback(resp.data);
            }

            function itCurrentDay(date) {
              var currentDate = new Date();

              if (date.getFullYear() === currentDate.getFullYear()
                && date.getMonth() === currentDate.getMonth()
                && date.getDate() === currentDate.getDate()) {
                return true;
              }
            }

          }, function (response) {

            if (callback) {
              callback(response.data);
            }
          });

        return result;
      }

      function getTicketsClosedByDays(companyId, from, to, scope, callback) {

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!from) {
          throw 'from date is required!'
        }

        if (!to) {
          throw 'to date is required!'
        }

        if (from.getTime() > to.getTime()) {
          throw 'from date should be less that to date!'
        }

        if (!scope || !scope.$id) {
          throw 'Angularjs scope is required!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/companies/resolvedTicket/interval/' + companyId
          + '?from=' + Utils.formatDate(from) + '&to=' + Utils.formatDate(to)).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/ticketResolution?targetId=' + companyId, scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'TICKET_RESOLVED') {
              var day = getDay(newChange.data);

              if (day) {
                Utils.defineReadOnlyProperty(result, day, result[day] + 1);
              }
            } else if (newChange.action === 'TICKET_REOPENED') {
              var day = getDay(newChange.data);

              if (day) {
                Utils.defineReadOnlyProperty(result, day, result[day] - 1);
              }
            }
            if (callback) {
              callback();
            }
          });

          function getDay(data) {

            var ticketId;

            for (var key in data) {
              if (key != 'staticCopy') {
                ticketId = key;
                break;
              }
            }

            if (!ticketId) {
              return;
            }

            var date = new Date(data[ticketId])

            for (var day in result) {

              if (day === 'staticCopy') {
                continue;
              }

              var dayDate = new Date(day);

              if (dayDate.getFullYear() === date.getFullYear()
                && dayDate.getMonth() === date.getMonth()
                && dayDate.getDate() === date.getDate()) {
                return day;
              }
            }

          }

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

      function getSubmittedTicketsByCompany(companyId, scope, callback) {
        console.warn('Deprecated! Use companyStatistic field in company object.');
        var result = {};
        if (CompaniesService.getCurrentCompany() === companyId) {
          var clientUsers = UsersService.getClientUsers;
          for (var i in clientUsers) {
            var userStatistic = clientUsers[i].userStatistic || { ticketsSubmitted: 0 };
            if (result[clientUsers[i].company.id]) {
              result[clientUsers[i].company.id] += userStatistic.ticketsSubmitted || 0;
            } else {
              result[clientUsers[i].company.id] = userStatistic.ticketsSubmitted || 0;
            }
          }
        } else {
          clientUsers = UsersService.getAllByCompanyId(companyId);
          result[companyId] = 0;
          for (i in clientUsers) {
            userStatistic = clientUsers[i].userStatistic || { ticketsSubmitted: 0 };
            result[companyId] += userStatistic.ticketsSubmitted || 0;
          }
        }

        result = Utils.customizeObj(result);

        if (callback) {
          callback(result);
        }

        RealTimeService.subscribe('/userSubmittedTicket', scope, function (newChange) {
          if (newChange.action === 'USER_SUBMITTED_TICKET') {
            var user = UsersService.getOneById(newChange.data);
            if (result[user.company.id]) {
              var prevValue = result[user.company.id];
              Utils.defineReadOnlyProperty(result, [user.company.id], prevValue + 1);
            }
            if (callback) {
              callback(result);
            }
          }
        });
      }

      function getUserSubmittedTicketsByCompany(companyId, scope, callback) {
        console.warn('Deprecated! Use getSubmittedTicketsByCompany()');
        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!scope || !scope.$id) {
          throw 'Angularjs scope is required!'
        }

        var result = Utils.customizeObj({});

        $http.get('/statistic/tickets/submittedTickets/' + companyId).then(function (resp) {

          Utils.customizeObj(resp.data, result);

          RealTimeService.subscribe('/userSubmittedTicket', scope, function (newChange) {

            console.log(newChange);

            if (newChange.action === 'USER_SUBMITTED_TICKET') {
              var prevValue = result[newChange.data] || 0;
              Utils.defineReadOnlyProperty(result, newChange.data, prevValue + 1)
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

      return {
        getResolvedTicketsCountByCompany: getResolvedTicketsCountByCompany,
        getSubmittedTicketsByCompany: getSubmittedTicketsByCompany,
        getTicketsResolutionTimeChartDataByCompany: getTicketsResolutionTimeChartDataByCompany,
        getTimeBilledByCompany: getTimeBilledByCompany,
        getReceivableAmountByCompany: getReceivableAmountByCompany,
        getContributedToEarningTopCompanies: getContributedToEarningTopCompanies,
        getTopCompaniesByResolvedTickets: getTopCompaniesByResolvedTickets,
        getTotalEarningsByDays: getTotalEarningsByDays,
        getTotalReceivableByDays: getTotalReceivableByDays,
        getTicketsClosedByDays: getTicketsClosedByDays,
        getUserSubmittedTicketsByCompany: getUserSubmittedTicketsByCompany
      }
    }

  ])
  ;

})(window, jQuery);
