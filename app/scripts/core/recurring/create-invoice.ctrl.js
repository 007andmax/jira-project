'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.createInvoiceCtrl',
    ['$scope', 'RecurringService', 'BillableService', '$rootScope', '$filter',
      function ($scope, RecurringService, BillableService, $rootScope, $filter) {

        $scope.actualInvoiceNumber = BillableService.getActualInvoiceNumber($scope, function (value) {
          $scope.actualInvoiceNumber = value;
        });

        var day = 1000 * 60 * 60 * 24;
        $scope.minSentOnDate =  $filter('date')(new Date(Date.now() + day), 'd MMM yyyy');

        $scope.frequency = {
          WEEKLY: 'Weekly',
          MONTHLY: 'Monthly',
          YEARLY: 'Yearly'
        };

        $scope.createInvoice = {
          sentOn: $scope.minSentOnDate,
          frequency: 'WEEKLY'
        };

        $scope.$watchCollection(function () {
          return [$scope.createInvoice.sentOn, $scope.createInvoice.frequency]
        }, function () {
          var date = new Date($scope.createInvoice.sentOn);
          if ($scope.createInvoice.frequency === 'WEEKLY') {
            $scope.createNextDueDate = date.setDate(date.getDate() + 7);
          } else if ($scope.createInvoice.frequency === 'MONTHLY') {
            $scope.createNextDueDate = date.setMonth(date.getMonth() + 1);
          } else {
            $scope.createNextDueDate = date.setFullYear(date.getFullYear() + 1);
          }
        }, true);


        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveInvoice || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelCreateRecurringInvoice = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.createRecurringInvoice = function (form) {
          if (form.$valid) {
            $scope.disabledCreateButton = true;

            var dateSentOn = new Date($scope.createInvoice.sentOn);

            dateSentOn.setHours(0);
            dateSentOn.setMinutes(0);
            dateSentOn.setSeconds(0);
            dateSentOn.setMilliseconds(0);

            RecurringService.createRecurringInvoice({
              products: [],
              services: [],
              sentOn: dateSentOn.getTime(),
              frequency: $scope.createInvoice.frequency
            }, $scope.recurringCompany.company.id, function () {
              $scope.$emit('cancelEditForm');
              $scope.disabledCreateButton = false;
            })
          } else {
            $scope.triedToSaveInvoice = true;
          }
        };

      }]);

}());
