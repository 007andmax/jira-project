'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editServiceCtrl',
    ['$scope', 'RecurringService', 'ServicesService',
      function ($scope, RecurringService, ServicesService) {

        $scope.editService = {};

        if ($scope.service !== undefined) {

          $scope.editService = {
            id: $scope.service.id,
            description: $scope.service.description,
            date: $scope.toUTCDate($scope.service.date),
            quantity: Math.floor($scope.service.quantity * 60),
            sum: $scope.service.sum,
            item: {
              versionedId: $scope.service.item.versionedId,
              name: $scope.service.item.name,
              rate: $scope.service.item.rate
            }
          };
        }

        $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.recurringCompany.company.id);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditService = function () {
          $scope.$emit('cancelEditForm');
        };

        $scope.saveService = function (form) {

          if (form.$valid) {
            $scope.disabledCreateServiceButton = true;

            var expense = {
              description: $scope.editService.description,
              quantity: $scope.editService.quantity / 60,
              sum: $scope.editService.sum,
              item: {
                versionedId: $scope.editService.item.versionedId,
                name: $scope.editService.item.name
              }
            };

            if ($scope.editService.id) {
              expense.id = $scope.editService.id;
            }

            RecurringService.saveRecInvServiceExpense($scope.invoice.id, expense, function () {
              $scope.disabledCreateServiceButton = false;
              $scope.$emit('cancelEditForm');
            })
          } else {
            $scope.triedToSaveService = true;
          }
        };

        $scope.getValidationMessage = function (form) {
          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editServiceName && form.editServiceName.$error && form.editServiceName.$error.parse) {
            return 'Please select service from dropdown.';
          }

          if (form.editServiceDescription && form.editServiceDescription.$error && form.editServiceDescription.$error.maxlength) {
            return 'Description exceeds maximum length.';
          }
        };

      }]);

}());
