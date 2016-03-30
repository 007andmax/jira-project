'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService', 'CompaniesService', '$rootScope',
      function ($scope, RecurringService, CompaniesService, $rootScope) {

        $scope.editInvoiceId = '';
        $scope.frequency = {
          sevenDays: '7 days',
          fifteenDays: '15 days',
          thirtyDays: '30 days',
          MONTHLY: 'Monthly',
          YEARLY: 'Yearly'
        };

        RecurringService.getAll($scope, function (resp) {
          $scope.invoices = resp;
        });

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope, function () {
          $scope.last30DaysValue = 0;

          for (var i = 0; i < $scope.recurringGraphData.length; i++) {
            $scope.last30DaysValue += $scope.recurringGraphData[i].sum;
          }
        });

        $scope.toogleEditForm = function (value) {
          if(!value){
            $scope.editInvoiceId = '';
          } else if(value === 'new-invoice'){
            $scope.editInvoiceId = 'new-invoice';
          } else {
            $scope.editInvoiceId = value;
          }

        };

        $scope.invoicesOrder = function (item) {
          if (item.company && item.company.id) {
            var company = CompaniesService.getOneById(item.company.id);
            return company.name
          }
        };

      }]);

}());
