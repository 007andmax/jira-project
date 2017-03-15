'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        var savedState = $scope.getLastSavedState('service');

        var origin = savedState.item;
        if (savedState.type === 'service' && origin) {
          $scope.editService = angular.copy(origin);
        } else {
          $scope.editService = {
            billable: true,
            isDefault: true
          };
        }

        $scope.saveEditService = function (form) {
          if (form.$valid) {
            $scope.disabledSaveButton = true;
            var saveService = angular.copy($scope.editService);
            ServicesService.save(saveService, function (resp) {
              $scope.disabledSaveButton = false;

              $rootScope.$broadcast('newServiceHasBeenCreated', resp.id);
              if (!$scope.savedState.items.length) {
                $scope.closeWindow();
              }
            });
          } else {
            $scope.triedToSaveService = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.validateServiceName = function (ngModelCtrl, modelId, afterValidationCallback) {
          ServicesService.isNameUnique($scope.editService.name, modelId, function (resp) {
            ngModelCtrl.$setValidity('unique', resp.valid);
            afterValidationCallback();
          });
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

        $scope.$on('createNewWindowClosing', createNewWindowClosing);

        function createNewWindowClosing() {
          var service = $scope.editService;
          var isServiceChanged;

          if (origin) {
            isServiceChanged = service.name !== origin.name || service.rate !== origin.rate;
          } else {
            isServiceChanged = service.name || service.rate;
          }

          if (isServiceChanged) {
            $scope.savedState.types.unshift('service');
            $scope.savedState.items.unshift($scope.editService);
          }
        }

      }]);

}());
