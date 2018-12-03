'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.billingDashboardCtrl',
    ['$scope', '$timeout', 'CompaniesService', '$filter', '$state',
      function ($scope, $timeout, CompaniesService, $filter, $state) {
        $scope.chartTooltips = {
          totalSales: 'Shows an amount of money that has already been received from invoices\n during a selected period (includes taxes).',
          totalReceivables: 'Shows an amount of money that has been sent to clients as invoices\n and are waiting to be received during a selected period (includes taxes).',
          invoiceable: 'Shows an amount of money in closed tickets\n that have not been sent as invoices to clients yet\n during a selected period.',
          totalOverdue: 'Shows an amount of money in outstanding invoices.'
        };

        $scope.frequency = 'WEEKLY';
        $scope.selectedChart = 'totalSales';
        $scope.dateFormat = '%d %b';


        CompaniesService.getReferenceDate(function(val) {
          $scope.referenceDate = $filter('date')(new Date(val.data.accountingStartDate), 'dd MMM yyyy');
        })

        $scope.openSettings = function() {
          $scope.stateGo(null, 'settings.tickets')
        }

        $scope.stateGo = function (event, state, stateParams, isTag) {
          if (isTag) {
            $scope.isOnHoldTag = true;
          } else {
            $scope.isOnHoldTag = false;
          }
          if (event && event.button > 0) {
            var url = $state.href(state, stateParams, {absolute: true});
            window.open(url, '_blank');
          } else {
            $state.go(state, stateParams);
          }

        };

        $scope.handleDashboardData = function (data) {
          $scope.dashboard = {
            totalSales: data.totalSales,
            totalBillable: data.totalBillable,
            totalReceivable: data.totalReceivable,
            totalOverDue: data.totalOverDue,
            totalReceivableUnpaid: data.totalReceivableUnpaid
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
            case 'totalSales':
              return 'Total sales';
            case 'totalBillable':
              return 'Unbilled tickets';
            case 'totalReceivable':
              return 'Total received payments';
            case 'totalReceivableUnpaid':
              return 'Total receivables'
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
