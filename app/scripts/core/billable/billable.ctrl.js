'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService',
      function ($scope, BillableService) {

        $scope.totalBilledAmount = BillableService.getTotalBilledAmount($scope);

        $scope.billableChartData = BillableService.getBillableChartData($scope, function () {
          $scope.billedAmountLast30Days = 0;
          for (var i = 0; i < $scope.billableChartData.length; i++) {
            $scope.billedAmountLast30Days += $scope.billableChartData[i].sum;
          }
        });

        $scope.billableCompanies = BillableService.getBillableCompanies($scope, function () {
          $scope.totalbillables = 0;
          $scope.billedCompanyTicketCount = 0;
          for (var i = 0; i < $scope.billableCompanies.length; i++) {
            $scope.totalbillables += $scope.billableCompanies[i].total;
            $scope.billedCompanyTicketCount += $scope.billableCompanies[i].ticketsCount
          }
        });

        $scope.allTicketCheckbox = [];

        $scope.$on('ticketCheckbox', function (e, data) {

          for (var i = 0; i < data.length; i++) {
            if ($scope.allTicketCheckbox.length !== $scope.billedCompanyTicketCount) {
              $scope.allTicketCheckbox.push(data[i]);
            } else {
              for (var j = 0; j < $scope.allTicketCheckbox.length; j++) {
                if (data[i].id === $scope.allTicketCheckbox[j].id) {
                  $scope.allTicketCheckbox[j] = data[i];
                }
              }
            }
          }

        });

        $scope.createInvoice = function () {
          console.log('create invoice');
          console.log($scope.allTicketCheckbox);
        };

      }]);

}());
