'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.companyInvoicesCtrl',
    ['$scope', 'RecurringService',
      function ($scope, RecurringService) {

        $scope.companyRecurringInvoices = RecurringService.getCompanyRecurringInvoices($scope.company.id, $scope, function () {
          $scope.$emit('toggleRecurringInvoices');
        });

      }]);

}());
