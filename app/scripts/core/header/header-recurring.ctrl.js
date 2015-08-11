'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.recurringCtrl',
    ['$scope', '$rootScope', 'RecurringService',
      function ($scope, $rootScope, RecurringService) {

        $scope.searchInvoice = RecurringService.search;

        $scope.showInvoice = function (invoice) {
          $rootScope.$broadcast(invoice.company.id + '-showInvoice', invoice.id)
        }

      }]);

}());
