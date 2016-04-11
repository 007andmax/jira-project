'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService', '$timeout',
      function ($scope, $state, $stateParams, $location, UsersService, $timeout) {

        $scope.saveMethods = [];
        $scope.formNames = [
          'basicInfoForm',
          'aboutMeForm',
          'passwordForm',
          'phoneNumbersForm',
          'miscInfoForm',
          'emailNotificationsForm'
        ];

        $scope.aboutMe = $scope.currentUser.status;
        $scope.password = {
          oldPassword: '',
          newPassword: ''
        };

        $scope.userProfile = UsersService.getUserProfile(function (a) {
          $scope.userProfile = $scope.userProfile.staticCopy();
          $scope.loadUsertProfile = true;

          if (!$scope.userProfile.address) {
            $scope.userProfile.address = {
              phoneNumbers: []
            }
          }
        });

        $scope.saveMethods.push(function (form) {

          //$scope.savingEmailInProcess = true;

          var emailObjToSend = {
            newDevice: $scope.userProfile.emailNotifications.newDevice,
            scheduleChanged: $scope.userProfile.emailNotifications.scheduleChanged,
            clientCompanyUpdated: $scope.userProfile.emailNotifications.clientCompanyUpdated,
            vendorUpdated: $scope.userProfile.emailNotifications.vendorUpdated
          };

          return {
            email: emailObjToSend,
            callback: function (form) {
              form.$setPristine();
            },
            formName: 'emailNotificationsForm'
          };

          //UsersService.saveForUserProfile(emailObjToSend, 'email', function () {
          //  $scope.savingEmailInProcess = false;
          //  form.$setPristine();
          //})
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.saveMethods.push(function (form) {
          //if (form.$valid) {
          //  $scope.savingPasswordInProcess = false;

          if ($scope.password.oldPassword && $scope.password.newPassword) {
            var password = {
              oldPassword: hex_md5($scope.password.oldPassword),
              newPassword: hex_md5($scope.password.newPassword)
            };

            return {
              password: password,
              callback: function (form, resp) {
                if (resp.code === 422) {
                  form.oldPassword.$setValidity('notCorrectPass', false)
                } else {
                  form.$setPristine();
                  $scope.password = {
                    oldPassword: '',
                    newPassword: ''
                  };
                }
              },
              formName: 'passwordForm'
            };
          }

          //UsersService.saveForUserProfile(password, 'password', function (resp) {
          //  if (resp.code === 422) {
          //    form.oldPassword.$setValidity('notCorrectPass', false)
          //  } else {
          //    form.$setPristine();
          //    $scope.password = {
          //      oldPassword: '',
          //      newPassword: ''
          //    };
          //  }
          //  $scope.savingPasswordInProcess = false;
          //})
          //}
        });

        $scope.saveMethods.push(function (form) {
          //if (form.$valid) {

          return {
            status: $scope.aboutMe,
            callback: function (form) {
              form.$setPristine();
            },
            formName: 'aboutMeForm'
          };

          //$scope.savingAboutMeInProcess = true;
          //
          //UsersService.saveForUserProfile($scope.aboutMe, 'status', function () {
          //  form.$setPristine();
          //  $scope.savingAboutMeInProcess = false;
          //});

          //}
        });

        $scope.$watch('password.oldPassword', function () {
          $scope.passwordForm.oldPassword.$setValidity('notCorrectPass', true)
        });

        $scope.saveProfileSettings = function () {

          $scope.savingProfileSettings = true;

          for (var index in $scope.formNames) {
            var form = $scope.profileInfoForm[$scope.formNames[index]];
            if (form.$invalid) {
              form.addressForm && form.addressForm.address && form.addressForm.address.$setDirty();
              $timeout(function () {
                $scope.$broadcast('scrollToErrorFild');
              }, 300);
              return;
            }
          }

          var settings = {},
            callbacks = [],
            formNames = [];

          $scope.saveMethods.forEach(function (func) {
            var obj = func(),
              key;

            if (obj) {
              key = Object.keys(obj)[0];
              if (obj.callback) {
                callbacks.push(obj.callback);
                formNames.push(obj.formName);
              }
              settings[key] = obj[key];
            }
          });

          UsersService.saveUserSettingsDto(settings, function (resp) {
            for (var index in callbacks) {
              callbacks[index]($scope.profileInfoForm[formNames[index]], resp);
            }
            $scope.savingProfileSettings = false;
          });

        };

      }]);

}());
