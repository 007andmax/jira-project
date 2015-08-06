'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService',
      function ($scope, RecurringService) {

        $scope.companySelection = {};

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope);

        $scope.recurringCompanies = RecurringService.getRecurringCompanies($scope);

      }]);

}());
