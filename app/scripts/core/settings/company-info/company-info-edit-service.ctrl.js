'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.editServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        if ($scope.service) {
          $scope.editService = angular.copy($scope.service);
          $scope.editService.timeBlock = $scope.editService.timeBlock * 60;
        } else {
          $scope.editService = {
            taxable: true,
            isDefault: true,
            billable: true
          };
        }

        $scope.saveEditService = function (form) {
          if (form.$valid) {
            $scope.triedToSaveService = false;

            ServicesService.save($scope.editService, function (resp) {
              if ($scope.service) {
                $rootScope.$broadcast('cancelEditForm');
              } else {
                $scope.editService = {taxable: true};
              }

              form.$setPristine();
            });
          } else {
            $scope.triedToSaveService = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.validateServiceName = function (ngModelCtrl) {
          var uniqueNameCount = 0;
          for (var i = 0; i < $scope.services.length; i++) {
            if (ngModelCtrl.$viewValue.toLowerCase() === $scope.services[i].name.toLowerCase()) {
              uniqueNameCount++;
            }
          }
          ngModelCtrl.$setValidity('unique', setvalidityName());

          function setvalidityName() {

            if ($scope.service) {
              return uniqueNameCount < 1 || $scope.service.name === $scope.editService.name;
            } else {
              return uniqueNameCount < 1;
            }

          }
        };

        $scope.getValidationMessage = function (form) {

          if (form.$pristine) {
            $scope.disabledSaveButton = false;
            return;
          }

          if (form.$error.required) {
            for (var i = 0; i < form.$error.required.length; i++) {
              if ($scope.isShowingErrors(form, form.$error.required[i].$name)) {
                $scope.disabledSaveButton = true;
                return 'Please fill in the required field(s).';
              }
            }
          }

          if (form.editServiceName && form.editServiceName.$error && form.editServiceName.$dirty) {

            if (form.editServiceName.$error.maxlength) {
              $scope.disabledSaveButton = true;
              return 'Service name exceeds maximum length.';
            }

            if (form.editServiceName.$error.minlength) {
              $scope.disabledSaveButton = true;
              return 'Service name is too short!';
            }

            if (form.editServiceName.$error.unique) {
              $scope.disabledSaveButton = true;
              return 'Service name already exists!';
            }
          }

          if (form.timeBlock && form.timeBlock.$dirty && form.timeBlock.$error && form.timeBlock.$error.invalidwhen) {
            $scope.disabledSaveButton = true;
            return 'Minimal Time Slice should be greater than 0.';
          }
          $scope.disabledSaveButton = false;
        };

      }]);

}());
