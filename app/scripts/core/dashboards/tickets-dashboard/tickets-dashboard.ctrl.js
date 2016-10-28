'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.ticketsDashboardCtrl',
    ['$scope', '$filter', 'StatisticsService', 'CompaniesService', 'UsersService', '$timeout',
      function ($scope, $filter, StatisticsService, CompaniesService, UsersService, $timeout) {
        var lastRange;
        $scope.loading = false;
        $scope.dateRange = [];
        $scope.shownDateRange = '';
        $scope.dashboard = {};
        $scope.startDashboard = {};
        $scope.allDashboards = [];
        $scope.ticketsPriorityLegend = ['low', 'medium', 'high'];

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

              $scope.ticketCreationTimeline = getDataForChart($scope.allDashboards, 'newTickets');
              $scope.ticketCreationTimelineTicks = $scope.ticketCreationTimeline.map(function (item) {
                return item.date;
              });

              $scope.averageTicketsResponseTimeMap = getDataForChart($scope.allDashboards, 'sumTicketsResponseTime', function (value, item, byDay) {
                return byDay ? Math.round(value / (item.countOfTicketsForResponseTime || 1) / 60) : Math.round(value / 60);
              }, function (counter, item) {
                return counter + item.countOfTicketsForResponseTime;
              });
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

              $scope.openTicketsData = getDataForChart($scope.allDashboards, 'openTickets');
              $scope.openTicketsTicks = $scope.openTicketsData.map(function (item) {
                return item.date;
              });

              $scope.averageServiceTimeData = getDataForChart($scope.allDashboards, 'averageTimePerDay', function (value) {
                return value * 60;
              });
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

        function getDataForChart(data, property, transformer, counterTransformer, isLastValue) {
          var result = [], lastMonth, lastYear,
            groupedForMonth = 0,
            groupedForYear = 0,
            counter = 0;

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
                  result.push({ date: currentDate, total: parseFloat((groupedForYear / counter).toFixed(2)) });
                }
                lastYear = undefined;
                counter = 0;
                groupedForYear = 0;
              }

              groupedForYear += transformer ? transformer(item[property], item) : item[property];
              counter = counterTransformer ? counterTransformer(counter, item) : ++counter;

              if (i === data.length - 1) {
                currentDate.setDate(1);
                currentDate.setMonth(0);
                currentDate.setFullYear(lastYear);
                if (isLastValue) {
                  result.push({ date: currentDate, total: item[property] });
                } else {
                  result.push({ date: currentDate, total: parseFloat((groupedForYear / counter).toFixed(2)) });
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
                  result.push({ date: currentDate, total: parseFloat((groupedForMonth / counter).toFixed(2)) });
                }
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }

              groupedForMonth += transformer ? transformer(item[property], item) : item[property];
              counter = counterTransformer ? counterTransformer(counter, item) : ++counter;

              if (i === data.length - 1) {
                currentDate.setDate(1);
                currentDate.setMonth(lastMonth);
                if (isLastValue) {
                  result.push({ date: currentDate, total: data[i][property] });
                } else {
                  result.push({ date: currentDate, total: parseFloat((groupedForMonth / counter).toFixed(2)) });
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
