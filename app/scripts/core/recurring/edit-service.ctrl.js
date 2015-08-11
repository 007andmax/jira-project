'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editServiceCtrl',
    ['$scope', 'RecurringService', 'ServicesService',
      function ($scope, RecurringService, ServicesService) {

        $scope.editService = {item: {}};

        if ($scope.service !== undefined) {

          $scope.editService = {
            id: $scope.service.id,
            description: $scope.service.description,
            date: $scope.service.date,
            quantity: $scope.service.quantity,
            item: {
              versionedId: $scope.service.item.versionedId,
              name: $scope.service.item.name
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
            RecurringService.saveRecInvServiceExpense($scope.invoice.id, $scope.editService.id ? {
              id: $scope.editService.id,
              description: $scope.editService.description,
              date: $scope.editService.date,
              quantity: $scope.editService.quantity,
              item: {
                versionedId: $scope.editService.item.versionedId,
                name: $scope.editService.item.name
              }
            } : {
              description: $scope.editService.description,
              item: {
                versionedId: $scope.editService.item.versionedId,
                name: $scope.editService.item.name
              }
            }, function () {
              $scope.disabledCreateServiceButton = false;
              $scope.$emit('cancelEditForm');
            })
          } else {
            $scope.triedToSaveService = true;
          }
        };

      }]);

}());
