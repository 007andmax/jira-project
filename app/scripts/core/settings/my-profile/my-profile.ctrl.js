'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService',
      function ($scope, $state, $stateParams, $location, UsersService) {

        $scope.aboutMe = $scope.currentUser.status;
        //$scope.password = {
        //  oldPassword: '',
        //  newPassword: ''
        //};

        $scope.userProfile = UsersService.getUserProfile(function (a) {
          $scope.userProfile = $scope.userProfile.staticCopy();

          if (!$scope.userProfile.address) {
            $scope.userProfile.address = {
              phoneNumbers: []
            }
          }
          $scope.loadUserProfile = true;
        });

        $scope.saveEmailNotifications = function (form) {

          if (form.$valid) {

            var emailObjToSend = {
              newDevice: $scope.userProfile.emailNotifications.newDevice,
              ticketCreated: $scope.userProfile.emailNotifications.ticketCreated
            };

            UsersService.saveForUserProfile(emailObjToSend, 'email', function () {
              form.$setPristine();
            });
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        //$scope.savePassword = function (form) {
        //  if (form.$valid) {
        //    $scope.savingPasswordInProcess = false;
        //
        //    var password = {
        //      oldPassword: hex_md5($scope.password.oldPassword),
        //      newPassword: hex_md5($scope.password.newPassword)
        //    };
        //
        //    UsersService.saveForUserProfile(password, 'password', function (resp) {
        //      if (resp.code === 422) {
        //        form.oldPassword.$setValidity('notCorrectPass', false)
        //      } else {
        //        form.$setPristine();
        //        $scope.password = {
        //          oldPassword: '',
        //          newPassword: ''
        //        };
        //      }
        //      $scope.savingPasswordInProcess = false;
        //    });
        //  }
        //};

        $scope.saveAboutMe = function (form) {
          if (form.$valid) {

            UsersService.saveForUserProfile($scope.aboutMe, 'status', function () {
              form.$setPristine();
            });

          }
        };

        //$scope.$watch('password.oldPassword', function () {
        //  $scope.passwordForm.oldPassword.$setValidity('notCorrectPass', true)
        //});

      }]);

}());
