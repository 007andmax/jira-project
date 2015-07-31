'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyCtrl',
    ['$scope', 'BillableService', 'CompaniesService',
      function ($scope, BillableService, CompaniesService) {

        $scope.toggleInvoices = function () {
          $scope.companyBillableTickets = BillableService.getCompanyBillableTickets($scope.billableCompany.company.id, $scope, function () {
            $scope.$emit('toggleBillableInvoices');
          });
        };

        $scope.company = CompaniesService.getOneById($scope.billableCompany.company.id);

      }]);

}());
