'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileCtrl',
    ['$scope', '$state', '$stateParams', 'UsersService',
      function ($scope, $state, $stateParams, UsersService) {
        $scope.isAddressFocused = false;
        $scope.password = {};

        $scope.userProfile = UsersService.getUserProfile(function (a) {
          $scope.userProfile = $scope.userProfile.staticCopy();

          if (!$scope.userProfile.address) {
            $scope.userProfile.address = {
              phoneNumbers: []
            }
          }
          $scope.loadUserProfile = true;
        });

        $scope.$watch('currentUser.status', function (value) {
          $scope.aboutMe = value;
        }, true);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.saveAboutMe = function (form) {
          if (form.$valid) {

            UsersService.saveForUserProfile($scope.aboutMe, 'status', function () {
              form.$setPristine();
            });

          }
        };

        $scope.validateConfirmPassword = function (password, confirm, field) {
          if (password && confirm) {
            field.$setValidity('confirm', password === confirm);
          }
        };

        $scope.enableOnChange = function (field) {
          if (field.$invalid) {
            field.$setValidity('notCorrectPass', true);
          }
        };

        $scope.savePassword = function (form) {
          if (form.$valid) {
            UsersService.changePassword($scope.password.oldPassword, $scope.password.newPassword, function (resp) {
              if (resp.status !== 409) {
                $scope.password = {};
                form.$setPristine();
              }
              form.oldPassword.$setValidity('notCorrectPass', resp.status !== 409);
            });
          }
        };

      }]);

}());
