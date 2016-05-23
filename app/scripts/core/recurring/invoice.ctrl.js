'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.invoiceCtrl',
    ['$scope', 'CompaniesService', 'RecurringService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, CompaniesService, RecurringService, $timeout, UserConfirmationsService) {

        $scope.disabledDelete = false;

        $scope.companyOfInvocie = CompaniesService.getOneById($scope.invoice.company.id);

        $scope.deleteRecurringInvoice = function () {
          $scope.disabledDelete = true;
          var confirmMesage = 'Do you want to delete order?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            RecurringService.deleteRecurringInvoice($scope.invoice.id);
          });
        };

      }]);

}());
