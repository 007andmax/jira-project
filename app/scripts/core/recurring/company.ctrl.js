'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.companyCtrl',
    ['$scope', 'CompaniesService', 'RecurringService', '$timeout', '$rootScope',
      function ($scope, CompaniesService, RecurringService, $timeout, $rootScope) {


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

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateInvoiceForm = false;
        });

        $scope.showCreateRecurringInvoiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateInvoiceForm = true;
        };

        $scope.deleteAllRecurringInvoice = function () {
          RecurringService.deleteAllRecurringInvoicesByCompany($scope.recurringCompany.company.id, $scope.recurringCompanies);
        };

        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
        };

        $scope.$on($scope.recurringCompany.company.id + '-showInvoice', function (event, invoiceId) {
          if (!$scope.showInvoices) {
            $scope.toggleRecurringInvoices();
          }

          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
