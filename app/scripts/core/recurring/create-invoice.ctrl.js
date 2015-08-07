'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.createInvoiceCtrl',
    ['$scope', 'RecurringService', 'BillableService',
      function ($scope, RecurringService, BillableService) {

        $scope.actualInvoiceNumber = BillableService.getActualInvoiceNumber($scope, function (value) {
          $scope.actualInvoiceNumber = value;
        });

        $scope.frequency = {
          WEEKLY: 'Weekly',
          MONTHLY: 'Monthly',
          YEARLY: 'Yearly'
        };

        $scope.createInvoice = {
          products: [],
          services: [],
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

        $scope.open = function () {
          var today = new Date();
          $scope.validateMinDate = today.setDate(today.getDate() + 1);
          $scope.opened = true;
        };

        $scope.cancelCreateRecurringInvoice = function () {
          $scope.$emit('cancelCreateInvoiceForm');
        };

        $scope.createRecurringInvoice = function (form) {
          if (form.$valid) {
            $scope.disabledCreateButton = true;
            $scope.createInvoice.sentOn = $scope.createInvoice.sentOn.getTime();
            console.log($scope.createInvoice);
            RecurringService.createRecurringInvoice($scope.createInvoice, $scope.company.id, function () {
              $scope.$emit('cancelCreateInvoiceForm');
              $scope.disabledCreateButton = false;
            })
          } else {
            $scope.triedToSaveInvoice = true;
          }
        };

      }]);

}());
