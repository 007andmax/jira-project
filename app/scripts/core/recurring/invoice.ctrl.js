'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.invoiceCtrl',
    ['$scope', 'RecurringService', '$rootScope',
      function ($scope, RecurringService, $rootScope) {

        $scope.deleteRecurringInvoice = function () {
          console.log($scope.invoice.id);
          RecurringService.deleteRecurringInvoice($scope.invoice.id);
        };

        $scope.showCreateServiceInvoice = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateService = true;
        };

        $scope.$on("cancelCreateServiceInvoice", function () {
          $scope.showCreateService = false;
        });

        $scope.showCreateProductInvoice = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateProduct = true;
        };

        $scope.$on("cancelCreateProductInvoice", function () {
          $scope.showCreateProduct = false;
        });

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateService = false;
          $scope.showCreateProduct = false;
        });

      }]);

}());
