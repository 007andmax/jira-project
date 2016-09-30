'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.editServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        if ($scope.service) {
          $scope.editService = {
            versionedId: $scope.service.versionedId,
            name: $scope.service.name,
            rate: $scope.service.rate,
            timeBlock: Math.round($scope.service.timeBlock * 60),
            taxable: $scope.service.taxable,
            billable: $scope.service.billable
          }
        } else {
          $scope.editService = {
            taxable: true,
            billable: true
          };
        }

        $scope.saveEditService = function (form) {
          if (form.$valid) {
            $scope.disabledSaveButton = true;
            ServicesService.save({
              versionedId: $scope.editService.versionedId,
              name: $scope.editService.name,
              rate: $scope.editService.rate,
              timeBlock: $scope.editService.timeBlock / 60,
              taxable: $scope.editService.taxable,
              billable: $scope.editService.billable
            }, function () {
              $scope.disabledSaveButton = false;
              $rootScope.$broadcast('cancelEditForm');
            })
          } else {
            $scope.triedToSaveService = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.validateServiceName = function (ngModelCtrl, modelId) {
          var uniqueNameCount = 0;

          if ($scope.services) {
            for (var i = 0; i < $scope.services.length; i++) {
              if ((ngModelCtrl.$viewValue.toLowerCase() === $scope.services[i].name.toLowerCase()) && (modelId !== $scope.services[i].versionedId.id)) {
                uniqueNameCount++;
              }
            }
          }

          ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
        };

        $scope.getValidationMessage = function (form) {

          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editServiceName && form.editServiceName.$error) {

            if (form.editServiceName.$error.maxlength) {
              return 'Service name exceeds maximum length.';
            }

            if (form.editServiceName.$error.minlength) {
              return 'Service name is too short!';
            }

            if (form.editServiceName.$error.unique) {
              return 'Service name already exists!';
            }
          }

          if (form.timeBlock && form.timeBlock.$dirty && form.timeBlock.$error && form.timeBlock.$error.invalidwhen) {
            return 'Minimal Time Slice should be greater than 0.';
          }
        };

      }]);

}());
