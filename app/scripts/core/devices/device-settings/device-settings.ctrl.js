'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.deviceSettingsCtrl',
    ['$scope', 'DevicesService',
      function ($scope, DevicesService) {
        $scope.triedToSave = false;

        $scope.newCredential = {};
        $scope.passwordShown = [];
        DevicesService.getCredentialsByCompany($scope.companyId, function (resp) {
          $scope.credentials = resp;
        });

        $scope.isShowingErrors = function (form, field) {
          return (form[field].$dirty || $scope.triedToSave) && form[field].$invalid ;
        };

        $scope.$watch('newCredential.passwordConfirm', function (value) {
          if ($scope.deviceSettingsForm.password.$dirty && $scope.deviceSettingsForm.passwordConfirm.$dirty) {
            $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal', $scope.newCredential.password === value);
          }
        });

        $scope.updateCredentials = function (form) {
          if (form.$valid) {
            $scope.updating = true;
            $scope.credentials.push($scope.newCredential);
            DevicesService.saveCredentials($scope.credentials, $scope.companyId, function () {
              form.$setPristine();
              $scope.newCredential = {};
              $scope.updating = false;
            });
          } else {
            $scope.triedToSave = true;
          }
        };

      }]);

}());
