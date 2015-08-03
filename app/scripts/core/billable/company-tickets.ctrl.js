'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyTicketsCtrl',
    ['$scope', 'BillableService',
      function ($scope, BillableService) {

        $scope.companyBillableTickets = BillableService.getCompanyBillableTickets($scope.billableCompany.company.id, $scope, function () {

          $scope.$emit('toggleBillableTickets');

          var companyTicketSelection = $scope.ticketsSelection[$scope.billableCompany.company.id];

          if (companyTicketSelection !== undefined && companyTicketSelection.checked) {
            $scope.ticketsSelection[$scope.billableCompany.company.id].tickets = {};
            setTicketsCheckboxes(true);
          } else if (companyTicketSelection === undefined) {
            $scope.ticketsSelection[$scope.billableCompany.company.id] = {tickets: {}};
            setTicketsCheckboxes(false);
          }

          $scope.totalTicketSum = {};
          for (var i = 0; i < $scope.companyBillableTickets.length; i++) {

            var totalTicketSum = 0;

            for (var j = 0; j < $scope.companyBillableTickets[i].productExpenses.length; j++) {
              totalTicketSum += $scope.companyBillableTickets[i].productExpenses[j].sum;
            }

            for (var j = 0; j < $scope.companyBillableTickets[i].serviceExpenses.length; j++) {
              totalTicketSum += $scope.companyBillableTickets[i].serviceExpenses[j].sum;
            }
            $scope.totalTicketSum[$scope.companyBillableTickets[i].id] = totalTicketSum;
          }

          function setTicketsCheckboxes(val) {

            var companyId = $scope.billableCompany.company.id;

            for (var i = 0; i < $scope.companyBillableTickets.length; i++) {
              var ticketId = $scope.companyBillableTickets[i].id;
              $scope.ticketsSelection[companyId].tickets[ticketId] = val;
            }
          }

        });

      }]);

}());
