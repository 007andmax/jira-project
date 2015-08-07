'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.editServiceCtrl',
    ['$scope', 'RecurringService', 'ServicesService',
      function ($scope, RecurringService, ServicesService) {

        $scope.editService = {};

        if ($scope.service !== undefined) {

          $scope.editService.id = $scope.service.id;
          $scope.editService.description = $scope.service.description;
          $scope.editService.createdAt = $scope.service.createdAt;
          $scope.editService.item = {};
          $scope.editService.item.versionedId = $scope.service.item.versionedId;
          $scope.editService.item.timeBlock = Math.round($scope.service.item.timeBlock * 60);
          $scope.editService.item.name = $scope.service.item.name;
        }

        $scope.numberPattern = /^\d?[0-9]{0,17}$/;

        $scope.openServiceDate = function () {
          $scope.openedServiceDate = true;
        };

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
            RecurringService.saveRecInvServiceExpense($scope.invoice.id, {
              id: $scope.editService.id,
              description: $scope.editService.description,
              createdAt: $scope.editService.createdAt,
              item: {
                versionedId: $scope.editService.item.versionedId,
                timeBlock: $scope.editService.item.timeBlock / 60,
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
