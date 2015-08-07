'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.productCtrl',
    ['$scope', 'RecurringService', 'ServicesService', '$rootScope',
      function ($scope, RecurringService, ServicesService, $rootScope) {

        $scope.deleteProductInvoice = function () {
          RecurringService.deleteProductExpenseFromRecInv($scope.invoice.id, $scope.product.id)
        };

        $scope.showEditProductForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showEditProduct = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showEditProduct = false;
          $scope.showCreateProduct = false;
        });

      }]);

}());
