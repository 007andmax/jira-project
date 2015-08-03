'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyCtrl',
    ['$scope', 'BillableService', 'CompaniesService', '$timeout',
      function ($scope, BillableService, CompaniesService, $timeout) {

        $scope.toggleBillableTickets = function () {

          if ($scope.showTickets) {
            $scope.$broadcast('toggleBillableTickets');

            $timeout(function () {
              $scope.showTickets = false;
            }, 200);
          } else {
            $scope.showTickets = true;
          }
        };

        $scope.company = CompaniesService.getOneById($scope.billableCompany.company.id);

      }]);

}());
