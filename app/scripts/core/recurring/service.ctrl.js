'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.serviceCtrl',
    ['$scope', 'RecurringService', 'ServicesService', '$rootScope',
      function ($scope, RecurringService, ServicesService, $rootScope) {

        $scope.deleteServiceInvoice = function () {
          RecurringService.deleteServiceExpenseFromRecInv($scope.invoice.id, $scope.service.id);
        };

        $scope.showEditServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showEditService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showEditService = false;
          $scope.showCreateProduct = false;
        });

      }]);

}());
