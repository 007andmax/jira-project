'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.ticketCtrl',
    ['$scope',
      function ($scope) {


        $scope.$watch('companyBillableTickets', function () {
          $scope.totalTicketSum = 0;
          for (var i = 0; i < $scope.ticket.productExpenses.length; i++) {
            $scope.totalTicketSum += $scope.ticket.productExpenses[i].sum;
          }
          for (var i = 0; i < $scope.ticket.serviceExpenses.length; i++) {
            $scope.totalTicketSum += $scope.ticket.serviceExpenses[i].sum;
          }
        });

      }]);

}());
