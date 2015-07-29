'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.editServiceCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        if ($scope.service) {
          $scope.editService = {
            id: $scope.service.versionedId.id,
            name: $scope.service.name,
            rate: $scope.service.rate,
            timeBlock: $scope.service.timeBlock * 60,
            taxable: true
          }
        } else {
          $scope.editService = {taxable: true};
        }

        $scope.cancelEditService = function () {
          $scope.$emit('cancelEditService');
        };

        $scope.saveEditService = function (form) {
          if (form.$valid) {
            $scope.disabledSaveButton = true;
            ServicesService.save({
              id: $scope.editService.id,
              name: $scope.editService.name,
              rate: $scope.editService.rate,
              timeBlock: $scope.editService.timeBlock / 60,
              taxable: true
            }, function () {
              $scope.disabledSaveButton = false;
              $scope.$emit('cancelEditService');
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
          for (var i = 0; i < $scope.services.length; i++) {
            if ((ngModelCtrl.$viewValue.toLowerCase() === $scope.services[i].name.toLowerCase()) && (modelId !== $scope.services[i].versionedId.id)) {
              uniqueNameCount++;
            }
          }
          ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
        };

      }]);

}());
