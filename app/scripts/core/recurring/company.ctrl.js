'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.companyCtrl',
    ['$scope', 'CompaniesService', 'RecurringService',
      function ($scope, CompaniesService, RecurringService) {


        $scope.toggleInvoices = function () {
          $scope.$emit('toggleReceivableInvoices');
        };

        $scope.company = CompaniesService.getOneById($scope.recurringCompany.company.id);

        $scope.$on('cancelCreateInvoiceForm', function () {
          ;
          $scope.showCreateInvoiceForm = false;
        });

        $scope.showCreateRecurringInvoiceForm = function () {
          $scope.showCreateInvoiceForm = true;
        };

        $scope.deleteAllRecurringInvoice = function () {
          console.log('delete all ' + $scope.company.id);
          //RecurringService.deleteAllRecurringInvoicesByCompany(companyId, callback)
        };

      }]);

}());
