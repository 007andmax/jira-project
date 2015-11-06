'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.createInvoiceCtrl',
    ['$scope', 'RecurringService', 'BillableService', '$rootScope',
      function ($scope, RecurringService, BillableService, $rootScope) {

        $scope.actualInvoiceNumber = BillableService.getActualInvoiceNumber($scope, function (value) {
          $scope.actualInvoiceNumber = value;
        });

        var day = 1000 * 60 * 60 * 24;
        $scope.minSentOnDate = new Date(Date.now() + day);

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

            $scope.createInvoice.sentOn.setHours(0);
            $scope.createInvoice.sentOn.setMinutes(0);
            $scope.createInvoice.sentOn.setSeconds(0);
            $scope.createInvoice.sentOn.setMilliseconds(0);

            RecurringService.createRecurringInvoice({
              products: [],
              services: [],
              sentOn: $scope.createInvoice.sentOn.getTime(),
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
