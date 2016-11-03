'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.ticketsDashboardCtrl',
    ['$scope', '$filter', 'StatisticsService', 'CompaniesService', 'UsersService', '$timeout',
      function ($scope, $filter, StatisticsService, CompaniesService, UsersService, $timeout) {
        var lastRange;
        $scope.loading = false;
        $scope.dateRange = [];
        $scope.maxDate = Date.now();
        $scope.shownDateRange = '';
        $scope.dashboard = {};
        $scope.startDashboard = {};
        $scope.allDashboards = [];
        $scope.ticketsPriorityLegend = ['low', 'medium', 'high'];

        $scope.chartTooltips = {
          totalTickets: 'Total number of tickets for a selected period\n (don’t include spam and trash).',
          openTickets: 'Number of open tickets\n during a selected period.',
          closedTickets: 'How many tickets were closed\n during a selected period.',
          averageServiceTime: 'Average service time (minutes)\n spent per ticket\n during a selected period.',
          averageSales: 'Average product price sold per ticket\n during a selected period.',
          priority: 'Number of tickets by priority\n during a selected period.',
          topClients: 'Top-10 clients sorted by amount of created tickets.',
          topCompanies: 'Top-10 companies sorted by amount of created tickets.',
          topTech: 'Top-10 tech-users sorted by amount of closed tickets.',
          createdTickets: 'Line chart shows how many new tickets were created\n during a selected period.',
          responseTime: 'Line chart shows average response time (minutes) per ticket \nduring a selected period. Response time is time between \ncreating a ticket and claiming a ticket.\n Outliers - tickets with response time more than 24 hours.'
        };

        getStatistic();

        $scope.getStatistic = getStatistic;
        $scope.getCompanyById = CompaniesService.getOneById;
        $scope.getUserById = UsersService.getOneById;
        $scope.getPrimaryContact = function (companyId) {
          return UsersService.getAllByCompanyId(companyId).find(function (user) {
            return user.isContact;
          });
        };

        $scope.onDateRangeChange = function (dates) {
          if (dates.length > 0) {
            $scope.dateRange = angular.copy(dates);
            $scope.shownDateRange = $scope.dateRange.map(function (date) {
              return $filter('date')(date, 'dd MMM yyyy')
            }).join(' - ');
          } else {
            $scope.dateRange = [];
            $scope.shownDateRange = '';
          }
        };

        $scope.getAverageTimePerDay = function (time) {
          var hours = Math.floor(time) || 0,
            minutes = Math.floor((time - hours) * 60) || 0;

          return hours + 'h ' + (minutes ? minutes + 'm' : '');
        };

        $scope.clearDateRangeAndReload = function (event) {
          event.stopPropagation();
          $scope.clearDateRange();
          $timeout(function () { getStatistic(); });
        };

        function isRestrictionChanged(range) {
          if (!lastRange) {
            return true;
          }

          if (lastRange.length === range.length) {
            if (range.length === 0) {
              return false;
            } else if (range.length === 1) {
              return lastRange[0].getTime() !== range[0].getTime();
            }

            return lastRange[0].getTime() !== range[0].getTime() || lastRange[1].getTime() !== range[1].getTime();
          }

          return true;
        }

        function getStatistic() {
          if (isRestrictionChanged($scope.dateRange)) {
            lastRange = angular.copy($scope.dateRange);
            $scope.loading = true;
            StatisticsService.getTicketsDashboard(lastRange[0], lastRange[1], function (resp) {
              $scope.allDashboards = angular.copy(resp);
              if ($scope.allDashboards.length > 1) {
                $scope.startDashboard = $scope.allDashboards.shift();
              } else {
                $scope.startDashboard = undefined;
              }
              $scope.dashboard = $scope.allDashboards[$scope.allDashboards.length - 1];

              $scope.closedTickets = $scope.allDashboards.reduce(function (sum, dashboard) {
                return sum + dashboard.closedTickets;
              }, 0);
              $scope.ticketsPriority = [];

              var low = 0, medium = 0, high = 0;
              if ($scope.dashboard) {
                low = $scope.dashboard.lowPriority;
                medium = $scope.dashboard.mediumPriority;
                high = $scope.dashboard.highPriority;

                $scope.ticketsPriority.push({ count: low });
                $scope.ticketsPriority.push({ count: medium });
                $scope.ticketsPriority.push({ count: high });
              } else {
                $scope.dashboard = {};
                $scope.startDashboard = {};
                $scope.ticketsPriority = [];
              }

              if (!low && !medium && !high) {
                $scope.dashboard.noPriorities = true;
              }

              if ($scope.allDashboards.length > 366) {
                $scope.dateFormat = '%Y';
              } else if ($scope.allDashboards.length > 31) {
                $scope.dateFormat = '%b %Y';
              } else if ($scope.allDashboards.length > 20) {
                $scope.dateFormat = '%d/%m';
              } else {
                $scope.dateFormat = '%d %b';
              }

              $scope.ticketCreationTimeline = getDataForChart($scope.allDashboards, 'newTickets', null, null, null, 0);
              $scope.ticketCreationTimelineTicks = $scope.ticketCreationTimeline.map(function (item) {
                return item.date;
              });

              $scope.averageTicketsResponseTimeMap = getDataForChart($scope.allDashboards, 'sumTicketsResponseTime', function (value, item, byDay) {
                return byDay ? Math.round(value / (item.countOfTicketsForResponseTime || 1) / 60) : Math.round(value / 60);
              }, function (counter, item) {
                return counter + item.countOfTicketsForResponseTime;
              }, null, 0);
              $scope.averageTicketsResponseTimeTicks = $scope.averageTicketsResponseTimeMap.map(function (item) {
                return item.date;
              });

              $scope.dashboard.averageResponseTime = 0;
              $scope.numberOutliersTicketsResponseTime = 0;
              var sumTicketsResponseTime = 0,
                count = 0;
              if ($scope.allDashboards.length) {
                for (var i = 0; i < $scope.allDashboards.length; i++) {
                  var dashboard = $scope.allDashboards[i];
                  sumTicketsResponseTime += dashboard.sumTicketsResponseTime;
                  count += dashboard.countOfTicketsForResponseTime;
                  $scope.numberOutliersTicketsResponseTime += dashboard.numberOutliersTicketsResponseTime;
                }
                $scope.dashboard.averageResponseTime = Math.round(sumTicketsResponseTime / (count || 1) / 60) || 0;
              }

              $scope.totalTicketsData = getDataForChart($scope.allDashboards, 'totalTickets', null, null, true);
              $scope.totalTicketsTicks = $scope.totalTicketsData.map(function (item) {
                return item.date;
              });

              
              $scope.openTicketsData = getDataForChart($scope.allDashboards, 'openTickets', null, null, null, 0);
              $scope.openTicketsTicks = $scope.openTicketsData.map(function (item) {
                return item.date;
              });

              $scope.averageServiceTimeData = getDataForChart($scope.allDashboards, 'averageTimePerDay', function (value) {
                return parseFloat((value * 60).toFixed(2));
              }, null, null, 0);
              $scope.averageServiceTimeTicks = $scope.averageServiceTimeData.map(function (item) {
                return item.date;
              });

              $scope.averageSalesData = getDataForChart($scope.allDashboards, 'averageSalesPerDay');
              $scope.averageSalesTicks = $scope.averageSalesData.map(function (item) {
                return item.date;
              });

              $scope.loading = false;
            })
          }
        }

        function getDataForChart(data, property, transformer, counterTransformer, isLastValue, fixedCount) {
          var result = [], lastMonth, lastYear,
            groupedForMonth = 0,
            groupedForYear = 0,
            counter = 0;

          if (fixedCount === undefined) {
            fixedCount = 2;
          }

          for (var i = 0; i < data.length; i++) {
            var item = data[i],
              currentDate = new Date(item.date);

            if (data.length > 366) {
              if (!lastYear) {
                lastYear = currentDate.getFullYear();
              }

              if (lastYear !== currentDate.getFullYear()) {
                currentDate.setDate(1);
                currentDate.setMonth(0);
                currentDate.setFullYear(lastYear);
                if (isLastValue) {
                  result.push({ date: currentDate, total: data[i - 1][property] });
                } else {
                  result.push({ date: currentDate, total: parseFloat((groupedForYear / (counter || 1)).toFixed(fixedCount)) });
                }
                lastYear = undefined;
                counter = 0;
                groupedForYear = 0;
              }

              groupedForYear += transformer ? transformer(item[property], item) : item[property];
              counter = counterTransformer ? counterTransformer(counter, item) : ++counter;

              if (i === data.length - 1) {
                currentDate = new Date(item.date);
                currentDate.setDate(1);
                currentDate.setMonth(0);
                if (isLastValue) {
                  result.push({ date: currentDate, total: item[property] });
                } else {
                  result.push({ date: currentDate, total: parseFloat((groupedForYear / (counter || 1)).toFixed(fixedCount)) });
                }
                lastYear = undefined;
                counter = 0;
                groupedForYear = 0;
              }
            } else if (data.length > 31) {
              if (!lastMonth) {
                lastMonth = currentDate.getMonth();
              }

              if (lastMonth !== currentDate.getMonth()) {
                currentDate.setDate(1);
                currentDate.setMonth(lastMonth);
                if (isLastValue) {
                  result.push({ date: currentDate, total: data[i - 1][property] });
                } else {
                  result.push({ date: currentDate, total: parseFloat((groupedForMonth / (counter || 1)).toFixed(fixedCount)) });
                }
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }

              groupedForMonth += transformer ? transformer(item[property], item) : item[property];
              counter = counterTransformer ? counterTransformer(counter, item) : ++counter;

              if (i === data.length - 1) {
                currentDate = new Date(item.date);
                currentDate.setDate(1);
                if (isLastValue) {
                  result.push({ date: currentDate, total: item[property] });
                } else {
                  result.push({ date: currentDate, total: parseFloat((groupedForMonth / (counter || 1)).toFixed(fixedCount)) });
                }
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }
            } else {
              result.push({ date: currentDate, total: transformer ? transformer(item[property], item, true) : item[property] });
            }
          }

          return result;
        }

      }]);

}());
