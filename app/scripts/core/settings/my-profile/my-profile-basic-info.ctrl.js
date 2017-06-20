'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileBasicInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService', '$timeout',
      function ($scope, $state, $stateParams, $location, UsersService, $timeout) {

        $scope.editUser = angular.copy($scope.currentUser);
        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.accountType = {
          SUPER_TECH_ADMIN: "Super Admin",
          ADMIN: "Administrator",
          USER: "User"
        };

        $scope.validateLink = function (value) {
          $scope.validLink = {
            required: !value,
            pattern: !value.match($scope.linkPattern)
          };
        };

        $scope.validateUserEmail = function (ngModelCtrl, modelId, afterValidationCallback) {
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', true, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.$watch('editUser.avatar', function (newValue) {
          if (newValue !== undefined && $scope.loadUserProfile) {
            $scope.saveBasicInfo($scope.basicInfoForm);
          }
        });

        $scope.saveBasicInfo = function (form) {
          if (form.$valid) {
            var userObjToSend = {
              avatar: $scope.editUser.avatar,
              firstName: $scope.editUser.firstName,
              lastName: $scope.editUser.lastName,
              designation: $scope.editUser.designation,
              primaryEmail: $scope.editUser.primaryEmail,
              signature: {
                content: $scope.userProfile.signature ? $scope.userProfile.signature.content : undefined
              }
            };

            if (($scope.editUser.secondaryEmail != null) && ($scope.editUser.secondaryEmail.trim().length < 1)) {
              userObjToSend.secondaryEmail = undefined;
            } else {
              userObjToSend.secondaryEmail = $scope.editUser.secondaryEmail;
            }

            UsersService.saveForUserProfile(userObjToSend, 'basic', function () {
              form.$setPristine();
            })
          }
        };

        $scope.saveBasicInfoWithTimeout = function (form) {
          $timeout(function () {
            $scope.saveBasicInfo(form);
          }, 150);
        };

      }]);

}());
