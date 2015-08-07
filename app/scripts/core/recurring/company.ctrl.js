'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.companyCtrl',
    ['$scope', 'CompaniesService', 'RecurringService', '$timeout',
      function ($scope, CompaniesService, RecurringService, $timeout) {


        $scope.toggleRecurringInvoices = function () {

          if ($scope.showInvoices) {
            $scope.$broadcast('toggleRecurringInvoices');

            $timeout(function () {
              $scope.showInvoices = false;
            }, 200);
          } else {
            $scope.showInvoices = true;
          }
        };

        $scope.company = CompaniesService.getOneById($scope.recurringCompany.company.id);

        $scope.$on('cancelCreateInvoiceForm', function () {
          $scope.showCreateInvoiceForm = false;
        });

        $scope.showCreateRecurringInvoiceForm = function () {
          $scope.showCreateInvoiceForm = true;
        };

        $scope.deleteAllRecurringInvoice = function () {
          RecurringService.deleteAllRecurringInvoicesByCompany($scope.company.id);
        };

      }]);

}());
