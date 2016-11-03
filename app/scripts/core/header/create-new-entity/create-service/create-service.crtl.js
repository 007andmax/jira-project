'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        var savedState = $scope.getLastSavedState('service');

        if (savedState.type === 'service' && savedState.item) {
          $scope.editService = angular.copy(savedState.item);
        } else {
          $scope.editService = {
            taxable: true,
            billable: true
          };
        }

        $scope.saveEditService = function (form) {
          if (form.$valid) {
            $scope.disabledSaveButton = true;
            var saveService = angular.copy($scope.editService);
            ServicesService.save(saveService, function (resp) {
              $scope.disabledSaveButton = false;

              $rootScope.$broadcast('newProductHasBeenCreated', resp.id);
              if (!$scope.savedState.items.length) {
                $scope.closeWindow();
              }
            });
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
