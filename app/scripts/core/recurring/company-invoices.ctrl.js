'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.companyInvoicesCtrl',
    ['$scope', 'RecurringService', '$timeout',
      function ($scope, RecurringService, $timeout) {

        $scope.companyRecurringInvoices = RecurringService.getCompanyRecurringInvoices($scope.recurringCompany.company.id, $scope, function () {
          $scope.$emit('toggleRecurringInvoices');

          $scope.$watch('highlightInvoiceId', function (invoiceId) {
            if (invoiceId) {

              $scope.$broadcast('showInvoice-' + invoiceId);

              $timeout(function () {
                $scope.setHighlightInvoiceId();
              }, 3000)
            }
          })

        });

      }]);

}());
