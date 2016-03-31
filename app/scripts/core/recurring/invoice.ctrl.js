'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.invoiceCtrl',
    ['$scope', 'CompaniesService', 'RecurringService',
      function ($scope, CompaniesService, RecurringService) {

        $scope.disabledDelete = false;

        $scope.companyOfInvocie = CompaniesService.getOneById($scope.invoice.company.id);

        $scope.$watchGroup(function () {
          return [$scope.invoice.products, $scope.invoice.services]
        }, function () {
          $scope.expenses = getArrayExpenses()
        });

        $scope.deleteRecurringInvoice = function () {
          $scope.disabledDelete = true;
          RecurringService.deleteRecurringInvoice($scope.invoice.id, function(){
            $scope.disabledDelete = false;
          });
        };

        function getArrayExpenses() {
          var arr = [];

          for (var i = 0, len = $scope.invoice.products.length; i < len; i++) {
            arr.push($scope.invoice.products[i])
          }

          for (var i = 0, len = $scope.invoice.services.length; i < len; i++) {
            arr.push($scope.invoice.services[i])
          }

          return arr;

        }

      }]);

}());
