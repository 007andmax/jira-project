'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.deviceSettingsCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, DevicesService, UserConfirmationsService) {
        $scope.triedToSave = false;
        $scope.rescanIntervals = [
          { label: '1 hour', value: 3600000 },
          { label: '4 hour', value: 14400000 },
          { label: '1 day', value: 86400000 },
          { label: '7 days', value: 604800000 },
          { label: '30 days', value: 18144000000 }
        ];

        $scope.newCredential = {};
        $scope.passwordShown = [];
        DevicesService.getCredentialsByCompany($scope.companyId, function (resp) {
          $scope.credentials = resp;
        });
        DevicesService.getAgentSettingsByCompany($scope.companyId, function (resp) {
          $scope.settings = resp;
          for (var i = 0, len = $scope.rescanIntervals.length; i < len; i++) {
            var obj = $scope.rescanIntervals[i];
            if (obj.value === resp.rescanTime) {
              $scope.settings.rescanTime = obj;
              break;
            }
          }
        });

        $scope.isShowingErrors = function (form, field) {
          return (form[field].$dirty || $scope.triedToSave) && form[field].$invalid;
        };

        $scope.$watch('newCredential.passwordConfirm', function (value) {
          if ($scope.deviceSettingsForm.password.$dirty && $scope.deviceSettingsForm.passwordConfirm.$dirty) {
            $scope.deviceSettingsForm.passwordConfirm.$setValidity('equal', $scope.newCredential.password === value);
          }
        });

        $scope.removeCredential = function (index) {
          var confirmMesage = 'Do you want to delete ' + $scope.credentials[index].login + '?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            $scope.updating = true;
            $scope.credentials.splice(index, 1);

            DevicesService.saveCredentials($scope.credentials, $scope.companyId, function () {
              $scope.updating = false;
            });
          });
        };

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

        $scope.saveDeploymentSettings = function () {
          var settings = angular.copy($scope.settings);

          settings.rescanTime = settings.rescanTime.value;
          DevicesService.updateAgentSettings($scope.settings, $scope.companyId);
        };

      }]);

}());
