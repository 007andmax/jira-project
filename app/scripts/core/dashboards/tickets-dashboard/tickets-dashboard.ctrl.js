'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.ticketsDashboardCtrl',
    ['$scope', '$timeout', function ($scope, $timeout) {
      $scope.chartTooltips = {
        totalTickets: 'Total number of tickets for a selected period\n (don’t include spam and trash).',
        openTickets: 'Number of open tickets\n during a selected period.'
      };

      $scope.frequency = 'WEEKLY';
      $scope.selectedChart = 'totalTickets';
      $scope.dateFormat = '%d %b';

      $scope.handleDashboardData = function (data) {
        $scope.dashboard = {
          totalTickets: data.totalTickets,
          openTickets: data.openTickets,
          onHoldTickets: data.onHoldTickets
        };
        return data.chartData;
      };

      $scope.parseDate = function (values) {
        return values.map(function (obj) {
          return new Date(obj.date);
        })
      };

      $scope.selectChart = function (type) {
        $scope.selectedChart = type;
        $scope.reloading = true;
        $timeout(function () {
          $scope.reloading = false;
        });
      };

      $scope.getChartTitle = function () {
        switch ($scope.selectedChart) {
          case 'totalTickets':
            return 'Total tickets';
          case 'openTickets':
            return 'Open tickets';
          case 'onHoldTickets':
            return 'Tickets on hold';
        }
      };

      $scope.setFrequency = function (newFrequency) {
        $scope.frequency = newFrequency;

        if (newFrequency === 'MONTHLY') {
          $scope.dateFormat = '%b';
        } else {
          $scope.dateFormat = '%d %b';
        }
      };

    }]);

}());
