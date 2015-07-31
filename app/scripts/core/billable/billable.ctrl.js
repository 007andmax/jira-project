'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService',
      function ($scope, BillableService) {

        $scope.ticketsSelection = {};

        $scope.totalBilledAmount = BillableService.getTotalBilledAmount($scope);

        $scope.billableChartData = BillableService.getBillableChartData($scope, function () {
          $scope.$watch('billableChartData', function () {
            $scope.billedAmountLast30Days = 0;
            for (var i = 0; i < $scope.billableChartData.length; i++) {
              $scope.billedAmountLast30Days += $scope.billableChartData[i].sum;
            }
          });
        });

        $scope.billableCompanies = BillableService.getBillableCompanies($scope, function () {
          $scope.$watch('billableCompanies', function () {
            $scope.totalbillables = 0;
            $scope.billedCompanyTicketCount = 0;
            for (var i = 0; i < $scope.billableCompanies.length; i++) {
              $scope.totalbillables += $scope.billableCompanies[i].total;
              $scope.billedCompanyTicketCount += $scope.billableCompanies[i].ticketsCount;
            }
          })
        });

        $scope.changeCompanyCheckbox = function (conpanyId) {

          $scope.companyBillableTickets = BillableService.getCompanyBillableTickets(conpanyId, $scope, function () {

            $scope.ticketsSelection[conpanyId].tickets = {}
            if ($scope.ticketsSelection[conpanyId].checked) {
              for (var i = 0; i < $scope.companyBillableTickets.length; i++) {
                $scope.ticketsSelection[conpanyId].tickets[$scope.companyBillableTickets[i].id] = true;
              }
            } else {
              for (var i = 0; i < $scope.companyBillableTickets.length; i++) {
                $scope.ticketsSelection[conpanyId].tickets[$scope.companyBillableTickets[i].id] = false;
              }
            }
          });
        };

        $scope.changeTicketCheckbox = function (billabledCompany) {

          var countObj = 0;

          for (var elem in ($scope.ticketsSelection[billabledCompany.company.id].tickets)) {
            if ($scope.ticketsSelection[billabledCompany.company.id].tickets[elem]) {
              countObj++
            }
          }

          $scope.ticketsSelection[billabledCompany.company.id].checked = (billabledCompany.ticketsCount === countObj);
        };

        $scope.createInvoice = function () {
          console.log('create invoice');
        };

      }]);

}());
