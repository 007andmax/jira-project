'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.ticketsDashboardCtrl',
    ['$scope', '$filter', 'StatisticsService', 'CompaniesService', 'UsersService',
      function ($scope, $filter, StatisticsService, CompaniesService, UsersService) {
        var lastRange = [];
        $scope.dateRange = [new Date()];
        $scope.shownDateRange = $filter('date')($scope.dateRange[0], 'dd MMM yyyy');
        $scope.dashboard = {};
        $scope.allDashboards = [];
        $scope.ticketsPriorityLegend = ['low', 'medium', 'high'];

        getStatistic();

        $scope.getStatistic = getStatistic;
        $scope.getCompanyById = CompaniesService.getOneById;
        $scope.getUserById = UsersService.getOneById;
        $scope.getPrimaryContact = function (companyId) {
          UsersService.getAllByCompanyId(companyId).find(function (user) {
            return user.isContact;
          });
        };

        $scope.onDateRangeChange = function (dates) {
          if (dates.length > 0) {
            $scope.dateRange = angular.copy(dates) || [];
            $scope.shownDateRange = $scope.dateRange.map(function (date) {
              return $filter('date')(date, 'dd MMM yyyy')
            }).join(' - ');
          }
        };

        $scope.getAverageTimePerTicket = function (time) {
          var hours = Math.floor(time) || 0,
            minutes = Math.floor((time - hours) * 60) || 0;

          return hours + 'h ' + (minutes ? minutes + 'm' : '');
        };

        function isRestrictionChanged(range) {
          if (!lastRange) {
            return true;
          }

          if (lastRange.length === range.length) {
            if (range.length === 1) {
              return lastRange[0].getTime() !== range[0].getTime();
            }

            return lastRange[0].getTime() !== range[0].getTime() || lastRange[1].getTime() !== range[1].getTime();
          }

          return true;
        }

        function getStatistic() {
          if ($scope.dateRange.length > 0 && isRestrictionChanged($scope.dateRange)) {
            lastRange = angular.copy($scope.dateRange);
            StatisticsService.getTicketsDashboard(lastRange[0], lastRange[1], function (resp) {
              $scope.allDashboards = resp;
              $scope.dashboard = resp[resp.length - 1];

              if ($scope.dashboard) {
                $scope.ticketsPriority = [{
                  count: $scope.dashboard.lowPriority
                }, {
                  count: $scope.dashboard.mediumPriority
                }, {
                  count: $scope.dashboard.highPriority
                }];
              } else {
                $scope.dashboard = {};
                $scope.ticketsPriority = [];
              }

              $scope.dashboard.averageResponseTime = 0;

              $scope.ticketCreationTimeline = resp.map(function (dashboard) {
                return { date: new Date(dashboard.date), total: dashboard.newTickets };
              });
              $scope.ticketCreationTimelineTicks = $scope.ticketCreationTimeline.map(function (item) {
                return item.date;
              });

              $scope.averageTicketsResponseTimeMap = resp.map(function (dashboard) {
                var responseMinutes = Math.round(dashboard.averageTicketsResponseTime / 60);
                $scope.dashboard.averageResponseTime += responseMinutes;
                return { date: new Date(dashboard.date), total: responseMinutes };
              });
              $scope.averageTicketsResponseTimeTicks = $scope.averageTicketsResponseTimeMap.map(function (item) {
                return item.date;
              });

              if (resp.length) {
                $scope.dashboard.averageResponseTime = Math.round($scope.dashboard.averageResponseTime / resp.length) || 0;
              }
            })
          }
        }

      }]);

}());
