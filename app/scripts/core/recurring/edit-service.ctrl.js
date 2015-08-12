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
            date: $scope.service.date,
            quantity: $scope.service.quantity,
            item: {
              versionedId: $scope.service.item.versionedId,
              name: $scope.service.item.name,
              rate: $scope.service.item.rate
            }
          };
        }

        $scope.numberPattern = /^\d?[0-9]{0,17}$/;

        $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.cancelEditService = function () {
          $scope.$emit('cancelEditForm');
        };

        $scope.saveService = function (form) {
          if (form.$valid) {
            $scope.disabledCreateServiceButton = true;
            RecurringService.saveRecInvServiceExpense($scope.invoice.id, $scope.editService, function () {
              $scope.disabledCreateServiceButton = false;
              $scope.$emit('cancelEditForm');
            })
          } else {
            $scope.triedToSaveService = true;
          }
        };

      }]);

}());
