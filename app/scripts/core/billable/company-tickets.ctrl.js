'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyTicketsCtrl',
    ['$scope', 'BillableService', 'CompaniesService',
      function ($scope, BillableService, CompaniesService) {

        $scope.companyBillableTickets = BillableService.getCompanyBillableTickets($scope.billableCompany.company.id, $scope, function () {
          $scope.$emit('toggleBillableInvoices');
          //TODO remove quicktech.core.billable.ticketCtrl and calculate tickets sum here. it could be stored in object {'ticket-id': 132}
        });

      }]);

}());
